
<template>
  <main class="min-h-screen bg-[#F7F7FB]">
    <div class="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

        <!-- SECTION GAUCHE : CARTE HEATMAP -->
        <section class="card p-6 sm:p-8 flex flex-col relative">

          <div v-if="isLoading" class="absolute inset-0 z-20 bg-white/80 flex items-center justify-center rounded-xl">
            <div class="flex flex-col items-center gap-3">
              <div class="animate-spin rounded-full h-10 w-10 border-4 border-rose-500 border-t-transparent"></div>
              <p class="text-sm text-gray-500 font-medium">Analyse des données...</p>
            </div>
          </div>

          <div class="flex-1 flex items-center justify-center">
            <div class="relative w-full max-w-[1100px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-inner group/map" ref="heatmapContainer">

              <img src="/Terrain de basketball minimaliste.png" alt="Terrain de Handball" class="w-full h-auto object-contain opacity-90 select-none pointer-events-none relative z-0" />

              <!-- AJOUT DE 'hover:z-50' pour que le point survolé passe au-dessus -->
              <div v-for="(zone, key) in heatmapPoints" :key="key"
                   class="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 hover:z-50 flex items-center justify-center group transition-all duration-500"
                   :style="{ top: zone.y + '%', left: zone.x + '%' }">

                <div class="rounded-full transition-all duration-500 ease-out blur-md mix-blend-multiply"
                     :style="getStyle(zone.count)">
                </div>

                <div class="absolute w-1 h-1 bg-black/20 rounded-full"></div>

                <div class="hidden group-hover:block absolute mb-2 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none"
                     :class="zone.y < 50 ? 'top-full mt-2' : 'bottom-full mb-2'">
                  <div class="mb-1 text-slate-400 uppercase text-[10px]">{{ zone.label }}</div>
                  <div class="text-lg leading-none">{{ zone.count }} <span class="text-[10px] font-normal text-slate-400">actions</span></div>
                  <div v-if="zone.goals > 0" class="mt-1 pt-1 border-t border-slate-700" :class="selectedContext === 'attack' ? 'text-green-400' : 'text-red-400'">
                    {{ zone.goals }} {{ selectedContext === 'attack' ? 'Buts marqués' : 'Buts encaissés' }}
                    <span class="opacity-70">({{ Math.round((zone.goals / zone.count) * 100) }}%)</span>
                  </div>
                </div>
              </div>

              <!-- INDICATEUR CONTEXTE (GAUCHE) -->
              <div class="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md"
                   :class="selectedContext === 'defense' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'">
                {{ selectedContext === 'defense' ? '🛡️ Défense (Buts Encaissés)' : '🤾 Attaque (Buts Marqués)' }}
              </div>

            </div>
          </div>
        </section>

        <!-- SECTION DROITE : CONFIGURATION -->
        <aside class="card p-6 h-fit sticky top-24 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <h2 class="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Configuration</h2>

          <div class="space-y-5">

            <!-- 1. NOUVEAU FILTRE : MATCH -->
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Sélection du Match</label>
              <select v-model="selectedMatchId" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-rose-500 outline-none">
                <option :value="null">Tous les matchs (Global)</option>
                <option v-for="match in matches" :key="match.id" :value="match.id">
                  {{ match.adversaire ? `vs ${match.adversaire}` : `Match ${match.id}` }} {{ match.dateMatch ? `(${new Date(match.dateMatch).toLocaleDateString()})` : '' }}
                </option>
              </select>
            </div>

            <!-- 2. CONTEXTE -->
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Contexte de jeu</label>
              <div class="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                    @click="selectedContext = 'attack'; selectedPlayer = ''"
                    class="py-2 text-xs font-bold rounded-md transition-all"
                    :class="selectedContext === 'attack' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
                  Notre Attaque
                </button>
                <button
                    @click="selectedContext = 'defense'; selectedPlayer = ''"
                    class="py-2 text-xs font-bold rounded-md transition-all"
                    :class="selectedContext === 'defense' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
                  Notre Défense
                </button>
              </div>
              <p class="text-[10px] text-gray-400 mt-1 px-1">
                {{ selectedContext === 'attack' ? "Analyse l'efficacité de nos tirs." : "Analyse d'où l'adversaire marque." }}
              </p>
            </div>

            <!-- 3. JOUEUSE -->
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase mb-1.5 block">
                {{ selectedContext === 'attack' ? 'Tireuse (Sambre)' : 'Gardienne / Défenseur' }}
              </label>
              <select v-model="selectedPlayer" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-rose-500 outline-none">
                <option value="">Toute l'équipe</option>
                <option v-for="p in playersList" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>

            <!-- 4. RÉSULTAT -->
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Filtre Résultat</label>
              <select v-model="selectedResult" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-rose-500 outline-none">
                <option value="">Tout (Tirs + Pertes)</option>
                <option value="But">
                  {{ selectedContext === 'attack' ? 'Buts Marqués ✅' : 'Buts Encaissés ❌' }}
                </option>
                <option value="Echec">
                  {{ selectedContext === 'attack' ? 'Tirs Ratés / Arrêts ❌' : 'Arrêts Gardienne ✅' }}
                </option>
                <option value="Pertes">Pertes de balle</option>
              </select>
            </div>

            <div v-if="unmappedCount > 0" class="mt-2 pt-2 border-t border-slate-100 text-[10px] text-orange-500 font-mono">
              ⚠️ {{ unmappedCount }} actions ignorées (secteur inconnu)
            </div>

            <!-- LÉGENDE -->
            <div class="border-t border-gray-100 pt-5 mt-4">
              <h4 class="font-bold text-gray-500 uppercase text-[10px] mb-3 tracking-wider">Légende Densité</h4>
              <div class="flex items-center justify-between gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div class="flex flex-col items-center gap-1.5">
                  <div class="w-8 h-8 rounded-full blur-sm opacity-80"
                       :style="{ backgroundColor: selectedContext === 'attack' ? 'hsl(170, 90%, 40%)' : 'hsl(0, 90%, 50%)' }"></div>
                  <span class="text-[9px] font-bold text-gray-400 uppercase">Faible</span>
                </div>

                <div class="h-px flex-1 bg-gradient-to-r from-gray-200 to-gray-200 relative">
                  <div class="absolute inset-0 bg-gray-200"></div>
                </div>

                <div class="flex flex-col items-center gap-1.5">
                  <div class="w-10 h-10 rounded-full blur-md opacity-80 shadow-sm"
                       :style="{ backgroundColor: selectedContext === 'attack' ? 'hsl(20, 90%, 50%)' : 'hsl(30, 90%, 50%)' }"></div>
                  <span class="text-[9px] font-bold text-gray-400 uppercase">Élevée</span>
                </div>
              </div>
              <p class="mt-2 text-[10px] text-gray-400 text-center italic">
                La taille et la couleur indiquent le volume d'actions.
              </p>
            </div>

          </div>
        </aside>

      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface HandballEvent {
  nom: string;
  resultat: string;
  secteur: string;
  joueuse: string;
  lieupb: string;
}

