// composables/usePlayerStats.ts
export const usePlayerStats = () => {
    const apiUrl = useApiUrl()

    const computePlayerStats = (events: any[], position: string) => {
        const isGB = position === 'G' || position === 'GB';
        const stats: any = {
            is_gb: isGB, total_buts: 0, arrets_total: 0, buts_encaisse: 0,
            total_passes_decisives: 0, total_balles_perdues: 0, tirs_rates: 0,
            def_duels_gagnes: 0, def_duels_perdus: 0, def_contres: 0,
            def_recuperations: 0, def_sanctions_2min: 0, history: [],
            zones: { 'Ailes': {ok:0, tot:0}, '6m': {ok:0, tot:0}, '9m': {ok:0, tot:0}, '7m': {ok:0, tot:0} }
        }

        const matchRecords = new Map<number | string, { goals: number, saves: number, recups: number, pdbs: number }>();

        events.forEach(ev => {
            // Normalisation des clés pour gérer J1, J2, J4 et les fichiers facultatifs
            const res = (ev.resultat || ev.Résultats || ev.resultats || '').trim();
            const mId = ev.match_id || ev.matchId || ev.Match_ID || 'M1';
            const dPlus = (ev['Déf +'] || ev['Déf+'] || ev.defense_plus || ev.defenseplus || '').toLowerCase();
            const dMoins = (ev['Déf -'] || ev['Déf-'] || ev.defense_moins || ev.defensemoins || '').toLowerCase();
            const sect = (ev.secteur || ev.Secteurs || ev.secteurs || '').toUpperCase();
            const pass = ev['Passes D'] || ev.passed || ev.Passes_D;

            if (!matchRecords.has(mId)) {
                matchRecords.set(mId, { goals: 0, saves: 0, recups: 0, pdbs: 0 });
            }
            const m = matchRecords.get(mId)!;

            // --- LOGIQUE ATTACK / GB ---
            if (!isGB && res === 'But') { stats.total_buts++; m.goals++; }
            if (isGB && (res.includes('Arrêt') || res.includes('Ar GB'))) { stats.arrets_total++; m.saves++; }
            if (res === 'But' && isGB) stats.buts_encaisse++;
            if (res === 'PDB') { stats.total_balles_perdues++; m.pdbs++; }

            // --- DÉFENSE (Extraction des colonnes Déf+ et Déf-) ---
            if (dPlus.includes('recup')) { stats.def_recuperations++; m.recups++; } // C'est ici que la donnée de Léa est captée
            if (dPlus.includes('duel gagné') || dPlus.includes('duel gagne')) stats.def_duels_gagnes++;
            if (dPlus.includes('contre')) stats.def_contres++;
            if (dMoins.includes('duel perdu')) stats.def_duels_perdus++;
            if (dMoins.includes('sanction') || res.includes('2min') || dMoins.includes('2 ou r')) stats.def_sanctions_2min++;

            // --- ZONES ---
            if (['But', 'Arrêt du GB', 'Ar GB', 'Poteau', 'Tir non cadré'].includes(res)) {
                let zKey: 'Ailes' | '6m' | '9m' | '7m' = '6m';
                if (sect.includes('9M') || sect.includes('CENTRAL')) zKey = '9m';
                else if (sect.includes('AL') || sect.includes('AILE')) zKey = 'Ailes';
                else if (sect.includes('7M') || ev.jets_7m || ev['Jets de 7m']) zKey = '7m';

                stats.zones[zKey].tot++;
                if (isGB) { if (res.includes('Arrêt') || res.includes('Ar GB')) stats.zones[zKey].ok++; }
                else { if (res === 'But') stats.zones[zKey].ok++; }
            }

            if (pass && pass !== "") stats.total_passes_decisives++;
            if (!isGB && (res.includes('Arrêt') || res.includes('HC') || res.includes('Tir non cadré') || res.includes('Poteau'))) stats.tirs_rates++;
        });

        // Tri de l'historique par Match ID
        stats.history = Array.from(matchRecords.keys())
            .sort((a, b) => String(a).localeCompare(String(b)))
            .map(id => matchRecords.get(id));

        // Sécurisation Anti-NaN
        const totalGB = stats.arrets_total + stats.buts_encaisse;
        const totalPlayer = stats.total_buts + stats.tirs_rates;
        stats.pct_arret_global = totalGB > 0 ? (stats.arrets_total / totalGB) * 100 : 0;
        stats.efficacite_tir_pct = totalPlayer > 0 ? (stats.total_buts / totalPlayer) * 100 : 0;

        return stats;
    }

    const fetchPlayersWithStats = async () => {
        try {
            const [eR, pR, plR] = await Promise.all([fetch(`${apiUrl}/evenement`), fetch(`${apiUrl}/positions`), fetch(`${apiUrl}/auth/players`)]);
            const [evD, poD, plD] = await Promise.all([eR.json(), pR.json(), plR.json()]);
            return (plD || []).map((p: any) => {
                const pEv = (evD.docs || []).filter((ev: any) => (ev.joueuse === p.nom_csv || ev.Joueuses === p.nom_csv));
                const pos = (poD.docs || []).find((px: any) => px.player_id === p.id)?.abrevation || '';
                return { ...p, events: pEv, position: pos, stats: computePlayerStats(pEv, pos) };
            });
        } catch (e) { return []; }
    }
    return { fetchPlayersWithStats }
}