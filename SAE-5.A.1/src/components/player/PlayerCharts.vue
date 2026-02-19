<template>
  <div v-if="player?.stats" class="grid grid-cols-1 lg:grid-cols-[140px_1fr] gap-8">

    <div v-if="!player.stats.is_gb" class="flex flex-col gap-3 pt-12">
      <button v-for="m in ['Offensif', 'Défensif']" :key="m" @click="viewMode = m"
              :class="[ 'py-4 rounded-2xl text-[10px] font-black uppercase transition-all border-2 tracking-tighter',
          viewMode === m ? 'bg-[#8b5cf6] text-white border-[#8b5cf6] shadow-lg scale-105' : 'bg-white text-gray-400 border-gray-100 hover:border-violet-200' ]">
        {{ m }}
      </button>
    </div>
    <div v-else class="hidden lg:block pt-12 text-center">
      <div class="inline-block bg-teal-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest rotate-[-90deg] translate-y-12">
        Gardienne
      </div>
    </div>

    <div class="space-y-8">
      <div class="grid md:grid-cols-2 gap-6">

        <div :class="['card p-6 bg-white border border-gray-100 shadow-sm rounded-[25px]', player.stats.is_gb ? 'md:col-span-2' : '']">
          <h3 class="text-xs font-bold text-gray-400 uppercase mb-6 tracking-widest">{{ evoTitle }}</h3>
          <div class="h-64">
            <Line :key="'evo_'+viewMode+player.id" :data="lineData" :options="lineOptions" />
          </div>
        </div>

        <div v-if="!player.stats.is_gb" class="card p-6 bg-white border border-gray-100 shadow-sm rounded-[25px]">
          <h3 class="text-xs font-bold text-gray-400 uppercase mb-6 text-center tracking-widest">Profil d'Impact</h3>
          <div class="h-64">
            <Radar :key="'rad_'+viewMode+player.id" :data="radarData" :options="radarOptions" />
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 card p-6 bg-white border border-gray-100 shadow-sm rounded-[25px]">
          <h3 class="text-xs font-bold text-gray-400 uppercase mb-6 tracking-widest">{{ zoneTitle }}</h3>
          <div class="h-64">
            <Bar :key="'bar_'+viewMode+player.id" :data="barData" :options="barOptions" />
          </div>
        </div>

        <div class="card p-6 bg-white border border-gray-100 shadow-sm rounded-[25px] flex flex-col items-center relative">
          <h3 class="text-xs font-bold text-gray-400 uppercase mb-6 tracking-widest">Bilan</h3>
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Line, Radar, Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, registerables } from 'chart.js'
ChartJS.register(...registerables)

const props = defineProps({ player: Object });
const viewMode = ref('Offensif');

// --- LABELS DYNAMIQUES ---
const evoTitle = computed(() => props.player?.stats.is_gb ? 'Évolution des Arrêts' : (viewMode.value === 'Offensif' ? 'Évolution des Buts' : 'Récupérations vs Pertes'));
const zoneTitle = computed(() => props.player?.stats.is_gb ? 'Efficacité Arrêts par Zone' : (viewMode.value === 'Offensif' ? 'Réussite au Tir par Zone' : 'Bilan Actions Défensives'));
const centerLabel = computed(() => {
  const s = props.player?.stats;
  if (s.is_gb) return Math.round(s.pct_arret_global || 0) + '%';
  return viewMode.value === 'Offensif' ? Math.round(s.efficacite_tir_pct || 0) + '%' : (s.def_recuperations || 0) + ' R';
});

// --- 1. DATA ÉVOLUTION (COURBES) ---
const lineData = computed(() => {
  const h = props.player?.stats.history || [];
  const labels = h.map((_:any, i:number) => `Match ${i+1}`);

  if (props.player?.stats.is_gb) {
    return { labels, datasets: [{ label: 'Arrêts', data: h.map((m:any) => m.saves), borderColor: '#14b8a6', backgroundColor: 'rgba(20, 184, 166, 0.1)', fill: true, tension: 0.4 }] };
  }

  if (viewMode.value === 'Défensif') {
    return { labels, datasets: [
        { label: 'Récupérations', data: h.map((m:any) => m.recups), borderColor: '#10b981', backgroundColor: 'transparent', tension: 0.4 },
        { label: 'Pertes (PDB)', data: h.map((m:any) => m.pdbs), borderColor: '#f43f5e', backgroundColor: 'transparent', tension: 0.4 }
      ]};
  }

  return { labels, datasets: [{ label: 'Buts', data: h.map((m:any) => m.goals), borderColor: '#8b5cf6', backgroundColor: 'rgba(139, 92, 246, 0.1)', fill: true, tension: 0.4 }] };
});

