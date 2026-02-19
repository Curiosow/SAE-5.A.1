<template>
  <main class="min-h-screen bg-[#f7f7fb] pt-16 pb-32">
    <div v-if="!loading" class="mx-auto px-4 max-w-[1180px]" :class="{'!max-w-[1800px]': isComparing}">

      <div class="flex justify-end mb-6">
        <button @click="isComparing = !isComparing" class="bg-white border px-5 py-2 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-colors">
          {{ isComparing ? 'Arrêter la comparaison' : 'Comparer deux joueuses' }}
        </button>
      </div>

      <div :class="isComparing ? 'grid lg:grid-cols-2 gap-12' : ''">
        <div v-for="(vIdx) in (isComparing ? [0, 1] : [0])" :key="vIdx" class="space-y-6">

          <PlayerHeader
              :player="players[indices[vIdx]]" :allPlayers="players" :dropdownOpen="dropdowns[vIdx]"
              @toggle-dropdown="dropdowns[vIdx] = !dropdowns[vIdx]"
              @select-player="(pIdx) => { indices[vIdx] = pIdx; dropdowns[vIdx] = false; }"
          />

          <nav class="flex gap-2 bg-white/60 border rounded-full p-1 mb-6 mx-auto w-fit backdrop-blur-sm">
            <button v-for="t in ['Stats', 'Graphiques']" :key="t" @click="activeTab = t"
                    :class="activeTab === t ? 'bg-[#8b5cf6] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'"
                    class="px-8 py-2 rounded-full text-sm font-bold transition-all">{{ t }}</button>
          </nav>

          <div class="transition-all duration-300">
            <PlayerStats v-if="activeTab === 'Stats'" :player="players[indices[vIdx]]" />
            <PlayerCharts v-else :player="players[indices[vIdx]]" />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div class="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      <p class="text-violet-600 font-bold animate-pulse">Chargement des données...</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { usePlayerStats } from '../../composables/usePlayerStats'
import PlayerHeader from '../components/player/PlayerHeader.vue'
import PlayerStats from '../components/player/PlayerStats.vue'
import PlayerCharts from '../components/player/PlayerCharts.vue'

const { fetchPlayersWithStats } = usePlayerStats()
const players = ref<any[]>([]); const loading = ref(true);
const activeTab = ref('Stats'); const isComparing = ref(false);
const indices = ref([0, 1]); const dropdowns = ref([false, false]);



onMounted(async () => {
  players.value = await fetchPlayersWithStats();
  if (players.value.length > 0) indices.value = [players.value.length - 1, 0];
  loading.value = false;
});
</script>