<template>
  <main class="min-h-screen bg-[#F7F7FB]">
    <div class="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

        <section class="card p-6 sm:p-8 flex flex-col relative">

          <div v-if="isLoading" class="absolute inset-0 z-20 bg-white/80 flex items-center justify-center rounded-xl">
            <div class="flex flex-col items-center gap-3">
              <div class="animate-spin rounded-full h-10 w-10 border-4 border-rose-500 border-t-transparent"></div>
              <p class="text-sm text-gray-500 font-medium">Analyse des statistiques...</p>
            </div>
          </div>

          <div class="flex-1 flex items-center justify-center">
            <div class="relative w-full max-w-[1100px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-inner group/map" ref="heatmapContainer">

              <img src="/Terrain de basketball minimaliste.png" alt="Terrain de Handball" class="w-full h-auto object-contain opacity-90 select-none pointer-events-none relative z-0" />

              <div v-for="(zone, key) in (isDebugMode ? debugPoints : heatmapPoints)" :key="key"
                   class="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center group transition-all duration-500"
                   :style="{ top: zone.y + '%', left: zone.x + '%' }">

                <div class="rounded-full transition-all duration-500 ease-out blur-md mix-blend-multiply"
                     :class="{'ring-1 ring-black/20': isDebugMode}"
                     :style="getStyle(zone.count)">
                </div>

                <div class="absolute w-1 h-1 bg-black/20 rounded-full"></div>

                <div class="hidden group-hover:block absolute bottom-full mb-2 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none">
                  <div class="mb-1 text-slate-400 uppercase text-[10px]">{{ zone.label }}</div>
                  <div class="text-lg leading-none">{{ zone.count }} <span class="text-[10px] font-normal text-slate-400">actions</span></div>
                  <div v-if="zone.goals > 0" class="mt-1 pt-1 border-t border-slate-700 text-green-400">
                    {{ Math.round((zone.goals / zone.count) * 100) }}% réussite
                  </div>
                </div>
              </div>

              <div class="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md"
                   :class="selectedContext === 'defense' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'">
                {{ selectedContext === 'defense' ? '🛡️ Buts/Tirs Encaissés' : '🤾 Tirs de l\'équipe' }}
              </div>

              <div class="absolute top-4 left-4 z-30 flex flex-col gap-2">
                <div class="bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border border-gray-100 w-48">
                  <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex justify-between">
                    <span>Intensité</span>
                    <span>{{ intensity }}%</span>
                  </label>
                  <input type="range" min="10" max="200" v-model.number="intensity" class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-900">
                </div>

                <div class="bg-white/90 backdrop-blur p-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
                  <input type="checkbox" id="debugMode" v-model="isDebugMode" class="accent-indigo-600 w-4 h-4 cursor-pointer">
                  <label for="debugMode" class="text-xs font-bold text-gray-600 cursor-pointer select-none">Mode Debug (Voir zones)</label>
                </div>
              </div>

            </div>
          </div>
        </section>

        <aside class="card p-6 h-fit sticky top-24 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <h2 class="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Configuration</h2>

          <div class="space-y-5">

            <div>
              <label class="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Contexte de jeu</label>
              <div class="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                    @click="selectedContext = 'attack'"
                    class="py-2 text-xs font-bold rounded-md transition-all"
                    :class="selectedContext === 'attack' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
                  Notre Attaque
                </button>
                <button
                    @click="selectedContext = 'defense'"
                    class="py-2 text-xs font-bold rounded-md transition-all"
                    :class="selectedContext === 'defense' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
                  Notre Défense
                </button>
              </div>
              <p class="text-[10px] text-gray-400 mt-1 px-1">
                {{ selectedContext === 'attack' ? "Affiche où nos joueuses tirent." : "Affiche d'où l'adversaire tire." }}
              </p>
            </div>

            <div>
              <label class="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Joueuse (Sambre)</label>
              <select v-model="selectedPlayer" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-rose-500 outline-none">
                <option value="">Toute l'équipe</option>
                <option v-for="p in playersList" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>

            <div>
              <label class="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Résultat</label>
              <select v-model="selectedResult" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-rose-500 outline-none">
                <option value="">Tous les tirs</option>
                <option value="But">Buts uniquement</option>
                <option value="Echec">Tirs ratés / Arrêts</option>
                <option value="Pertes">Pertes de balle</option>
              </select>
            </div>

            <div class="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div class="flex justify-between items-end">
                <div>
                  <span class="block text-3xl font-black text-slate-800">{{ totalActions }}</span>
                  <span class="text-xs font-bold text-slate-400 uppercase">Actions filtrées</span>
                </div>
                <div class="text-right">
                  <span class="block text-xl font-bold text-emerald-500">{{ totalGoals }}</span>
                  <span class="text-[10px] font-bold text-emerald-300 uppercase">Buts</span>
                </div>
              </div>

              <div v-if="unmappedCount > 0" class="mt-3 pt-2 border-t border-slate-200 text-[10px] text-orange-500 font-mono">
                ⚠️ {{ unmappedCount }} actions ignorées (secteur inconnu)
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

