<template>
  <main class="min-h-screen bg-[#F7F7FB]">
    <div class="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <section class="card p-6 sm:p-8 flex flex-col relative">
          <div class="flex-1 flex items-center justify-center">
            <div
                class="relative w-full max-w-[1100px] h-[450px] bg-[#e6e6e6] border border-gray-200 rounded-xl overflow-hidden"
                ref="heatmapContainer"
            >

              <div class="absolute top-4 left-4 z-50 bg-white p-3 rounded-lg shadow-xl border border-gray-200">
                <label for="colorRange" class="text-base font-semibold text-gray-700 block mb-1">
                  Intensité des Zones :
                </label>
                <div class="flex items-center space-x-2">
                  <span class="text-blue-500 font-medium text-sm">Froid</span>
                  <input type="range" id="colorRange" min="0" max="100" value="50"
                         oninput="updateHeatmapColors(this.value)"
                         class="w-64 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg">
                  <span class="text-red-600 font-medium text-sm">Chaud</span>
                </div>
              </div>


              <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white to-transparent flex items-center justify-center">
                <img src="/Terrain de basketball minimaliste.png"
                     alt="terrain stylisé rose et violet"
                     class="w-full h-auto object-contain opacity-90" />
              </div>



              <div class="boule absolute top-36 left-60 transform -translate-x-1/2 -translate-y-2/4 group">
                <div class="hidden group-hover:block absolute top-20 left-1/2 -translate-x-1/2
                            bg-pink-100/90 text-black px-3 py-1 rounded-lg shadow-md text-sm">
                  2
                </div>
                <div class="w-16 h-16 rounded-full heatmap-effect opacity-100">
                </div>
              </div>

              <div class="boule absolute top-36 right-44 transform -translate-x-1/2 -translate-y-2/4 group">
                <div class="hidden group-hover:block absolute top-20 left-1/2 -translate-x-1/2
                            bg-pink-100/90 text-black px-3 py-1 rounded-lg shadow-md text-sm">
                  3
                </div>
                <div class="w-16 h-16 rounded-full heatmap-effect opacity-100">
                </div>
              </div>

              <div class="boule absolute top-72 right-20 transform -translate-x-1/2 -translate-y-2/4 group">
                <div class="hidden group-hover:block absolute top-20 left-1/2 -translate-x-1/2
                            bg-pink-100/90 text-black px-3 py-1 rounded-lg shadow-md text-sm">
                  4
                </div>
                <div class="w-16 h-16 rounded-full heatmap-effect opacity-100">
                </div>
              </div>

              <div class="boule absolute top-72 left-36 transform -translate-x-1/2 -translate-y-2/4 group">
                <div class="hidden group-hover:block absolute top-20 left-1/2 -translate-x-1/2
                            bg-pink-100/90 text-black px-3 py-1 rounded-lg shadow-md text-sm">
                  5
                </div>
                <div class="w-16 h-16 rounded-full heatmap-effect opacity-100">
                </div>
              </div>

              <div class="boule absolute top-56 left-52 transform -translate-x-1/2 -translate-y-2/4 group">
                <div class="hidden group-hover:block absolute top-20 left-1/2 -translate-x-1/2
                            bg-pink-100/90 text-black px-3 py-1 rounded-lg shadow-md text-sm">
                  6
                </div>
                <div class="w-16 h-16 rounded-full heatmap-effect opacity-100">
                </div>
              </div>

              <div class="boule absolute top-56 right-36 transform -translate-x-1/2 -translate-y-2/4 group">
                <div class="hidden group-hover:block absolute top-20 left-1/2 -translate-x-1/2
                            bg-pink-100/90 text-black px-3 py-1 rounded-lg shadow-md text-sm">
                  7
                </div>
                <div class="w-16 h-16 rounded-full heatmap-effect opacity-100">
                </div>
              </div>

              <div class="boule absolute top-48 right-56 transform -translate-x-1/2 -translate-y-2/4 group">
                <div class="hidden group-hover:block absolute top-20 left-1/2 -translate-x-1/2
                            bg-pink-100/90 text-black px-3 py-1 rounded-lg shadow-md text-sm">
                  8
                </div>
                <div class="w-16 h-16 rounded-full heatmap-effect opacity-100">
                </div>
              </div>

              <div class="boule absolute top-48 left-72 transform -translate-x-1/2 -translate-y-2/4 group">
                <div class="hidden group-hover:block absolute top-20 left-1/2 -translate-x-1/2
                            bg-pink-100/90 text-black px-3 py-1 rounded-lg shadow-md text-sm">
                  9
                </div>
                <div class="w-16 h-16 rounded-full heatmap-effect opacity-100">
                </div>
              </div>

              <div class="boule absolute top-44 left-1/2 transform -translate-x-1/2 -translate-y-2/4 group">
                <div class="hidden group-hover:block absolute top-20 left-1/2 -translate-x-1/2
                            bg-pink-100/90 text-black px-3 py-1 rounded-lg shadow-lg text-sm">
                  10
                </div>
                <div class="w-16 h-16 rounded-full heatmap-effect opacity-100">
                </div>
              </div>

              <div class="boule absolute top-32 left-1/2 transform -translate-x-1/2 -translate-y-2/4 group">
                <div class="hidden group-hover:block absolute top-20 left-1/2 -translate-x-1/2
                            bg-pink-100/90 text-black px-3 py-1 rounded-lg shadow-lg text-sm">
                  1
                </div>
                <div class="w-16 h-16 rounded-full heatmap-effect opacity-100">
                </div>
              </div>

              <div class="boule absolute top-20 right-40 transform -translate-x-1/2 -translate-y-2/4 group">
                <div class="hidden group-hover:block absolute top-20 left-1/2 -translate-x-1/2
                            bg-pink-100/90 text-black px-3 py-1 rounded-lg shadow-md text-sm">
                  11
                </div>
                <div class="w-16 h-16 rounded-full heatmap-effect opacity-100">
                </div>
              </div>

              <div class="boule absolute top-20 left-56 transform -translate-x-1/2 -translate-y-2/4 group">
                <div class="hidden group-hover:block absolute top-20 left-1/2 -translate-x-1/2
                            bg-pink-100/90 text-black px-3 py-1 rounded-lg shadow-md text-sm">
                  12
                </div>
                <div class="w-16 h-16 rounded-full heatmap-effect opacity-100">
                </div>
              </div>

              <div class="boule absolute top-16 left-1/2 transform -translate-x-1/2 -translate-y-2/4 group">
                <div class="hidden group-hover:block absolute top-20 left-1/2 -translate-x-1/2
                            bg-pink-100/90 text-black px-3 py-1 rounded-lg shadow-lg text-sm">
                  13
                </div>
                <div class="w-16 h-16 rounded-full heatmap-effect opacity-100">
                </div>
              </div>

              <button
                  v-if="!isFullscreen"
                  class="absolute top-4 right-4 btn-gradient z-10 flex items-center justify-2xl"
                  @click="goFullscreen"
                  aria-label="Plein écran"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="4" y="4" width="16" height="16" rx="3" stroke-width="2"/>
                  <path d="M8 8h.01M16 8h.01M8 16h.01M16 16h.01" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
              <button
                  v-if="isFullscreen"
                  class="absolute top-4 right-4 btn-gradient z-10 flex items-center justify-2xl"
                  @click="exitFullscreen"
                  aria-label="Quitter le plein écran"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-width="2" d="M6 6l12 12M6 18L18 6"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        <aside
            class="card p-4 sm:p-8 relative transition-all duration-300 w-full"
            :class="{ 'pl-2 pr-2': !sidebarOpen, 'sm:pl-8 sm:pr-8': sidebarOpen }"
        >

          <div v-if="sidebarOpen" class="transition-all duration-300">
            <h2 class="section-title mb-6">{{ titreDynamique }}</h2>
            <div class="flex flex-col gap-5">
              <label class="text-sm font-medium text-gray-700">
                Joueur :
                <select v-model="selectedPlayer" class="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-rose-400 focus:border-rose-400 text-sm">
                  <option value="">Tous</option>
                  <option v-for="player in players" :key="player" :value="player">
                    {{ player }}
                  </option>
                </select>
              </label>
              <label class="text-sm font-medium text-gray-700">
                Type d’action :
                <select v-model="selectedAction" class="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-rose-400 focus:border-rose-400 text-sm">
                  <option value="">Toutes</option>
                  <option v-for="action in actions" :key="action" :value="action">
                    {{ action }}
                  </option>
                </select>
              </label>
              <label class="text-sm font-medium text-gray-700">
                Durée :
                <select v-model="selectedDuration" class="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-rose-400 focus:border-rose-400 text-sm">
                  <option value="">Toutes</option>
                  <option v-for="d in durations" :key="d.value" :value="d.value">
                    {{ d.label }}
                  </option>
                </select>
              </label>
              <button class="btn-gradient mt-2" @click="applyFilters">Appliquer</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const selectedPlayer = ref('')
