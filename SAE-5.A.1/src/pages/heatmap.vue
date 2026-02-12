<template>
  <main class="min-h-screen bg-[#F0F2F5] font-sans text-slate-900">
    <div class="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-24 pb-16">

      <header class="mb-6 flex flex-col items-center text-center">
        <h1 class="text-3xl font-black text-slate-800 tracking-tighter uppercase">
          Analyse Tactique
        </h1>
        <div class="mt-2 flex items-center gap-2">
          <span class="h-1 w-12 bg-[#925271] rounded-full"></span>
          <p class="text-xs text-slate-500 font-bold uppercase tracking-widest">
            Visualisation des zones d'impact
          </p>
          <span class="h-1 w-12 bg-[#925271] rounded-full"></span>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">

        <section class="relative bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-white h-fit">
          <transition name="fade">
            <div v-if="isLoading" class="absolute inset-0 z-30 bg-white/90 backdrop-blur-sm flex items-center justify-center">
              <div class="flex flex-col items-center gap-4">
                <div class="h-12 w-12 rounded-full border-4 border-slate-100 border-t-rose-500 animate-spin"></div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Calcul des données...</p>
              </div>
            </div>
          </transition>

          <div class="p-4 sm:p-8 flex items-center justify-center">
            <div class="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-50" ref="heatmapContainer">

              <img src="/Terrain de basketball minimaliste.png"
                   alt="Terrain"
                   class="w-full h-auto object-contain opacity-80 select-none pointer-events-none grayscale-[0.2]" />

              <div v-for="(zone, key) in heatmapPoints" :key="key"
                   class="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center group"
                   :style="{ top: zone.y + '%', left: zone.x + '%' }">

                <div class="rounded-full transition-all duration-700 ease-out cursor-pointer group-hover:scale-125"
                     :class="zone.isDummy ? 'z-20 border-2 border-white shadow-[0_0_10px_rgba(79,70,229,0.8)]' : 'blur-md mix-blend-multiply group-hover:blur-sm'"
                     :style="getStyle(zone)">
                </div>

                <div v-if="showAllZones && zone.isDummy" class="absolute pointer-events-none text-[8px] font-black text-indigo-600 bg-white/90 px-1.5 py-0.5 rounded shadow-sm uppercase whitespace-nowrap translate-y-7 z-30 border border-indigo-100">
                  {{ zone.label }}
                </div>

                <div class="opacity-0 group-hover:opacity-100 absolute mb-4 bottom-full pointer-events-none transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-[60]">
                  <div class="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl border border-white/10 min-w-[140px]">
                    <div class="text-[9px] text-slate-400 uppercase font-black mb-1 tracking-tighter">{{ zone.label }}</div>
                    <div class="flex justify-between items-end gap-4">
                      <span class="text-2xl font-light">{{ zone.count }}<span class="text-[10px] ml-1 text-slate-400">actions</span></span>
                      <div v-if="zone.count > 0 && zone.goals > 0" class="text-right">
                        <div class="text-[10px] font-bold" :class="selectedContext === 'attack' ? 'text-emerald-400' : 'text-rose-400'">
                          {{ Math.round((zone.goals / zone.count) * 100) }}% eff.
                        </div>
                        <div class="text-[9px] text-slate-500">{{ zone.goals }} buts</div>
                      </div>
                    </div>
                  </div>
                  <div class="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1 border-r border-b border-white/10"></div>
                </div>
              </div>

              <div class="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-md"
                   :class="selectedContext === 'defense' ? 'bg-rose-50/90 border-rose-200 text-rose-600' : 'bg-emerald-50/90 border-emerald-200 text-emerald-600'">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="selectedContext === 'defense' ? 'bg-rose-400' : 'bg-emerald-400'"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2" :class="selectedContext === 'defense' ? 'bg-rose-500' : 'bg-emerald-500'"></span>
                </span>
                {{ selectedContext === 'defense' ? 'Défense Encaissée' : 'Efficacité Attaque' }}
              </div>
            </div>
          </div>
        </section>

        <aside class="space-y-6 self-start">
          <div class="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/60 border border-white sticky top-8">
            <h2 class="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
              Configuration
            </h2>

            <div class="space-y-6">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Sélection Match</label>
                <select v-model="selectedMatchId" class="custom-select">
                  <option :value="null">Global (Tous les matchs)</option>
                  <option v-for="match in matches" :key="match.id" :value="match.id">
                    {{ match.adversaire ? `vs ${match.adversaire}` : `Match ${match.id}` }}
                  </option>
                </select>
              </div>

              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Perspective</label>
                <div class="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/50">
                  <button @click="selectedContext = 'attack'; selectedPlayer = ''"
                          class="py-2 text-[10px] font-bold rounded-lg transition-all"
                          :class="selectedContext === 'attack' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'">
                    NOTRE ATTAQUE
                  </button>
                  <button @click="selectedContext = 'defense'; selectedPlayer = ''"
                          class="py-2 text-[10px] font-bold rounded-lg transition-all"
                          :class="selectedContext === 'defense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'">
                    NOTRE DÉFENSE
                  </button>
                </div>
              </div>

              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">
                  {{ selectedContext === 'attack' ? 'Tireuse' : 'Gardienne' }}
                </label>
                <select v-model="selectedPlayer" class="custom-select">
                  <option value="">Toute l'équipe</option>
                  <option v-for="p in playersList" :key="p" :value="p">{{ p }}</option>
                </select>
              </div>

              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Filtrer par type</label>
                <div class="flex flex-wrap gap-2">
                  <button v-for="opt in filterOptions"
                          :key="opt.v"
                          @click="selectedResult = opt.v"
                          class="px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all"
                          :class="selectedResult === opt.v ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'">
                    {{ opt.l }}
                  </button>
                </div>
              </div>

              <div class="pt-4 border-t border-slate-100">
                <label class="flex items-center cursor-pointer group">
                  <div class="relative">
                    <input type="checkbox" v-model="showAllZones" class="sr-only">
                    <div class="w-10 h-5 bg-slate-200 rounded-full shadow-inner transition-colors" :class="showAllZones ? 'bg-indigo-600' : 'bg-slate-200'"></div>
                    <div class="absolute -left-1 -top-1 w-7 h-7 bg-white rounded-full shadow border border-slate-200 transition-transform" :class="showAllZones ? 'translate-x-5 border-indigo-600' : 'translate-x-0'"></div>
                  </div>
                  <div class="ml-3">
                    <span class="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Debug Mode</span>
                    <p class="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Afficher tous les secteurs</p>
                  </div>
                </label>
              </div>

              <div class="pt-6 border-t border-slate-100">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Densité d'actions</span>
                  <span class="text-[10px] font-bold text-slate-900">{{ filteredEvents.length }} total</span>
                </div>
                <div class="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div class="h-full w-1/3 bg-emerald-400/30"></div>
                  <div class="h-full w-1/3 bg-orange-400/40"></div>
                  <div class="h-full w-1/3 bg-rose-500/60"></div>
                </div>
                <div class="flex justify-between mt-2 text-[8px] font-black text-slate-400 uppercase">
                  <span>Faible</span>
                  <span>Modérée</span>
                  <span>Élevée</span>
                </div>

                <div v-if="unmappedCount > 0" class="mt-4 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold border border-amber-200 animate-pulse">
                  ⚠️ {{ unmappedCount }} ACTIONS HORS-ZONE
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

