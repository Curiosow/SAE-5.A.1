<template>
  <!-- Navbar au-dessus, inchangée -->
  <main class="min-h-screen bg-[#F7F7FB]">
    <div class="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <!-- Heatmap + bouton plein écran -->
        <section class="card p-6 sm:p-8 flex flex-col relative">
          <div class="flex-1 flex items-center justify-center">
            <div
                class="relative w-full max-w-[1100px] h-[520px] bg-[#e6e6e6] border border-gray-200 rounded-xl overflow-hidden"
                ref="heatmapContainer"
            >
              <!-- Heatmap ici -->
              <button
                  v-if="!isFullscreen"
                  class="absolute top-4 right-4 btn-gradient z-10 flex items-center justify-center"
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
                  class="absolute top-4 right-4 btn-gradient z-10 flex items-center justify-center"
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

        <!-- Sidebar filtres -->
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

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange)
})
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
</style>