const selectedAction = ref('')
const selectedDuration = ref('')
const sidebarOpen = ref(true)
const heatmapContainer = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)

const players = ['Dupont', 'Martin', 'Nguyen', 'Lopez', 'Garcia']
const actions = ['Tirs', 'Passes', 'Interceptions', 'Fautes']
const durations = [
  { label: '3 derniers matches', value: 'last3matches' },
  { label: '3 derniers mois', value: 'last3months' },
  { label: 'Toute la saison', value: 'season' },
  { label: 'Tous les matchs', value: 'all' }
]

const titreDynamique = computed(() => {
  if (!selectedPlayer.value && !selectedAction.value && !selectedDuration.value) {
    return 'Filtres'
  }
  let titre = 'Filtres appliqués :\n'
  if (selectedPlayer.value) titre += `Joueur = ${selectedPlayer.value}\n`
  if (selectedAction.value) titre += `Action = ${selectedAction.value}\n`
  if (selectedDuration.value) {
    const label = durations.find(d => d.value === selectedDuration.value)?.label
    titre += `Durée = ${label}\n`
  }
  return titre
})

const applyFilters = () => {
  // Logique d’application des filtres
  console.log('Filtres appliqués :', {
    joueur: selectedPlayer.value,
    action: selectedAction.value,
    durée: selectedDuration.value
  })
}