const apiUrl = useApiUrl()

// --- 1. CONFIGURATION DU TERRAIN ---
const ZONE_MAPPING: Record<string, {x: number, y: number, label: string}> = {
  // --- AILES (Proche du but / 6m) ---
  "ALG": { x: 20, y: 63, label: "Aile Gauche" },
  "ALD": { x: 80, y: 63, label: "Aile Droite" },
  // --- ARRIERES (9m) ---
  "9m G": { x: 29, y: 25, label: "Arr. Gauche (9m)" },
  "9m D": { x: 71, y: 25, label: "Arr. Droit (9m)" },
  "Central": { x: 50, y: 20, label: "Demi-Centre" },
  // --- PIVOT (6m) / ZONES PROCHES ---
  "6m G": { x: 26, y: 52, label: "Pivot Gauche" },
  "6m D": { x: 74, y: 52, label: "Pivot Droit" },
  "6m": { x: 50, y: 41, label: "Pivot Axe (6m)" },
  "Zone": { x: 66, y: 45, label: "Zone (6m - Proche but)" },
  // --- SECTEURS CHIFFRÉS (FFHB) ---
  "1 2": { x: 34, y: 45, label: "Secteur 1-2 (Ext G)" },
  "2 3": { x: 35, y: 34, label: "Secteur 2-3 (Int G)" },
  "3 4": { x: 50, y: 31, label: "Secteur 3-4 (Central)" },
  "4 5": { x: 65, y: 34, label: "Secteur 4-5 (Int D)" },
  "5 6": { x: 66, y: 45, label: "Secteur 5-6 (Ext D)" },
  // --- SPÉCIAUX ---
  "7m": { x: 50, y: 41, label: "Jet de 7m" },
  "CA": { x: 50, y: 91, label: "Contre-Attaque" },
  "ER": { x: 70, y: 91, label: "Engagement Rapide" },
};