// --- 1. CONFIGURATION ---
// Mapping des zones pour un terrain de HANDBALL (avec la zone en D en bas)
// Les coordonnées sont en pourcentage (x: 0=gauche, 100=droite; y: 0=haut, 100=bas)
const ZONE_MAPPING: Record<string, {x: number, y: number, label: string}> = {
  // --- AILES (Proche du but / 6m) ---
  "ALG": { x: 20, y: 63, label: "Aile Gauche" },
  "ALD": { x: 80, y: 63, label: "Aile Droite" },

  // --- ARRIERES (9m) ---
  "9m G": { x: 29, y: 25, label: "Arr. Gauche (9m)" },
  "9m D": { x: 71, y: 25, label: "Arr. Droit (9m)" },
  "Central": { x: 50, y: 20, label: "Demi-Centre" }, // Légèrement plus en retrait

  // --- PIVOT (6m) / ZONES PROCHES ---
  "6m G": { x: 26, y: 52, label: "Pivot Gauche" },
  "6m D": { x: 74, y: 52, label: "Pivot Droit" },
  "6m":   { x: 50, y: 41, label: "Pivot Axe (6m)" }, // Sur la ligne des 6m
  "Zone": { x: 66, y: 45, label: "Zone (6m - Proche but)" }, // Très proche du but

  // --- SECTEURS CHIFFRÉS (FFHB) ---
  "1 2": { x: 34, y: 45, label: "Secteur 1-2 (Ext G)" }, // Juste avant l'aile
  "2 3": { x: 35, y: 34, label: "Secteur 2-3 (Int G)" }, // Entre 9m et 6m
  "3 4": { x: 50, y: 31, label: "Secteur 3-4 (Central)" }, // Entre 9m et 6m
  "4 5": { x: 65, y: 34, label: "Secteur 4-5 (Int D)" }, // Entre 9m et 6m
  "5 6": { x: 66, y: 45, label: "Secteur 5-6 (Ext D)" }, // Juste avant l'aile

  // --- SPÉCIAUX (MAINTENANT ACTIVÉ) ---
  "7m": { x: 50, y: 91, label: "Jet de 7m" }, // Ligne des 7m
  "CA": { x: 30, y: 91, label: "Contre-Attaque" }, // Mappé sur la zone centrale avant le 9m
  "ER": { x: 70, y: 91, label: "Engagement Rapide" }, // Devant le 9m
};

// --- 2. ÉTAT ---
const events = ref<any[]>([])
const isLoading = ref(false)
const intensity = ref(60)
const isDebugMode = ref(false)

// Filtres
const selectedPlayer = ref('')
const selectedResult = ref('') // But, Echec, etc.
const selectedContext = ref('attack') // 'attack' | 'defense'