type GameContext = 'attack' | 'defense';
type ShotResult = 'But' | 'Echec' | 'Pertes' | '';

interface HandballEvent {
  nom: string; resultat: string; secteur: string; joueuse: string; lieupb: string; matchId: number;
}

const ZONE_MAPPING: Record<string, {x: number, y: number, label: string}> = {
  "ALG": { x: 20, y: 63, label: "Aile Gauche" },
  "ALD": { x: 80, y: 63, label: "Aile Droite" },
  "9m G": { x: 29, y: 25, label: "Arr. Gauche (9m)" },
  "9m D": { x: 71, y: 25, label: "Arr. Droit (9m)" },
  "Central": { x: 50, y: 20, label: "Demi-Centre" },
  "6m G": { x: 26, y: 52, label: "Pivot Gauche" },
  "6m D": { x: 74, y: 52, label: "Pivot Droit" },
  "6m": { x: 50, y: 41, label: "Pivot Axe (6m)" },
  "Zone": { x: 66, y: 45, label: "Zone (6m - Proche but)" },
  "1 2": { x: 34, y: 45, label: "Secteur 1-2 (Ext G)" },
  "2 3": { x: 35, y: 34, label: "Secteur 2-3 (Int G)" },
  "3 4": { x: 50, y: 31, label: "Secteur 3-4 (Central)" },
  "4 5": { x: 65, y: 34, label: "Secteur 4-5 (Int D)" },
  "5 6": { x: 66, y: 45, label: "Secteur 5-6 (Ext D)" },
  "7m": { x: 50, y: 41, label: "Jet de 7m" },
  "CA": { x: 50, y: 91, label: "Contre-Attaque" },
  "ER": { x: 70, y: 91, label: "Engagement Rapide" },
};

const allEvents = ref<HandballEvent[]>([])
const matches = ref<any[]>([])
const isLoading = ref(false)
const unmappedCount = ref(0)
const showAllZones = ref(false)

const selectedPlayer = ref('')
const selectedResult = ref<ShotResult>('')
const selectedContext = ref<GameContext>('attack')
const selectedMatchId = ref<number | null>(null)

const filterOptions = [
  { v: '', l: 'Tout' }, { v: 'But', l: 'Buts' }, { v: 'Echec', l: 'Échecs' }, { v: 'Pertes', l: 'Pertes' }
] as { v: ShotResult, l: string }[]