// --- 2. ÉTAT ---
const allEvents = ref<HandballEvent[]>([])
const matches = ref<Match[]>([])
const isLoading = ref(false)
const intensity = ref(60)

// Filtres
const selectedPlayer = ref('')
const selectedResult = ref('') // 'But', 'Echec', 'Pertes', ''
const selectedContext = ref('attack') // 'attack' | 'defense'
const selectedMatchId = ref<number | null>(null)

// --- 3. NORMALISATION PUISSANTE ---
function normalizeZone(rawZone: string): string | null {
  if (!rawZone) return null;
  const z = rawZone.trim();

  if (z === "PVT") return "6m";
  if (z === "Marcher") return "Central";
  if (z === "PF Mauvais bloc" || z === "KF") return "Zone";
  if (z === "Autres" || z === "GE") return "Central";
  if (z === "12") return "1 2";
  if (z === "56") return "5 6";
  if (z.includes("CA MB")) return "CA";

  if (z.includes("Jet 7m") || z.includes("7m")) return "7m";
  if (z.includes("CA")) return "CA";
  if (z.includes("ER")) return "ER";
  if (z.includes("But vide")) return "Central";

  if (z.includes("Central") || z.includes("9m +")) return "Central";
  if (z.includes("Ext G")) return "9m G";
  if (z.includes("Ext D")) return "9m D";

  if (z.includes("ALG")) return "ALG";
  if (z.includes("ALD")) return "ALD";
  if (z.includes("1 2")) return "1 2";
  if (z.includes("2 3")) return "2 3";
  if (z.includes("3 4")) return "3 4";
  if (z.includes("4 5")) return "4 5";
  if (z.includes("5 6")) return "5 6";
  if (z.includes("9m G")) return "9m G";
  if (z.includes("9m D")) return "9m D";
  if (z.includes("Zone")) return "Zone";

  return null;
}

// --- 4. RÉCUPÉRATION DES DONNÉES ---
async function fetchMatches() {
  try {
    const res = await fetch('http://localhost:8080/match')
    const json = await res.json()
    matches.value = json.docs || []
  } catch (e) {
    console.error("Erreur API Match:", e);
  }
}

async function fetchEvents() {
  try {
    const res = await fetchWithRetry(`${apiUrl}/evenement`)
    const json = await res.json()
    allEvents.value = json.docs || []
  } catch (e) {
    console.error("Erreur API Event:", e);
    allEvents.value = []
  }
}

async function fetchAllData() {
  isLoading.value = true
  await Promise.all([fetchMatches(), fetchEvents()])
  isLoading.value = false
}

