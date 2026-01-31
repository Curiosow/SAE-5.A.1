export const usePlayerStats = () => {
    const apiUrl = useApiUrl()

    const computePlayerStats = (events: any[], position: string) => {
        const isGB = position === 'G' || position === 'GB';

        const stats: any = {
            is_gb: isGB,
            total_buts: 0,
            total_passes_decisives: 0,
            total_balles_perdues: 0,
            tirs_rates: 0,
            tirs_arretes: 0,
            efficacite_tir_pct: 0,
            buts_sur_tirs_ratio_brut: '0/0',
            arrets_total: 0,
            buts_encaisse: 0,
            tirs_non_cadres_recus: 0,
            pct_arret_global: 0,
            def_duels_gagnes: 0,
            def_duels_perdus: 0,
            def_contres: 0,
            def_recuperations: 0,
            def_sanctions_2min: 0,
            def_sanctions_jaune: 0,
            def_sanctions_rouge: 0,
            history: [], // Contiendra désormais un objet par match
            zones: {
                '9m': { ok: 0, tot: 0 },
                '6m': { ok: 0, tot: 0 },
                'Ailes': { ok: 0, tot: 0 },
                '7m': { ok: 0, tot: 0 }
            }
        };

        // On utilise une Map pour stocker TOUTES les stats par match
        const matchRecords = new Map<number, { goals: number, saves: number, recups: number, pdbs: number }>();

        events.forEach(ev => {
            const res = ev.resultat;
            const sec = ev.secteur || '';
            const mId = ev.matchId || ev.match_id;

            if (mId) {
                if (!matchRecords.has(mId)) {
                    matchRecords.set(mId, { goals: 0, saves: 0, recups: 0, pdbs: 0 });
                }
                const currentMatch = matchRecords.get(mId)!;

                // --- COMPTAGE PAR MATCH ---
                if (!isGB && res === 'But') {
                    stats.total_buts++;
                    currentMatch.goals++;
                }
                if (isGB && ['Ar GB', 'Arret', 'Arrêt'].includes(res)) {
                    stats.arrets_total++;
                    currentMatch.saves++;
                }
                if (ev.defenseplus?.includes('recup')) {
                    stats.def_recuperations++;
                    currentMatch.recups++; // Pour la courbe de récupération
                }
                if (res === 'PDB') {
                    stats.total_balles_perdues++;
                    currentMatch.pdbs++; // Pour la courbe de perte de balle
                }
            }

            // --- LOGIQUE DES ZONES ---
            if (['But', 'Ar GB', 'Arret', 'Arrêt'].includes(res)) {
                let zKey: '9m' | '6m' | 'Ailes' | '7m' = '6m';
                if (sec.includes('9m') || sec.includes('Central')) zKey = '9m';
                else if (sec.includes('AL') || sec.includes('Aile')) zKey = 'Ailes';
                else if (sec.includes('7m') || ev.jets7m) zKey = '7m';

                stats.zones[zKey].tot++;
                if (isGB) {
                    if (res !== 'But') stats.zones[zKey].ok++;
                } else {
                    if (res === 'But') stats.zones[zKey].ok++;
                }
            }

            // --- AUTRES STATS ---
            if (isGB && res === 'But') stats.buts_encaisse++;
            if (isGB && res === 'HC') stats.tirs_non_cadres_recus++;
            if (!isGB && ['Ar GB', 'HC', 'tir raté NC'].includes(res)) {
                stats.tirs_rates++;
                if (res === 'Ar GB') stats.tirs_arretes++;
            }
            if (ev.passed && ev.passed !== "") stats.total_passes_decisives++;
            if (ev.defensemoins?.includes('Sanction') || res?.includes('2min')) stats.def_sanctions_2min++;
            if (ev.defenseplus?.includes('duel gagné')) stats.def_duels_gagnes++;
            if (ev.defenseplus?.includes('contre')) stats.def_contres++;
            if (ev.defensemoins?.includes('Duel perdu')) stats.def_duels_perdus++;
        });

        // --- TRANSFORMATION DE L'HISTORIQUE ---
        // On trie par ID de match et on renvoie l'objet complet
        stats.history = Array.from(matchRecords.keys())
            .sort((a, b) => a - b)
            .map(id => matchRecords.get(id));

        // --- CALCULS DE POURCENTAGE ---
        if (isGB) {
            const totalTirsRecus = stats.arrets_total + stats.buts_encaisse;
            stats.pct_arret_global = totalTirsRecus > 0 ? (stats.arrets_total / totalTirsRecus) * 100 : 0;
            stats.buts_sur_tirs_ratio_brut = `${stats.arrets_total}/${totalTirsRecus}`;
        } else {
            const totalTirs = stats.total_buts + stats.tirs_rates;
            stats.efficacite_tir_pct = totalTirs > 0 ? (stats.total_buts / totalTirs) * 100 : 0;
            stats.buts_sur_tirs_ratio_brut = `${stats.total_buts}/${totalTirs}`;
        }

        return stats;
    };

    const fetchPlayersWithStats = async () => {
        try {
            const [eR, pR, plR] = await Promise.all([
                fetch(`${apiUrl}/evenement`),
                fetch(`${apiUrl}/positions`),
                fetch(`${apiUrl}/auth/players`)
            ]);
            const [evD, poD, plD] = await Promise.all([eR.json(), pR.json(), plR.json()]);

            return (plD || []).map((p: any) => {
                const playerEvents = (evD.docs || []).filter((ev: any) => ev.joueuse === p.nom_csv);
                const positionObj = (poD.docs || []).find((px: any) => px.player_id === p.id);
                const positionAbrev = positionObj?.abrevation || '';

                return {
                    ...p,
                    events: playerEvents,
                    position: positionAbrev,
                    stats: computePlayerStats(playerEvents, positionAbrev)
                };
            });
        } catch (error) {
            console.error("Erreur API:", error);
            return [];
        }
    };

    return { fetchPlayersWithStats };
};