const goFullscreen = () => {
  const el = heatmapContainer.value
  if (el && el.requestFullscreen) {
    el.requestFullscreen()
  }
}

const exitFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
}

const onFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}


if (typeof window !== 'undefined') {
  /**
   * Convertit une valeur de 0 à 100 en une couleur RGB allant de Bleu à Rouge,
   * en garantissant que le canal vert reste à zéro.
   * @param {number} value - L'intensité (0 à 100).
   * @returns {string} - La chaîne de couleur RGB.
   */
  (window as any).getColorGradient = (value: number) => {
    const ratio = Math.max(0, Math.min(100, value)) / 100;

    const r = Math.round(255 * ratio);
    const b = Math.round(255 * (1 - ratio));
    const g = 0;

    return `rgb(${r}, ${g}, ${b})`;
  }

  (window as any).updateHeatmapColors = (valueString: string) => {
    const value = parseInt(valueString, 10);
    const baseColor = (window as any).getColorGradient(value);

    // Extraction des composants R, G, B de la couleur de base pour les utiliser dans rgba
    const rComponent = parseInt(baseColor.substring(baseColor.indexOf('(') + 1, baseColor.indexOf(',')));
    const gComponent = parseInt(baseColor.substring(baseColor.indexOf(',') + 1, baseColor.lastIndexOf(',')));
    const bComponent = parseInt(baseColor.substring(baseColor.lastIndexOf(',') + 1, baseColor.length - 1));


    const boules = document.querySelectorAll('.boule > div.heatmap-effect');

    boules.forEach(b => {
      // CHANGEMENT ICI : Réduction du flou de 10px à 6px
      b.style.filter = `blur(6px)`;

      // Dégradé radial avec une brillance centrale (plus opaque au centre)
      b.style.background = `
            radial-gradient(circle at center,
                rgba(${rComponent}, ${gComponent}, ${bComponent}, 0.8) 0%, /* Couleur de base avec plus d'opacité au centre */
                ${baseColor} 20%, /* Couleur de base */
                transparent 70% /* Devient transparent plus loin */
            )`;
      b.style.opacity = '0.9'; // Opacité générale du halo
      b.style.boxShadow = `inset 0 0 10px rgba(255+
      32.04, 255, 255, 0.4), inset 0 0 20px ${baseColor}, 0 0 25px ${baseColor}, 0 0 5px rgba(255, 255, 255, 0.6)`;
    });
  }

  // Initialisation au montage
  onMounted(() => {
    document.addEventListener('fullscreenchange', onFullscreenChange);
    const initialRange = document.getElementById('colorRange') as HTMLInputElement;
    if (initialRange) {
      (window as any).updateHeatmapColors(initialRange.value);
    }
  });
}

// --------------------------------------------------


onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>

<style scoped>
.card{
  background: #fff;
  border: 1px solid #F1F1F4;
  border-radius: 18px;
  box-shadow: 0 16px 36px -14px rgba(16,24,40,0.10);
}
.btn-gradient{
  border-radius: 9999px;
  padding: 8px 14px;
  color: #fff;
  font-weight: 600;
  background: linear-gradient(90deg, #F472B6 0%, #A78BFA 100%);
  box-shadow: 0 8px 22px rgba(244,114,182,0.25);
}
.section-title{
  color:#6B21A8;
  font-weight:600;
  font-size: 15px;
  position:relative;
  padding-bottom:.35rem;
}
.section-title::after{
  content:"";
  position:absolute; left:0; bottom:0;
  width:210px; height:3px; border-radius:6px;
  background: linear-gradient(90deg,#60A5FA 0%,#A78BFA 50%,#F472B6 100%);
  opacity:.75;
}
/* Nouveau style pour les boules afin de mieux contrôler le flou et les effets */
.heatmap-effect {
  /* Le flou est maintenant appliqué par filter: blur() dans le JS pour un meilleur contrôle */
  /* Les ombres et dégradés seront gérés par le JS également */
  transition: background 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease; /* Transitions douces */
}
</style>