function normalizeZone(rawZone: string): string | null {
  if (!rawZone) return null;
  const z = rawZone.trim();
  const directMap: Record<string, string> = {
    "PVT": "6m", "Marcher": "Central", "PF Mauvais bloc": "Zone", "KF": "Zone",
    "Autres": "Central", "GE": "Central", "12": "1 2", "56": "5 6", "But vide": "Central"
  };
  if (directMap[z]) return directMap[z];
  if (z.includes("7m")) return "7m";
  if (z.includes("CA")) return "CA";
  if (z.includes("ER")) return "ER";
  if (z.includes("Central") || z.includes("9m +")) return "Central";
  if (z.includes("Ext G") || z.includes("9m G")) return "9m G";
  if (z.includes("Ext D") || z.includes("9m D")) return "9m D";
  if (z.includes("ALG")) return "ALG";
  if (z.includes("ALD")) return "ALD";
  const sectors = ["1 2", "2 3", "3 4", "4 5", "5 6", "Zone"];
  return sectors.find(s => z.includes(s)) || null;
}

const filteredEvents = computed(() => {
  const atkKeys = ["Att", "ER", "CA", "Transition", "But vide"];
  const defKeys = ["Déf", "0-6", "1-5", "Repli"];
  return allEvents.value.filter(e => {
    if (selectedMatchId.value !== null && e.matchId !== selectedMatchId.value) return false;
    const nom = e.nom || "";
    const isAtk = atkKeys.some(k => nom.startsWith(k)) || (nom.includes("7m") && !nom.includes("Adversaire"));
    const isDef = defKeys.some(k => nom.startsWith(k)) || nom.includes("Adversaire");
    if (selectedContext.value === 'attack' ? !isAtk : !isDef) return false;
    if (selectedPlayer.value && e.joueuse !== selectedPlayer.value) return false;
    const isGoal = e.resultat === 'But';
    const isTurnover = ['PDB', 'Marcher', 'Passage en force'].includes(e.resultat) || (selectedResult.value === 'Pertes' && e.lieupb);
    if (selectedResult.value === 'But' && !isGoal) return false;
    if (selectedResult.value === 'Echec' && (isGoal || isTurnover)) return false;
    if (selectedResult.value === 'Pertes' && !isTurnover) return false;
    return true;
  })
})

const playersList = computed(() => {
  if (selectedContext.value === 'defense') return ['ALIX', 'JUSTICIA'];
  const names = new Set<string>();
  const events = selectedMatchId.value ? allEvents.value.filter(e => e.matchId === selectedMatchId.value) : allEvents.value;
  events.forEach(e => {
    if (e.joueuse && ["Att", "ER", "CA"].some(k => (e.nom || "").startsWith(k))) names.add(e.joueuse);
  });
  return Array.from(names).sort();
})

const heatmapPoints = computed(() => {
  const map: Record<string, any> = {};
  let maxVal = 0; let unmapped = 0;
  if (showAllZones.value) {
    Object.keys(ZONE_MAPPING).forEach(key => {
      map[key] = { ...ZONE_MAPPING[key], count: 0, goals: 0, isDummy: true };
    });
  }
  filteredEvents.value.forEach(e => {
    const key = normalizeZone(selectedResult.value === 'Pertes' ? e.lieupb : e.secteur);
    if (key && ZONE_MAPPING[key]) {
      if (!map[key]) map[key] = { ...ZONE_MAPPING[key], count: 0, goals: 0 };
      map[key].count++;
      if (e.resultat === 'But') map[key].goals++;
      map[key].isDummy = false;
      maxVal = Math.max(maxVal, map[key].count);
    } else if (e.secteur || e.lieupb) { unmapped++; }
  });
  unmappedCount.value = unmapped;
  const finalMax = maxVal || 1;
  return Object.values(map).map(p => ({ ...p, max: finalMax }));
})

function getStyle(zone: any) {
  if (zone.isDummy && zone.count === 0) {
    return {
      width: '20px', height: '20px', backgroundColor: '#4f46e5',
      border: '2px solid #ffffff', boxShadow: '0 0 10px rgba(79, 70, 229, 0.6)', opacity: '1'
    }
  }
  const ratio = Math.log(zone.count + 1) / Math.log(zone.max + 1);
  const size = 30 + (ratio * 36);
  const hue = selectedContext.value === 'attack' ? (1 - ratio) * 150 + 20 : ratio * 30;
  return {
    backgroundColor: `hsla(${hue}, 90%, 50%, 0.7)`,
    boxShadow: `0 0 ${size/1.5}px hsla(${hue}, 90%, 50%, 0.5)`,
    width: `${size}px`, height: `${size}px`,
  }
}

async function fetchAllData() {
  isLoading.value = true
  try {
    const [resM, resE] = await Promise.all([fetch(`${apiUrl}/match`), fetch(`${apiUrl}/evenement`)]);
    const [jsonM, jsonE] = await Promise.all([resM.json(), resE.json()]);
    matches.value = jsonM.docs || [];
    allEvents.value = jsonE.docs || [];
  } catch (e) { console.error("Erreur API:", e); }
  finally { isLoading.value = false; }
}

onMounted(() => fetchAllData())
</script>

<style scoped>
.custom-select {
  @apply w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold
  focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none
  appearance-none transition-all cursor-pointer text-slate-700;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>