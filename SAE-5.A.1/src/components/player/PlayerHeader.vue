<template>
  <header v-if="player" class="relative card-large p-6 sm:p-8 mb-6 bg-white">
    <div class="grid grid-cols-[auto_1fr] gap-6 items-start">
      <div class="relative w-28">
        <div class="h-28 w-28 rounded-full shadow-xl shadow-avatar bg-gradient-to-br from-rose-400 to-violet-500 grid place-items-center text-3xl font-bold text-white overflow-hidden -translate-y-2">
          <img v-if="player.picture" :src="player.picture" class="h-28 w-28 rounded-full object-cover scale-125" style="object-position: top center;" />
          <span v-else>{{ player.first_name?.charAt(0) }}{{ player.last_name?.charAt(0) }}</span>
        </div>
        <div class="absolute -right-1 -bottom-1 h-7 w-7 rounded-full bg-white border border-gray-100 flex items-center justify-center text-sm font-semibold shadow-sm">{{ player.jersey_number ?? '-' }}</div>
      </div>

      <div class="flex flex-col gap-4 w-full text-left">
        <div class="relative">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-[#6B21A8] cursor-pointer inline-flex items-center gap-2" @click.stop="$emit('toggle-dropdown')">
            {{ player.last_name }} {{ player.first_name }}
            <svg class="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
          </h1>
          <div v-if="dropdownOpen" class="absolute z-20 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl w-72 max-h-80 overflow-y-auto text-left">
            <li v-for="(p, idx) in allPlayers" :key="idx" @click="$emit('select-player', idx)" class="px-5 py-3 hover:bg-violet-50 cursor-pointer border-b last:border-0 flex justify-between items-center">
              <span class="font-medium text-gray-700">{{ p.last_name }} {{ p.first_name }}</span>
              <span class="text-xs text-gray-400 border px-1 rounded">{{ p.position }}</span>
            </li>
          </div>
        </div>

        <div class="mt-2 w-full hidden md:flex flex-wrap gap-4">
          <div v-for="kpi in kpis" :key="kpi.label" class="mini-kpi flex-1 min-w-[120px]">
            <div class="text-xs text-gray-500 uppercase">{{ kpi.label }}</div>
            <div class="text-2xl font-semibold text-gray-900" :class="kpi.color">{{ kpi.value }}</div>
            <div v-if="kpi.pct !== undefined" class="w-full mt-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div class="h-full rounded-full" :class="kpi.barClass" :style="{ width: kpi.pct + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps({ player: Object, allPlayers: Array, dropdownOpen: Boolean });
const kpis = computed(() => {
  const s = props.player?.stats; if (!s) return [];
  return s.is_gb
      ? [{ label: 'Arrêts', value: s.arrets_total, pct: s.pct_arret_global, barClass: 'bg-gradient-to-r from-teal-400 to-blue-500' }, { label: '% Arrêt', value: Math.round(s.pct_arret_global) + '%' }, { label: 'Buts Enc.', value: s.buts_encaisse, color: 'text-rose-600' }]
      : [{ label: 'Buts', value: s.total_buts, pct: s.efficacite_tir_pct, barClass: 'bg-gradient-to-r from-rose-400 to-violet-500' }, { label: 'Passes', value: s.total_passes_decisives }, { label: '% Tir', value: Math.round(s.efficacite_tir_pct) + '%' }]
})
</script>

<style scoped>
.card-large { border-radius: 18px; border: 1px solid #f1f1f4; box-shadow: 0 18px 40px -20px rgba(16,24,40,0.12); }
.mini-kpi { background: #fff; border: 1px solid #f3f3f6; border-radius: 12px; padding: 10px 12px; box-shadow: 0 8px 26px -20px rgba(16,24,40,0.06); }
.shadow-avatar { box-shadow: 0 18px 40px -26px rgba(168,85,247,0.35); }
</style>