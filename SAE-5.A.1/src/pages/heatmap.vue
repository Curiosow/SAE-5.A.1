<template>
  <main class="min-h-screen bg-[#F0F2F5] font-sans text-slate-900">
    <div class="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-24 pb-16">

      <header class="mb-6 flex flex-col items-center text-center">
        <h1 class="text-3xl font-black text-slate-800 tracking-tighter uppercase">Analyse Tactique</h1>
        <div class="mt-2 flex items-center gap-2">
          <span class="h-1 w-12 bg-[#925271] rounded-full"></span>
          <p class="text-xs text-slate-500 font-bold uppercase tracking-widest text-center">
            Sambre-Avesnois Handball • {{ selectedMatchId ? `Match ${selectedMatchId}` : 'Saison Globale' }}
          </p>
          <span class="h-1 w-12 bg-[#925271] rounded-full"></span>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">

        <section class="relative bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-white">
          <transition name="fade">
            <div v-if="isLoading" class="absolute inset-0 z-30 bg-white/90 backdrop-blur-sm flex items-center justify-center">
              <div class="flex flex-col items-center gap-4">
                <div class="h-12 w-12 rounded-full border-4 border-slate-100 border-t-rose-500 animate-spin"></div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Chargement des données...</p>
              </div>
            </div>
          </transition>

          <div class="p-4 sm:p-8 flex items-center justify-center">
            <div class="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-50" ref="heatmapContainer">

              <img src="/Terrain de basketball minimaliste.png" alt="Terrain" class="w-full h-auto object-contain opacity-80 select-none pointer-events-none grayscale-[0.2]" />

              <div v-for="(zone, key) in heatmapPoints" :key="key"
                   class="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center group"
                   :style="{ top: zone.y + '%', left: zone.x + '%' }">

                <div class="rounded-full transition-all duration-700 ease-out cursor-pointer group-hover:scale-125 blur-md mix-blend-multiply group-hover:blur-sm"
                     :style="getStyle(zone)">
                </div>

                <div class="opacity-0 group-hover:opacity-100 absolute mb-4 bottom-full pointer-events-none transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-[60]">
                  <div class="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl border border-white/10 min-w-[140px]">
                    <div class="text-[9px] text-slate-400 uppercase font-black mb-1 tracking-tighter">{{ zone.label }}</div>
                    <div class="flex justify-between items-end gap-4">
                      <span class="text-2xl font-light">{{ zone.count }}<span class="text-[10px] ml-1 text-slate-400 font-bold">ACT</span></span>
                      <div v-if="zone.count > 0" class="text-right">
                        <div class="text-[10px] font-bold" :class="selectedContext === 'attack' ? 'text-emerald-400' : 'text-rose-400'">
                          {{ Math.round((zone.goals / zone.count) * 100) }}% eff.
                        </div>
                        <div class="text-[9px] text-slate-500">{{ zone.goals }} buts</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-md"
                   :class="selectedTeam === ADV_TEAM_ID ? 'bg-slate-800 text-white' : (selectedContext === 'defense' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200')">
                <span v-if="selectedTeam === OUR_TEAM_ID">SAMBRE : {{ selectedContext === 'attack' ? 'Notre Attaque' : 'Notre Défense' }}</span>
                <span v-else>ADVERSAIRE</span>
              </div>
            </div>
          </div>
        </section>

        <aside class="space-y-6 self-start">
          <div class="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/60 border border-white sticky top-8">
            <h2 class="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> Configuration
            </h2>

            <div class="space-y-6">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Équipe Analysée</label>
                <div class="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
                  <button @click="selectedTeam = OUR_TEAM_ID; selectedPlayer = ''"
                          class="py-2 text-[10px] font-bold rounded-lg transition-all"
                          :class="selectedTeam === OUR_TEAM_ID ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'">
                    SAMBRE
                  </button>
                  <button @click="selectedTeam = ADV_TEAM_ID; selectedPlayer = ''"
                          class="py-2 text-[10px] font-bold rounded-lg transition-all"
                          :class="selectedTeam === ADV_TEAM_ID ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'">
                    ADVERSAIRE
                  </button>
                </div>
              </div>

              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Match sélectionné</label>
                <select v-model="selectedMatchId" class="custom-select">
                  <option :value="null">Tous les matchs (Global)</option>
                  <option v-for="match in matches" :key="match.id" :value="match.id">
                    {{ match.adversaire ? `vs ${match.adversaire}` : `Match ${match.id}` }}
                  </option>
                </select>
              </div>

              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Phase de jeu</label>
                <div class="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
                  <button @click="selectedContext = 'attack'; selectedPlayer = ''"
                          class="py-2 text-[10px] font-bold rounded-lg transition-all"
                          :class="selectedContext === 'attack' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'">
                    ATTAQUE
                  </button>
                  <button @click="selectedContext = 'defense'; selectedPlayer = ''"
                          class="py-2 text-[10px] font-bold rounded-lg transition-all"
                          :class="selectedContext === 'defense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'">
                    DÉFENSE
                  </button>
                </div>
              </div>

              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">
                  {{ selectedContext === 'attack' ? 'Tireuse (Joueuses de champ)' : 'Gardienne' }}
                </label>
                <select v-model="selectedPlayer" class="custom-select">
                  <option value="">
                    {{ selectedContext === 'defense' ? 'Toutes les gardiennes' : "Toutes les joueuses de champ" }}
                  </option>
                  <option v-for="p in playersList" :key="p" :value="p">{{ p }}</option>
                </select>
              </div>

              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Filtrer par type</label>
                <div class="flex flex-wrap gap-2">
                  <button v-for="opt in filterOptions" :key="opt.v"
                          @click="selectedResult = opt.v"
                          class="px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all"
                          :class="selectedResult === opt.v ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'">
                    {{ opt.l }}
                  </button>
                </div>
              </div>

              <div class="pt-6 border-t border-slate-100 space-y-4">
                <div class="flex justify-between items-end">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Volume total</span>
                  <span class="text-xl font-black">{{ filteredEvents.length }}</span>
                </div>
                <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficacité</span>
                    <span class="text-sm font-black" :class="selectedContext === 'attack' ? 'text-emerald-600' : 'text-rose-600'">
                      {{ totalEfficiency }}%
                    </span>
                  </div>
                  <div class="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                    <div class="h-full bg-slate-900 transition-all duration-1000" :style="{ width: totalEfficiency + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const apiUrl = useApiUrl()

// --- IDS ISSUS DE LA BDD ---
const OUR_TEAM_ID = "e2a4c7b1-9f3d-4e6a-8b2c-7d1e5f4c3a2b";
const ADV_TEAM_ID = "c6f3d2a4-8b12-4e77-9a3b-5d2f0c8e1a4b";

// --- CONFIG FILTRES ---
const ATK_KEYS = ["Att", "ER", "CA", "Transition", "But vide"];
const DEF_KEYS = ["Déf", "0-6", "1-5", "Repli"];
const TURNOVER_RESULTS = ['PDB', 'Marcher', 'Passage en force'];

type GameContext = 'attack' | 'defense';
type ShotResult = 'But' | 'Echec' | 'Pertes' | '';

interface HandballEvent { nom: string; resultat: string; secteur: string; joueuse: string; lieupb: string; matchId?: number | string; match_id?: number | string; team_id: string; }
interface Player { id: string; first_name: string; team_id: string; }
interface Position { player_id: string; name: string; }

const filterOptions = [
  { v: '', l: 'Tout' }, { v: 'But', l: 'Buts' }, { v: 'Echec', l: 'Échecs' }, { v: 'Pertes', l: 'Pertes' }
] as { v: ShotResult, l: string }[]

const ZONE_MAPPING: Record<string, {x: number, y: number, label: string}> = {
  "ALG": { x: 20, y: 63, label: "Aile Gauche" }, "ALD": { x: 80, y: 63, label: "Aile Droite" },
  "9m G": { x: 29, y: 25, label: "Arr. Gauche (9m)" }, "9m D": { x: 71, y: 25, label: "Arr. Droit (9m)" },
  "Central": { x: 50, y: 20, label: "Demi-Centre" },
  "6m G": { x: 26, y: 52, label: "Pivot Gauche" }, "6m D": { x: 74, y: 52, label: "Pivot Droit" }, "6m": { x: 50, y: 41, label: "Pivot Axe (6m)" },
  "Zone": { x: 66, y: 45, label: "Zone (6m - Proche but)" },
  "1 2": { x: 34, y: 45, label: "Secteur 1-2 (Ext G)" }, "2 3": { x: 35, y: 34, label: "Secteur 2-3 (Int G)" },
  "3 4": { x: 50, y: 31, label: "Secteur 3-4 (Central)" }, "4 5": { x: 65, y: 34, label: "Secteur 4-5 (Int D)" }, "5 6": { x: 66, y: 45, label: "Secteur 5-6 (Ext D)" },
  "7m": { x: 50, y: 41, label: "Jet de 7m" }, "CA": { x: 50, y: 91, label: "Contre-Attaque" }, "ER": { x: 70, y: 91, label: "Engagement Rapide" },
};

// --- STATE ---
const allEvents = ref<HandballEvent[]>([])
const allPlayers = ref<Player[]>([])
const allPositions = ref<Position[]>([])
const matches = ref<any[]>([])

const isLoading = ref(false)

const selectedTeam = ref(OUR_TEAM_ID);
const selectedPlayer = ref('')
const selectedResult = ref<ShotResult>('')
const selectedContext = ref<GameContext>('attack')

const selectedMatchId = ref<number | string | null>(null);

// --- LOGIQUE GARDIENNES (BDD + EN DUR) ---

const goalkeepersList = computed(() => {
  let gks = ["alix", "justicia", "adv_13", "adv_14"];

  if (allPositions.value.length > 0 && allPlayers.value.length > 0) {
    const gkIds = allPositions.value
        .filter(pos => pos.name === "GARDIENNE")
        .map(pos => pos.player_id);

    const dbGks = allPlayers.value
        .filter(p => gkIds.includes(p.id))
        .map(p => p.first_name.trim().toLowerCase());

    gks = [...new Set([...dbGks, "adv_13", "adv_14"])];
  }

  return gks;
});

const playersList = computed(() => {
  const names = new Set<string>();

  allEvents.value.forEach(e => {
    const eventMatchId = e.matchId || e.match_id;
    if (selectedMatchId.value !== null && String(eventMatchId) !== String(selectedMatchId.value)) return;

    if (e.team_id === selectedTeam.value && e.joueuse) {
      const playerNameRaw = e.joueuse.trim();
      const playerNameLower = playerNameRaw.toLowerCase();

      const isGk = goalkeepersList.value.includes(playerNameLower);

      if (selectedContext.value === 'defense') {
        if (isGk) names.add(playerNameRaw);
      }
      else {
        if (!isGk) names.add(playerNameRaw);
      }
    }
  });

  return Array.from(names).sort();
})

// --- LOGIQUE FILTRAGE DES EVENEMENTS ---

const filteredEvents = computed(() => {
  return allEvents.value.filter(e => {
    const eventMatchId = e.matchId || e.match_id;
    if (selectedMatchId.value !== null && String(eventMatchId) !== String(selectedMatchId.value)) return false;

    if (e.team_id !== selectedTeam.value) return false;

    const nom = e.nom || "";
    const isAtk = ATK_KEYS.some(k => nom.includes(k)) || nom.includes("7m");
    const isDef = DEF_KEYS.some(k => nom.includes(k)) || nom.toLowerCase().includes("adv");

    if (selectedContext.value === 'attack' ? !isAtk : !isDef) return false;

    if (selectedContext.value === 'attack') {
      if (e.joueuse) {
        const playerNameLower = e.joueuse.trim().toLowerCase();
        if (goalkeepersList.value.includes(playerNameLower)) {
          return false;
        }
      }
    }

    if (selectedPlayer.value) {
      const eventPlayer = e.joueuse?.trim().toLowerCase() || "";
      const dropdownPlayer = selectedPlayer.value.trim().toLowerCase();
      if (eventPlayer !== dropdownPlayer) return false;
    }

    const isGoal = e.resultat === 'But';
    const isTurnover = TURNOVER_RESULTS.includes(e.resultat);
    if (selectedResult.value === 'But' && !isGoal) return false;
    if (selectedResult.value === 'Echec' && (isGoal || isTurnover)) return false;
    if (selectedResult.value === 'Pertes' && !isTurnover) return false;

    return true;
  })
})

const totalEfficiency = computed(() => {
  const total = filteredEvents.value.length;
  if (total === 0) return 0;
  const goals = filteredEvents.value.filter(e => e.resultat === 'But').length;
  return Math.round((goals / total) * 100);
});

// --- HEATMAP ---
function normalizeZone(rawZone: string): string | null {
  if (!rawZone) return null;
  const z = rawZone.trim();
  const directMap: Record<string, string> = {
    "PVT": "6m", "Marcher": "Central", "PF Mauvais bloc": "Zone", "KF": "Zone",
    "Autres": "Central", "GE": "Central", "12": "1 2", "56": "5 6", "But vide": "Central",
    "ALG": "ALG", "ALD": "ALD"
  };
  if (directMap[z]) return directMap[z];
  if (z.includes("7m")) return "7m";
  if (z.includes("CA")) return "CA";
  if (z.includes("ER")) return "ER";
  if (z.includes("Central") || z.includes("9m +")) return "Central";
  if (z.includes("Ext G") || z.includes("9m G")) return "9m G";
  if (z.includes("Ext D") || z.includes("9m D")) return "9m D";
  return ["1 2", "2 3", "3 4", "4 5", "5 6", "Zone"].find(s => z.includes(s)) || null;
}

const heatmapPoints = computed(() => {
  const map: Record<string, any> = {};
  let maxVal = 0;

  filteredEvents.value.forEach(e => {
    const key = normalizeZone(e.secteur);
    if (key && ZONE_MAPPING[key]) {
      if (!map[key]) map[key] = { ...ZONE_MAPPING[key], count: 0, goals: 0 };
      map[key].count++;
      if (e.resultat === 'But') map[key].goals++;
      maxVal = Math.max(maxVal, map[key].count);
    }
  });

  const finalMax = maxVal || 1;
  return Object.values(map).map(p => ({ ...p, max: finalMax }));
})

function getStyle(zone: any) {
  const ratio = Math.log(zone.count + 1) / Math.log(zone.max + 1);
  const size = 30 + (ratio * 36);
  const hue = selectedContext.value === 'attack' ? (1 - ratio) * 150 + 20 : ratio * 30;
  return {
    backgroundColor: `hsla(${hue}, 90%, 50%, 0.7)`,
    boxShadow: `0 0 ${size/1.5}px hsla(${hue}, 90%, 50%, 0.5)`,
    width: `${size}px`, height: `${size}px`, borderRadius: '50%'
  }
}

// --- APPEL API SECURISÉ ---

async function fetchAllData() {
  isLoading.value = true
  try {
    const [resM, resE, resPl, resPos] = await Promise.all([
      fetch(`${apiUrl}/match`).catch(() => null),
      fetch(`${apiUrl}/evenement`).catch(() => null),
      fetch(`${apiUrl}/players`).catch(() => null),
      fetch(`${apiUrl}/positions2`).catch(() => null)
    ]);

    if (resM && resM.ok) { const json = await resM.json(); matches.value = json.docs || []; }
    if (resE && resE.ok) { const json = await resE.json(); allEvents.value = json.docs || []; }
    if (resPl && resPl.ok) { const json = await resPl.json(); allPlayers.value = json.docs || []; }
    if (resPos && resPos.ok) { const json = await resPos.json(); allPositions.value = json.docs || []; }

  } catch (e) {
    console.error("Erreur de récupération BDD:", e);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => fetchAllData())
</script>

<style scoped>
.custom-select {
  @apply w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-rose-500/20 outline-none appearance-none cursor-pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 1rem center; background-size: 1em;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>