// --- 5. LOGIQUE DE FILTRAGE INTELLIGENTE ---
const filteredEvents = computed(() => {
  return allEvents.value.filter(e => {
    // FILTRE MATCH
    if (selectedMatchId.value !== null && e.matchId !== selectedMatchId.value) {
      return false;
    }

    const nom = (e.nom || "").trim();
    const res = (e.resultat || "").trim();
    const joueuse = (e.joueuse || "").trim();

    // DÉTECTION DU TYPE D'ACTION
    const isSambreAttack = nom.startsWith("Att") ||
        nom.startsWith("ER") ||
        nom.startsWith("CA") ||
        nom.startsWith("Transition") ||
        nom.startsWith("But vide") ||
        (nom.includes("7m") && !nom.includes("Adversaire"));

    const isOpponentShot = nom.startsWith("Déf") ||
        nom.startsWith("0-6") ||
        nom.startsWith("1-5") ||
        nom.startsWith("Repli") ||
        nom.includes("Adversaire");

    // 1. FILTRE CONTEXTE
    if (selectedContext.value === 'attack') {
      if (!isSambreAttack) return false;
    } else {
      if (!isOpponentShot) return false;
    }

    // 2. FILTRE JOUEUSE
    if (selectedPlayer.value && joueuse !== selectedPlayer.value) return false;

    // 3. FILTRE RÉSULTAT
    const isGoal = res === 'But';
    const isTurnover = ['PDB', 'Marcher', 'Passage en force'].includes(res) || (selectedResult.value === 'Pertes' && e.lieupb);

    if (selectedResult.value === 'But' && !isGoal) return false;
    if (selectedResult.value === 'Echec' && (isGoal || isTurnover)) return false;
    if (selectedResult.value === 'Pertes' && !isTurnover) return false;

    return true;
  })
})

const playersList = computed(() => {
  if (selectedContext.value === 'defense') {
    return ['ALIX', 'JUSTICIA'];
  }

  const names = new Set<string>();

  // On filtre la liste des joueurs selon le match sélectionné
  const eventsForPlayerList = selectedMatchId.value !== null
      ? allEvents.value.filter(e => e.matchId === selectedMatchId.value)
      : allEvents.value;

  eventsForPlayerList.forEach(e => {
    const nom = e.nom || "";
    const isSambreAttack = nom.startsWith("Att") || nom.startsWith("ER") || nom.startsWith("CA") || nom.startsWith("Transition");
    if (isSambreAttack && e.joueuse) names.add(e.joueuse);
  });
  return Array.from(names).sort();
})

const unmappedCount = ref(0)

// --- 6. GÉNÉRATION HEATMAP ---
const heatmapPoints = computed(() => {
  const map: Record<string, { count: number, goals: number, x: number, y: number, label: string }> = {}
  let maxVal = 0
  let unmapped = 0

  filteredEvents.value.forEach(e => {
    let rawZone = e.secteur || "";
    if (selectedResult.value === 'Pertes' && e.lieupb) rawZone = e.lieupb;

    const key = normalizeZone(rawZone);

    if (key && ZONE_MAPPING[key]) {
      if (!map[key]) {
        map[key] = { ...ZONE_MAPPING[key], count: 0, goals: 0 };
      }
      map[key].count++;
      if (e.resultat === 'But') map[key].goals++;
      if (map[key].count > maxVal) maxVal = map[key].count;
    } else {
      if (rawZone) unmapped++;
    }
  })

  unmappedCount.value = unmapped;
  const pointsArray = Object.values(map);
  return pointsArray.map(p => ({...p, max: maxVal || 1}));
})

function getStyle(count: number) {
  const points = heatmapPoints.value;
  const max = points.length > 0 ? points[0].max : 1;
  const safeCount = Math.max(1, count);
  const ratio = Math.log(safeCount + 1) / Math.log(max + 1);
  const baseSize = 30;
  const size = baseSize + (ratio * (intensity.value * 0.6));

  const hue = selectedContext.value === 'attack'
      ? (1 - ratio) * 150 + 20
      : 0 + (ratio * 30);

  return {
    backgroundColor: `hsla(${hue}, 90%, 50%, 0.7)`,
    boxShadow: `0 0 ${size/1.5}px hsla(${hue}, 90%, 50%, 0.5)`,
    width: `${size}px`,
    height: `${size}px`,
  }
}

onMounted(() => fetchAllData())
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 18px;
}
</style>