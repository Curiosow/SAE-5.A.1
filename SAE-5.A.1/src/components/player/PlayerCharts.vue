<template>
  <div v-if="player?.stats" class="grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-8">

    <div v-if="!player.stats.is_gb" class="flex flex-col gap-3 pt-12">
      <button
          v-for="m in ['Offensif', 'Défensif']"
          :key="m"
          @click="viewMode = m"
          :class="[ 'py-4 rounded-2xl text-xs font-bold uppercase transition-all border-2',
          viewMode === m ? 'bg-[#8b5cf6] text-white border-[#8b5cf6] shadow-lg scale-105' : 'bg-white text-gray-400 border-gray-100 hover:border-violet-200' ]"
      >
        {{ m }}
      </button>
    </div>
    <div v-else class="hidden lg:block pt-12 text-center text-[10px] font-black uppercase text-teal-500 rotate-[-90deg]">
      Gardienne
    </div>

    <div class="space-y-8">
      <div class="grid md:grid-cols-2 gap-6">
        <div class="card p-6 bg-white border border-gray-100 shadow-sm rounded-[25px]">
          <h3 class="text-xs font-bold text-gray-400 uppercase mb-6">{{ evoTitle }}</h3>
          <div class="h-64">
            <Line :key="'evo_'+viewMode+player.id" :data="lineData" :options="lineOptions" />
          </div>
        </div>

        <div class="card p-6 bg-white border border-gray-100 shadow-sm rounded-[25px]">
          <h3 class="text-xs font-bold text-gray-400 uppercase mb-6 text-center">Profil d'Impact</h3>
          <div class="h-64">
            <Radar :key="'rad_'+viewMode+player.id" :data="radarData" :options="radarOptions" />
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 card p-6 bg-white border border-gray-100 shadow-sm rounded-[25px]">
          <h3 class="text-xs font-bold text-gray-400 uppercase mb-6">{{ zoneTitle }}</h3>
          <div class="h-64">
            <Bar :key="'bar_'+viewMode+player.id" :data="barData" :options="barOptions" />
          </div>
        </div>

        <div class="card p-6 bg-white border border-gray-100 shadow-sm rounded-[25px] flex flex-col items-center relative">
          <h3 class="text-xs font-bold text-gray-400 uppercase mb-6">Bilan</h3>
          <div class="h-56 w-full relative">
            <Doughnut :key="'eff_'+viewMode+player.id" :data="effData" :options="effOptions" />
            <div class="absolute inset-0 flex items-center justify-center pt-4 pointer-events-none">
              <span class="text-xl font-black text-gray-800">{{ centerLabel }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex items-center justify-center py-20 text-gray-400 animate-pulse">
    Chargement des graphiques...
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Line, Radar, Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, registerables } from 'chart.js'
ChartJS.register(...registerables)

const props = defineProps({ player: Object });
const viewMode = ref('Offensif');

// --- LABELS ---
const evoTitle = computed(() => props.player?.stats.is_gb ? 'Évolution Arrêts' : (viewMode.value === 'Offensif' ? 'Évolution Buts' : 'Récupérations vs Pertes'));
const zoneTitle = computed(() => props.player?.stats.is_gb ? 'Arrêts par Zone' : (viewMode.value === 'Offensif' ? 'Réussite par Zone' : 'Bilan Duels Défensifs'));
const centerLabel = computed(() => {
  const s = props.player?.stats;
  if (s.is_gb) return Math.round(s.pct_arret_global || 0) + '%';
  return viewMode.value === 'Offensif' ? Math.round(s.efficacite_tir_pct || 0) + '%' : (s.def_duels_gagnes || 0) + ' G';
});