// --- 3. LOGIQUE DE NORMALISATION (MISE À JOUR) ---
function normalizeZone(rawZone: string): string | null {
  if (!rawZone) return null;
  const z = rawZone.trim();

  // ----------------------------------------------------
  // NOUVELLES RÈGLES DE NORMALISATION POUR LES CAS IGNORÉS
  // ----------------------------------------------------

  // 1. Gérer les 7m (Jet 7m)
  if (z.includes("Jet 7m") || z.includes("7m")) return "7m";

  // 2. Gérer les Contre-Attaques (CA) et Engagement Rapide (ER)
  // On priorise la reconnaissance de "CA" et "ER" pour les actions de transition
  if (z.includes("CA")) return "CA";
  if (z.includes("ER")) return "ER";

  // 3. Gérer le But Vide
  if (z.includes("But vide")) {
    // Les tirs But Vide n'ont pas de position précise, on les mappe sur une zone de tir de loin.
    return "Central";
  }

  // 4. Gérer les zones vagues ou complexes (suspension/appui) et "9m +"
  if (z.includes("Central 7m 9m appui") || z.includes("7m 9m central suspension") || z.includes("9m +")) {
    return "Central";
  }
  if (z.includes("7m 9m Ext G")) return "9m G";
  if (z.includes("7m 9m Ext D")) return "9m D";

  // ----------------------------------------------------
  // ANCIENNES RÈGLES (conservées pour le nettoyage de base)
  // ----------------------------------------------------

  if (z.includes("ALG")) return "ALG";
  if (z.includes("ALD")) return "ALD";

  if (z.includes("Ext G")) return "9m G";
  if (z.includes("Ext D")) return "9m D";

  if (z.includes("Central")) return "Central";

  // Secteurs standards
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

// --- 4. API ---
// Fonction utilitaire pour implémenter l'attente avec backoff exponentiel
async function fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 5, delay = 1000): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
      // Si la réponse n'est pas OK mais n'est pas une erreur réseau, on sort
      if (response.status < 500) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // Pour les erreurs réseau ou 5xx, on retente
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  // Ne devrait pas être atteint si maxRetries > 0
  throw new Error("Maximum retries reached");
}

async function fetchData() {
  isLoading.value = true
  try {
    // Utilisation de fetchWithRetry pour une robustesse accrue
    const res = await fetchWithRetry('http://localhost:8080/evenement')
    const json = await res.json()
    events.value = json.docs || []
  } catch (e) {
    console.error("Erreur lors de la récupération des événements:", e);
  }
  finally { isLoading.value = false }
}

// --- 5. FILTRAGE ET CALCULS ---
const playersList = computed(() => {
  const names = new Set(events.value.map(e => e.joueuse?.trim()).filter(Boolean));
  return Array.from(names).sort();
})

const filteredEvents = computed(() => {
  return events.value.filter(e => {
    const nomAction = (e.nom || "").trim();
    const res = (e.resultat || "").trim();

    // 1. Filtre Contexte (Attaque vs Défense)
    // Logique ajustée : Si une joueuse est renseignée, c'est presque toujours une action d'attaque de Sambre
    const isSambreAttack = e.joueuse || nomAction.startsWith("Att");
    const isOpponentShot = nomAction.startsWith("Déf") || nomAction.includes("0-6");

    if (selectedContext.value === 'attack') {
      if (!isSambreAttack || isOpponentShot) return false;
    }
    else if (selectedContext.value === 'defense') {
      // On cherche les actions de l'adversaire (buts encaissés)
      if (isSambreAttack) return false;
      // On filtre pour ne garder que les actions pertinentes (tirs de l'adversaire ou buts)
      if (!isOpponentShot && res !== 'But') return false;
    }

    // 2. Filtre Joueuse (Seulement en mode attaque)
    if (selectedPlayer.value && e.joueuse?.trim() !== selectedPlayer.value) return false;

    // 3. Filtre Résultat
    const isGoal = res === 'But';
    const isTurnover = ['PDB', 'Marcher', 'Passage en force'].includes(res) || e.lieupb;

    if (selectedResult.value === 'But' && !isGoal) return false;
    if (selectedResult.value === 'Echec' && (isGoal || isTurnover)) return false;
    if (selectedResult.value === 'Pertes' && !isTurnover) return false;

    return true;
  })
})

const totalActions = computed(() => filteredEvents.value.length)
const totalGoals = computed(() => filteredEvents.value.filter(e => e.resultat === 'But').length)
const unmappedCount = ref(0)