// --- 2. DATA RADAR (PROFIL D'IMPACT MESURÉ) ---
const radarData = computed(() => {
  const s = props.player?.stats;

  if (viewMode.value === 'Offensif') {
    return {
      labels: ['Finition', 'Création', 'Explosivité', 'Impact', 'Propreté'],
      datasets: [{
        label: props.player?.last_name,
        data: [
          s.efficacite_tir_pct,
          Math.min(100, s.total_passes_decisives * 10),
          75, // Valeur de base liée au style de jeu
          Math.min(100, s.total_buts * 5),
          Math.max(0, 100 - (s.total_balles_perdues * 5))
        ],
        borderColor: '#8b5cf6', backgroundColor: 'rgba(139, 92, 246, 0.2)'
      }]
    };
  } else {
    // Mode Défensif avec mesures réelles
    const totalDuels = (s.def_duels_gagnes || 0) + (s.def_duels_perdus || 0);
    const duelSuccess = totalDuels > 0 ? (s.def_duels_gagnes / totalDuels) * 100 : 0;

    return {
      labels: ['Eff. Duel', 'Récupérations', 'Contres', 'Discipline', 'Activité'],
      datasets: [{
        label: props.player?.last_name,
        data: [
          duelSuccess,
          Math.min(100, s.def_recuperations * 20),
          Math.min(100, s.def_contres * 25),
          Math.max(0, 100 - (s.def_sanctions_2min * 20)),
          Math.min(100, (s.def_duels_gagnes + s.def_recuperations) * 5)
        ],
        borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.2)'
      }]
    };
  }
});

// --- 3. DATA BARRES (ZONES OU DUELS) ---
const barData = computed(() => {
  const s = props.player?.stats;
  if (viewMode.value === 'Offensif' || s.is_gb) {
    const z = s.zones;
    return { labels: ['Ailes', '6m', '9m', '7m'], datasets: [{ label: '%', backgroundColor: s.is_gb ? '#14b8a6' : '#8b5cf6', borderRadius: 8, data: ['Ailes','6m','9m','7m'].map(k => z[k].tot > 0 ? (z[k].ok/z[k].tot*100) : 0) }] };
  }
  return { labels: ['Duels Gagnés', 'Contres', 'Récups'], datasets: [{ label: 'Actions', backgroundColor: '#10b981', borderRadius: 8, data: [s.def_duels_gagnes, s.def_contres, s.def_recuperations] }] };
});

// --- 4. DATA DOUGHNUT (EFFICACITÉ) ---
const effData = computed(() => {
  const s = props.player?.stats;
  if (s.is_gb) return { labels: ['Arrêts', 'Buts Enc.'], datasets: [{ data: [s.arrets_total, s.buts_encaisse], backgroundColor: ['#14b8a6', '#f3f4f6'], borderWidth: 0 }] };
  return viewMode.value === 'Offensif'
      ? { labels: ['Buts', 'Ratés'], datasets: [{ data: [s.total_buts, s.tirs_rates], backgroundColor: ['#8b5cf6', '#f3f4f6'], borderWidth: 0 }] }
      : { labels: ['Gagnés (R+C)', 'Pertes (PDB)'], datasets: [{ data: [s.def_recuperations + s.def_contres, s.total_balles_perdues], backgroundColor: ['#10b981', '#f43f5e'], borderWidth: 0 }] };
});

// --- OPTIONS DES GRAPHIQUES ---
const commonOptions = { responsive: true, maintainAspectRatio: false };
const lineOptions = { ...commonOptions, plugins: { legend: { display: true, position: 'top' as const, labels: { usePointStyle: true, font: { size: 10 } } } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } } } };
const radarOptions = { ...commonOptions, scales: { r: { min: 0, max: 100, ticks: { display: false }, pointLabels: { font: { size: 10, weight: 'bold' } } } }, plugins: { legend: { display: true, position: 'bottom' as const } } };
const effOptions = { ...commonOptions, cutout: '75%', plugins: { legend: { position: 'bottom' as const, labels: { boxWidth: 12, font: { size: 10 } } } } };
const barOptions = { ...commonOptions, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: (v:any) => viewMode.value === 'Défensif' ? v : v + '%' } } }, plugins: { legend: { display: false } } };
</script>

<style scoped>
.card { background: #fff; border-radius: 20px; border: 1px solid #f1f1f4; box-shadow: 0 4px 20px -10px rgba(0,0,0,0.05); transition: transform 0.2s ease; }
.card:hover { transform: translateY(-2px); }
</style>