// --- DATA : LINE CHART (Correction pour lire les objets matchData) ---
const lineData = computed(() => {
  const s = props.player?.stats;
  const history = s.history || []; // Tableau d'objets [{goals: X, saves: Y...}]
  const labels = history.map((_: any, i: number) => `Match ${i + 1}`);

  // Cas Gardienne
  if (s.is_gb) {
    return {
      labels,
      datasets: [{ label: 'Arrêts', data: history.map((m: any) => m.saves), borderColor: '#14b8a6', backgroundColor: 'rgba(20, 184, 166, 0.1)', fill: true, tension: 0.4 }]
    };
  }

  // Cas Joueuse - Mode Défensif (Double courbe)
  if (viewMode.value === 'Défensif') {
    return {
      labels,
      datasets: [
        { label: 'Récupérations', data: history.map((m: any) => m.recups), borderColor: '#10b981', tension: 0.4 },
        { label: 'Pertes (PDB)', data: history.map((m: any) => m.pdbs), borderColor: '#f43f5e', tension: 0.4 }
      ]
    };
  }

  // Cas Joueuse - Mode Offensif
  return {
    labels,
    datasets: [{ label: 'Buts', data: history.map((m: any) => m.goals), borderColor: '#8b5cf6', backgroundColor: 'rgba(139, 92, 246, 0.1)', fill: true, tension: 0.4 }]
  };
});

// --- DATA : RADAR ---
const radarData = computed(() => {
  const s = props.player?.stats;
  const isGB = s?.is_gb;
  return {
    labels: viewMode.value === 'Offensif' || isGB ? ['Finition', 'Création', 'Duel Déf.', 'Impact Déf.', 'Propreté'] : ['Duels', 'Récups', 'Contres', 'Propreté', 'Discipline'],
    datasets: [{
      label: props.player?.last_name || 'Joueuse',
      backgroundColor: isGB ? 'rgba(20, 184, 166, 0.2)' : 'rgba(139, 92, 246, 0.2)',
      borderColor: isGB ? '#14b8a6' : '#8b5cf6',
      data: [s.efficacite_tir_pct || s.pct_arret_global || 0, 70, 50, 40, 90]
    }]
  }
});

// --- DATA : BARRES ---
const barData = computed(() => {
  const s = props.player?.stats;
  if (viewMode.value === 'Offensif' || s.is_gb) {
    const z = s.zones;
    return {
      labels: ['Ailes', '6m', '9m', '7m'],
      datasets: [{ label: '%', backgroundColor: s.is_gb ? '#14b8a6' : '#8b5cf6', borderRadius: 6, data: ['Ailes','6m','9m','7m'].map(k => z[k].tot > 0 ? (z[k].ok/z[k].tot*100) : 0) }]
    };
  }
  return {
    labels: ['Duels Gagnés', 'Duels Perdus', 'Contres'],
    datasets: [{ label: 'Actions', backgroundColor: '#10b981', borderRadius: 6, data: [s.def_duels_gagnes, s.def_duels_perdus, s.def_contres] }]
  };
});

// --- DATA : DOUGHNUT (EFFICACITÉ) ---
const effData = computed(() => {
  const s = props.player?.stats;
  if (s.is_gb) return { labels: ['Arrêts', 'Buts Enc.'], datasets: [{ data: [s.arrets_total, s.buts_encaisse], backgroundColor: ['#14b8a6', '#f3f4f6'], borderWidth: 0 }] };

  return viewMode.value === 'Offensif'
      ? { labels: ['Buts', 'Ratés'], datasets: [{ data: [s.total_buts, s.tirs_rates], backgroundColor: ['#8b5cf6', '#f3f4f6'], borderWidth: 0 }] }
      : { labels: ['Récups', 'Pertes'], datasets: [{ data: [s.def_recuperations || 1, s.total_balles_perdues], backgroundColor: ['#10b981', '#f43f5e'], borderWidth: 0 }] };
});

// --- OPTIONS ---
const lineOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'top' as const } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } } } };
const radarOptions = { responsive: true, maintainAspectRatio: false, scales: { r: { min: 0, max: 100, ticks: { display: false } } } };
const effOptions = { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'bottom' as const } } };
const barOptions = { responsive: true, maintainAspectRatio: false, scales: { y: { max: 100, beginAtZero: true } } };
</script>

<style scoped>
.card { border-radius: 20px; border: 1px solid #f1f1f4; box-shadow: 0 4px 20px -10px rgba(0,0,0,0.05); }
</style>