// --- 6. GÉNÉRATION DES POINTS HEATMAP ---
const heatmapPoints = computed(() => {
  const map: Record<string, { count: number, goals: number, x: number, y: number, label: string }> = {}
  let maxVal = 0
  let unmapped = 0
  // Nouveau : Stocker les actions ignorées pour le debug
  const ignoredActions: any[] = []

  filteredEvents.value.forEach(e => {
    // On regarde 'lieupb' si c'est une perte de balle, sinon 'secteur'
    let rawZone = e.secteur || "";
    if (selectedResult.value === 'Pertes' && e.lieupb) rawZone = e.lieupb;

    const normalizedKey = normalizeZone(rawZone);

    if (normalizedKey && ZONE_MAPPING[normalizedKey]) {
      const key = normalizedKey;
      if (!map[key]) {
        map[key] = { ...ZONE_MAPPING[key], count: 0, goals: 0 };
      }

      map[key].count++;
      if (e.resultat === 'But') map[key].goals++;

      if (map[key].count > maxVal) maxVal = map[key].count;
    } else {
      if (rawZone) {
        unmapped++; // On compte seulement si y'avait une zone mais qu'on l'a pas trouvée
        // Ajout de l'événement à la liste des actions ignorées
        ignoredActions.push({
          action: e.nom,
          joueuse: e.joueuse,
          resultat: e.resultat,
          zone_non_mappee: rawZone
        });
      }
    }
  })

  unmappedCount.value = unmapped;

  // NOUVEAU : Afficher les actions ignorées dans la console si le mode debug est actif
  if (isDebugMode.value && ignoredActions.length > 0) {
    console.warn(`[DEBUG MODE] ${ignoredActions.length} Actions ignorées (secteur inconnu):`, ignoredActions);
  } else if (isDebugMode.value && ignoredActions.length === 0) {
    console.log("[DEBUG MODE] Aucune action ignorée.");
  }


  // Retourne tableau avec max global attaché
  // On s'assure que le tableau n'est pas vide pour prendre le max.
  const pointsArray = Object.values(map);
  return pointsArray.map(p => ({...p, max: maxVal || 1}));
})

// Points pour le mode Debug
const debugPoints = computed(() => {
  return Object.entries(ZONE_MAPPING).map(([k, v]) => ({
    ...v,
    count: 1, // On met 1 pour qu'ils soient visibles en debug
    goals: 0,
    max: 1
  }))
})

// --- 7. STYLE DYNAMIQUE ---
function getStyle(count: number) {
  const points = heatmapPoints.value;
  // Utilisez un array vide si points.length est 0, ou le max du premier élément s'il existe
  const max = points.length > 0 ? points[0].max : 1;

  if (isDebugMode.value) {
    if (count === 0 && !max) { // Si c'est un point debug non mappé
      return { backgroundColor: 'rgba(0,0,0,0.1)', width: '20px', height: '20px' }
    }
    // Si on est en mode debug et que le point est mappé (count > 0) ou si on montre tous les points (count=1 pour debugPoints)
  }

  // Formule logarithmique pour éviter que les grosses zones écrasent tout
  // S'assurer que 'count' et 'max' sont au moins 1 pour éviter log(0)
  const safeCount = Math.max(1, count);
  const safeMax = Math.max(1, max);

  const ratio = Math.log(safeCount + 1) / Math.log(safeMax + 1);
  const baseSize = isDebugMode.value ? 20 : 25; // Taille de base différente en debug
  const size = baseSize + (ratio * (intensity.value * 0.8)); // Taille variable selon intensité

  // Couleur basée sur le ratio (Bleu -> Vert -> Jaune -> Rouge)
  // Hue: 240 (Bleu) -> 0 (Rouge)
  const hue = (1 - ratio) * 200; // De 200 (bleu ciel pour peu d'actions) à 0 (rouge pour beaucoup d'actions)

  return {
    backgroundColor: `hsla(${hue}, 90%, 50%, 0.7)`,
    boxShadow: `0 0 ${size/1.5}px hsla(${hue}, 90%, 50%, 0.5)`,
    width: `${size}px`,
    height: `${size}px`,
  }
}

onMounted(() => fetchData())
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 18px;
}
</style>