<template>
  <main class="min-h-screen bg-[#f7f7fb] pt-16">
    <div
        class="mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 transition-all duration-300"
        :class="isComparing ? 'max-w-[95%] xl:max-w-[1800px]' : 'max-w-[1180px]'"
    >
      <div class="flex justify-end mb-6">
        <button
            @click="toggleCompare"
            class="flex items-center gap-2 px-5 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-full shadow-sm hover:bg-violet-50 transition-colors"
        >
          <svg v-if="!isComparing" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          {{ isComparing ? 'Arrêter la comparaison' : 'Comparer deux joueuses' }}
        </button>
      </div>

      <div :class="isComparing ? 'grid grid-cols-1 xl:grid-cols-2 gap-8' : ''">
        <div v-for="(view, viewIndex) in displayedViews" :key="viewIndex" class="min-w-0 flex flex-col">

          <header class="relative card-large p-6 sm:p-8 mb-6">
            <div class="grid grid-cols-[auto_1fr] gap-6 items-start">
              <div class="relative w-28">
                <div class="h-28 w-28 rounded-full shadow-xl shadow-avatar bg-gradient-to-br from-rose-400 to-violet-500 grid place-items-center text-3xl font-bold text-white overflow-hidden -translate-y-2">
                  <img
                      v-if="view.player?.picture"
                      :src="view.player.picture"
                      alt="Photo"
                      class="h-28 w-28 rounded-full object-cover scale-125 transition-transform"
                      style="object-position: top center;"
                  />
                  <span v-else>
                    {{ view.player?.first_name?.charAt(0) ?? '' }}{{ view.player?.last_name?.charAt(0) ?? '' }}
                  </span>
                </div>
                <div class="absolute -right-1 -bottom-1 h-7 w-7 rounded-full bg-white border border-gray-100 flex items-center justify-center text-sm font-semibold shadow-sm">
                  {{ view.player?.jersey_number ?? '-' }}
                </div>
              </div>

              <div class="flex flex-col gap-4 w-full">
                <div class="relative">
                  <h1
                      class="text-2xl sm:text-3xl font-extrabold text-[#6B21A8] leading-tight cursor-pointer inline-flex items-center gap-2 hover:opacity-80"
                      @click.stop="toggleDropdown(viewIndex)"
                  >
                    {{ view.player?.last_name ?? 'Sélectionner' }} {{ view.player?.first_name ?? '' }}
                    <svg class="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                  </h1>

                  <div v-if="dropdowns[viewIndex]" class="absolute z-20 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl w-72 max-h-80 overflow-y-auto">
                    <ul>
                      <li
                          v-for="(p, pIdx) in players"
                          :key="p.id ?? p.uuid"
                          @click="selectPlayerForView(viewIndex, pIdx)"
                          class="px-5 py-3 hover:bg-violet-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center justify-between group"
                      >
                        <span class="font-medium text-gray-700 group-hover:text-violet-700">{{ p.last_name }} {{ p.first_name }}</span>
                        <span class="text-xs text-gray-400 border px-1 rounded">{{ p.position }}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="mt-2 w-full">
                  <div v-if="view.player?.stats?.is_gb" class="hidden md:flex flex-wrap gap-4">
                    <div class="mini-kpi flex-1 min-w-[140px]">
                      <div class="text-sm text-gray-500">Arrêts</div>
                      <div class="text-2xl font-semibold text-gray-900">{{ view.player?.stats?.arrets_total ?? 0 }}</div>
                      <div class="w-full mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div class="h-full rounded-full bg-gradient-to-r from-teal-400 to-blue-500" :style="{ width: pct(view.player?.stats?.pct_arret_global) }"></div>
                      </div>
                    </div>
                    <div class="mini-kpi flex-1 min-w-[140px]">
                      <div class="text-sm text-gray-500">% Arrêt</div>
                      <div class="text-2xl font-semibold text-gray-900">{{ pct(view.player?.stats?.pct_arret_global) }}</div>
                    </div>
                    <div class="mini-kpi flex-1 min-w-[140px]">
                      <div class="text-sm text-gray-500">Buts Encaissés</div>
                      <div class="text-2xl font-semibold text-rose-600">{{ view.player?.stats?.buts_encaisse ?? 0 }}</div>
                    </div>
                    <div class="mini-kpi flex-1 min-w-[140px]">
                      <div class="text-sm text-gray-500">Relances</div>
                      <div class="text-2xl font-semibold text-gray-900">{{ view.player?.stats?.total_passes_decisives ?? 0 }}</div>
                    </div>
                  </div>

                  <div v-else class="hidden md:flex flex-wrap gap-4">
                    <div class="mini-kpi flex-1 min-w-[140px]">
                      <div class="text-sm text-gray-500">Buts</div>
                      <div class="text-2xl font-semibold text-gray-900">{{ view.player?.stats?.total_buts ?? 0 }}</div>
                      <div class="w-full mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div class="h-full rounded-full bg-gradient-to-r from-rose-400 to-violet-500" :style="{ width: pct(view.player?.stats?.efficacite_tir_pct) }"></div>
                      </div>
                    </div>
                    <div class="mini-kpi flex-1 min-w-[140px]">
                      <div class="text-sm text-gray-500">Assistances</div>
                      <div class="text-2xl font-semibold text-gray-900">{{ view.player?.stats?.total_passes_decisives ?? 0 }}</div>
                      <div class="w-full mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div class="h-full rounded-full bg-gradient-to-r from-rose-400 to-violet-500" :style="{ width: pct(view.player?.stats?.ratio_passeur) }"></div>
                      </div>
                    </div>
                    <div class="mini-kpi flex-1 min-w-[140px]">
                      <div class="text-sm text-gray-500">% Tir</div>
                      <div class="text-2xl font-semibold text-gray-900">{{ pct(view.player?.stats?.efficacite_tir_pct) }}</div>
                    </div>
                    <div class="mini-kpi flex-1 min-w-[140px]">
                      <div class="text-sm text-gray-500">Pertes balles</div>
                      <div class="text-2xl font-semibold text-gray-900">{{ view.player?.stats?.total_balles_perdues ?? 0 }}</div>
                      <div class="w-full mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div class="h-full rounded-full bg-gradient-to-r from-rose-400 to-violet-500" :style="{ width: pct(view.player?.stats?.total_balles_perdues) }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <nav class="tabs flex gap-2 bg-white/60 border border-gray-100 rounded-full px-1 py-1 mb-6 self-start">
            <button
                v-for="t in tabs"
                :key="t"
                :class="['tab px-4 py-2 rounded-full text-sm font-semibold transition-all', activeTab === t ? 'active' : 'hover:bg-white/50']"
                @click="activeTab = t"
            >
              {{ t }}
            </button>
          </nav>

          <section v-if="activeTab === 'Stats'" class="flex-grow">
            <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">

              <div class="space-y-6 min-w-0">
                <template v-if="view.player?.stats?.is_gb">
                  <div class="card p-6 border-l-4 border-l-teal-500">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Performance Gardienne</h3>
                    <ul class="space-y-3 text-sm text-gray-700">
                      <li class="flex justify-between border-b border-gray-50 pb-2 last:border-0"><span>Arrêts Totaux</span><strong>{{ view.player?.stats?.arrets_total ?? 0 }}</strong></li>
                      <li class="flex justify-between border-b border-gray-50 pb-2 last:border-0"><span>% Arrêt Global</span><strong>{{ pct(view.player?.stats?.pct_arret_global) }}</strong></li>
                      <li class="flex justify-between border-b border-gray-50 pb-2 last:border-0"><span>Ratio (Arrêts/Cadrés)</span><strong>{{ view.player?.stats?.buts_sur_tirs_ratio_brut }}</strong></li>
                      <li class="flex justify-between border-b border-gray-50 pb-2 last:border-0"><span>Relances (Passes D)</span><strong>{{ view.player?.stats?.total_passes_decisives ?? 0 }}</strong></li>
                    </ul>
                  </div>

                  <div class="card p-6 border-l-4 border-l-rose-500">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Points Négatifs / Encaissés</h3>
                    <ul class="space-y-3 text-sm text-gray-700">
                      <li class="flex justify-between border-b border-gray-50 pb-2 last:border-0"><span>Buts Encaissés</span><strong>{{ view.player?.stats?.buts_encaisse ?? 0 }}</strong></li>
                      <li class="flex justify-between border-b border-gray-50 pb-2 last:border-0"><span>Tirs non cadrés reçus</span><strong>{{ view.player?.stats?.tirs_non_cadres_recus ?? 0 }}</strong></li>
                      <li class="flex justify-between border-b border-gray-50 pb-2 last:border-0"><span>Relances Ratées (PDB)</span><strong>{{ view.player?.stats?.total_balles_perdues ?? 0 }}</strong></li>
                    </ul>
                  </div>
                </template>

                <template v-else>
                  <div class="card p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistiques positives</h3>
                    <ul class="space-y-3 text-sm text-gray-700">
                      <li class="flex justify-between border-b border-gray-50 pb-2 last:border-0"><span>Buts totaux</span><strong>{{ view.player?.stats?.total_buts ?? 0 }}</strong></li>
                      <li class="flex justify-between border-b border-gray-50 pb-2 last:border-0"><span>Assistances</span><strong>{{ view.player?.stats?.total_passes_decisives ?? 0 }}</strong></li>
                      <li class="flex justify-between border-b border-gray-50 pb-2 last:border-0"><span>Ratio buts/tirs</span><strong>{{ view.player?.stats?.buts_sur_tirs_ratio_brut ?? '0 / 0' }}</strong></li>
                      <li class="flex justify-between border-b border-gray-50 pb-2 last:border-0"><span>Tirs ratés</span><strong>{{ view.player?.stats?.tirs_rates ?? 0 }}</strong></li>
                    </ul>
                  </div>

                  <div class="card p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistiques négatives</h3>
                    <ul class="space-y-3 text-sm text-gray-700">
                      <li class="flex justify-between border-b border-gray-50 pb-2 last:border-0"><span>Tirs Arrêtés (par GB adv)</span><strong>{{ view.player?.stats?.tirs_arretes ?? 0 }}</strong></li>
                      <li class="flex justify-between border-b border-gray-50 pb-2 last:border-0"><span>Balles Perdues</span><strong>{{ view.player?.stats?.total_balles_perdues ?? 0 }}</strong></li>
                      <li class="flex justify-between border-b border-gray-50 pb-2 last:border-0"><span>Sanctions 2min</span><strong>{{ view.player?.stats?.def_sanctions_2min ?? 0 }}</strong></li>
                    </ul>
                  </div>
                </template>

                <div v-if="!view.player?.stats?.is_gb" class="card p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Discipline & Défense</h3>
                  <ul class="space-y-3 text-sm text-gray-700">
                    <li class="flex justify-between border-b border-gray-50 pb-2 last:border-0"><span>Fautes défensives</span><strong>{{ view.player?.stats?.def_fautes ?? 0 }}</strong></li>
                    <li class="flex justify-between border-b border-gray-50 pb-2 last:border-0"><span>Duels gagnés</span><strong>{{ view.player?.stats?.def_duels_gagnes ?? 0 }}</strong></li>
                    <li class="flex justify-between border-b border-gray-50 pb-2 last:border-0"><span>Duels perdus</span><strong>{{ view.player?.stats?.def_duels_perdus ?? 0 }}</strong></li>
                  </ul>
                </div>
              </div>

              <aside class="card p-6 lg:w-[280px] h-fit sticky top-24">
                <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wider opacity-60 mb-4">
                  Profil Athlétique
                </h4>

                <div class="space-y-4 text-sm text-gray-700">
                  <div class="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span class="text-gray-500">Club</span>
                    <span class="font-semibold text-right max-w-[150px] truncate">{{ view.player?.team_name }}</span>
                  </div>

                  <div class="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span class="text-gray-500">Âge</span>
                    <span class="font-bold bg-gray-100 px-2 py-1 rounded text-gray-800">
                      {{ getAge(view.player?.birth_date) }}
                    </span>
                  </div>

                  <div class="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span class="text-gray-500">Taille</span>
                    <span class="font-bold bg-gray-100 px-2 py-1 rounded text-gray-800">
                      {{ formatHeight(view.player?.height_cm) }}
                    </span>
                  </div>

                  <div class="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span class="text-gray-500">Poste</span>
                    <span class="font-bold bg-violet-100 text-violet-700 px-2 py-1 rounded">
                      {{ view.player?.position }}
                    </span>
                  </div>
                </div>


              </aside>

            </div>
          </section>

          <section v-else-if="activeTab === 'Graphiques'" class="flex-grow">

            <div
                v-if="view.player && view.player.stats && (view.player.stats.total_buts + view.player.stats.tirs_rates + view.player.stats.arrets_total + view.player.stats.buts_encaisse > 0)"
                class="grid grid-cols-1 md:grid-cols-2 gap-6"
            >

              <div class="card p-6 flex flex-col items-center">
                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  {{ view.player.stats?.is_gb ? 'Répartition Arrêts' : 'Efficacité au Tir' }}
                </h3>
                <div class="h-64 w-full relative">
                  <Doughnut
                      :key="view.player.id + '_doughnut'"
                      :data="getChartsData(view.player)!.doughnutData"
                      :options="commonOptions"
                  />
                </div>
              </div>

              <div class="card p-6 flex flex-col items-center">
                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Profil d'Impact
                </h3>
                <div class="h-64 w-full relative">
                  <Radar
                      :key="view.player.id + '_radar'"
                      :data="getChartsData(view.player)!.radarData"
                      :options="radarOptions"
                  />
                </div>
              </div>

              <div class="card p-6 col-span-1 md:col-span-2">
                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  {{ view.player.stats?.is_gb ? 'Efficacité par Zone (Arrêts)' : 'Réussite par Zone (Tirs)' }}
                </h3>
                <div class="h-64 w-full relative">
                  <Bar
                      :key="view.player.id + '_bar'"
                      :data="getChartsData(view.player)!.barData"
                      :options="commonOptions"
                  />
                </div>
              </div>

            </div>

            <div v-else class="flex flex-col items-center justify-center py-20 text-center card">
              <div class="bg-gray-100 p-4 rounded-full mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900">Pas assez de données</h3>
              <p class="text-gray-500 max-w-sm mt-1">
                Il n'y a pas encore d'événements enregistrés pour {{ view.player?.first_name }}.
              </p>
            </div>
          </section>

          <section v-else-if="activeTab === 'Heat Map'" class="card p-12 text-center text-gray-500">
            Heat Map à venir...
          </section>

        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import {
  Chart as ChartJS,
  registerables,
  type ChartData,
  type ChartOptions
} from 'chart.js'
import { Bar, Doughnut, Radar } from 'vue-chartjs'

ChartJS.register(...registerables)

definePageMeta({ roles: ['coach'] })

interface Stats {
  def_duels_gagnes: number; total_buts: number; buts_sur_tirs_ratio_brut: string; total_actions_def_negatives: number; def_duels_perdus: number; def_recuperations: number; efficacite_aile_pct: number; total_balles_perdues: number; total_actions_def_positives: number; def_contres: number; def_sanctions_2min: number; efficacite_9m_pct: number; efficacite_6m_pct: number; ratio_passeur: number; total_passes_decisives: number; tirs_rates: number; def_fautes: number; efficacite_tir_pct: number; tirs_arretes: number; efficacite_7m_pct: number;
  is_gb: boolean; buts_encaisse: number; arrets_total: number; tirs_non_cadres_recus: number; pct_arret_global: number;
  [k: string]: any
}

interface Player {
  id?: number; uuid?: string; first_name?: string; last_name?: string; picture?: string; jersey_number?: number; team_name?: string; nom_csv?: string; birth_date?: string; height_cm?: number; stats?: Stats | null; events?: any[]; position?: string;
}

interface ChartsPayload {
  doughnutData: ChartData<'doughnut'>
  barData: ChartData<'bar'>
  radarData: ChartData<'radar'>
}

const players = ref<Player[]>([])
const tabs = ['Stats', 'Graphiques', 'Heat Map']
const activeTab = ref<string>('Stats')
const isComparing = ref(false)
const selectedIndices = ref<number[]>([-1, -1])
const dropdowns = ref<boolean[]>([false, false])

const displayedViews = computed(() => {
  const views = []
  views.push({ index: 0, playerIndex: selectedIndices.value[0], player: selectedIndices.value[0] >= 0 ? players.value[selectedIndices.value[0]] : null })
  if (isComparing.value) { views.push({ index: 1, playerIndex: selectedIndices.value[1], player: selectedIndices.value[1] >= 0 ? players.value[selectedIndices.value[1]] : null }) }
  return views
})

function getAge(d?: string): string { if (!d) return '-'; const t = new Date(); const b = new Date(d); let a = t.getFullYear() - b.getFullYear(); const m = t.getMonth() - b.getMonth(); if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--; return `${a} ans`; }
function formatHeight(c?: number): string { return c ? `${c} cm` : '-' }
function pct(v?: number | null): string { if (v == null || Number.isNaN(Number(v))) return '0%'; return `${Math.max(0, Math.min(100, Math.round(Number(v))))}%` }

const commonOptions: ChartOptions<'bar' | 'doughnut'> = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 15 } } }
}
const radarOptions: ChartOptions<'radar'> = {
  responsive: true, maintainAspectRatio: false,
  scales: { r: { angleLines: { display: true }, suggestedMin: 0, suggestedMax: 100, ticks: { display: false } } },
  plugins: { legend: { display: false } }
}


function getChartsData(player: Player | null): ChartsPayload | null {
  if (!player || !player.stats) return null

  const s = player.stats
  const isGB = s.is_gb
  const events = player.events || []


  const zones = {
    '9m': {ok:0, tot:0},
    '6m': {ok:0, tot:0},
    '7m': {ok:0, tot:0}
  }

  let defensiveImpact = 0;

  events.forEach(ev => {
    const res = ev.resultat;
    const sec = ev.secteur || '';
    const def = ev.defenseplus || '';

    if (def.includes('recup') || def.includes('contre')) defensiveImpact++;

    if (['But', 'Ar GB', 'Arret', 'Arrêt'].includes(res)) {
      let k: '9m'|'6m'|'7m' = '6m';

      if (sec.includes('9m') || sec.includes('Central') || sec.includes('Ext')) k = '9m';
      else if (sec.includes('7m') || ev.jets7m) k = '7m';

      zones[k].tot++;

      if (isGB) {
        if (res !== 'But') zones[k].ok++;
      } else {
        if (res === 'But') zones[k].ok++;
      }
    }
  })

  const dVals = isGB
      ? [s.arrets_total, s.buts_encaisse, s.tirs_non_cadres_recus]
      : [s.total_buts, s.tirs_rates + s.tirs_arretes]

  const doughnutData: ChartData<'doughnut'> = {
    labels: isGB ? ['Arrêts', 'Buts Encaissés', 'Non Cadrés'] : ['Buts', 'Ratés/Arrêtés'],
    datasets: [{
      backgroundColor: isGB ? ['#14b8a6', '#f43f5e', '#94a3b8'] : ['#8b5cf6', '#e2e8f0'],
      data: dVals,
      borderWidth: 0,
      hoverOffset: 4
    }]
  } as ChartData<'doughnut'>

 const barZones = { '9m': {ok:0, tot:0}, '6m': {ok:0, tot:0}, 'Ailes': {ok:0, tot:0}, '7m': {ok:0, tot:0} };
  events.forEach(ev => {
    const res = ev.resultat; const sec = ev.secteur || '';
    if (!['But', 'Ar GB', 'Arret', 'Arrêt'].includes(res)) return;
    let k: '9m'|'6m'|'Ailes'|'7m' = '6m';
    if (sec.includes('9m') || sec.includes('Central') || sec.includes('Ext')) k = '9m';
    else if (sec.includes('AL') || sec.includes('Aile')) k = 'Ailes';
    else if (sec.includes('7m') || ev.jets7m) k = '7m';

    barZones[k].tot++;
    if (isGB) { if(res !== 'But') barZones[k].ok++ } else { if(res === 'But') barZones[k].ok++ }
  });

  const barData: ChartData<'bar'> = {
    labels: ['Ailes', '6m', '9m', '7m'],
    datasets: [{
      label: isGB ? '% Arrêt' : '% Réussite',
      backgroundColor: isGB ? '#14b8a6' : '#8b5cf6',
      borderRadius: 4,
      data: [
        barZones['Ailes'].tot ? (barZones['Ailes'].ok / barZones['Ailes'].tot * 100) : 0,
        barZones['6m'].tot ? (barZones['6m'].ok / barZones['6m'].tot * 100) : 0,
        barZones['9m'].tot ? (barZones['9m'].ok / barZones['9m'].tot * 100) : 0,
        barZones['7m'].tot ? (barZones['7m'].ok / barZones['7m'].tot * 100) : 0,
      ]
    }]
  } as ChartData<'bar'>



  let radarLabels: string[] = [];
  let radarValues: number[] = [];

  if (isGB) {
    radarLabels = ['Global %', 'Arrêts 9m', 'Arrêts 6m/Ailes', 'Penalty (7m)', 'Relance'];

    const pct9m = zones['9m'].tot > 0 ? (zones['9m'].ok / zones['9m'].tot * 100) : 0;
    const pct6m = zones['6m'].tot > 0 ? (zones['6m'].ok / zones['6m'].tot * 100) : 0;
    const pct7m = zones['7m'].tot > 0 ? (zones['7m'].ok / zones['7m'].tot * 100) : 0;

    const scoreRelance = Math.min(100, s.total_passes_decisives * 20);

    radarValues = [
      s.pct_arret_global,
      pct9m,
      pct6m,
      pct7m,
      scoreRelance
    ];

  } else {
    radarLabels = ['Finition', 'Création', 'Duel Déf.', 'Impact Déf.', 'Propreté'];

    const scoreFinition = s.efficacite_tir_pct;

    const scoreCreation = Math.min(100, s.total_passes_decisives * 25);

    const totalDuels = s.def_duels_gagnes + s.def_duels_perdus;
    const scoreDuel = totalDuels > 0 ? (s.def_duels_gagnes / totalDuels * 100) : 50;

    const scoreImpact = Math.min(100, defensiveImpact * 25);

    const scoreProprete = Math.max(0, 100 - (s.total_balles_perdues * 15));

    radarValues = [scoreFinition, scoreCreation, scoreDuel, scoreImpact, scoreProprete];
  }

  const radarData: ChartData<'radar'> = {
    labels: radarLabels,
    datasets: [{
      label: isGB ? 'Performance GB' : 'Profil Joueuse',
      backgroundColor: isGB ? 'rgba(20, 184, 166, 0.2)' : 'rgba(139, 92, 246, 0.2)',
      borderColor: isGB ? '#14b8a6' : '#8b5cf6',
      pointBackgroundColor: isGB ? '#14b8a6' : '#8b5cf6',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: isGB ? '#14b8a6' : '#8b5cf6',
      data: radarValues
    }]
  } as ChartData<'radar'>

  return { doughnutData, barData, radarData }
}
function computePlayerStats(events: any[], position: string = ''): Stats {
  const isGB = position === 'G' || position === 'GB';
  const stats: Stats = { def_duels_gagnes: 0, total_buts: 0, buts_sur_tirs_ratio_brut: '0/0', total_actions_def_negatives: 0, def_duels_perdus: 0, def_recuperations: 0, efficacite_aile_pct: 0, total_balles_perdues: 0, total_actions_def_positives: 0, def_contres: 0, def_sanctions_2min: 0, efficacite_9m_pct: 0, efficacite_6m_pct: 0, ratio_passeur: 0, total_passes_decisives: 0, tirs_rates: 0, def_fautes: 0, efficacite_tir_pct: 0, tirs_arretes: 0, efficacite_7m_pct: 0, is_gb: isGB, buts_encaisse: 0, arrets_total: 0, tirs_non_cadres_recus: 0, pct_arret_global: 0 }
  let tirs_total = 0; let aile_tirs = 0, aile_buts = 0; let m9_tirs = 0, m9_buts = 0; let m6_tirs = 0, m6_buts = 0; let m7_tirs = 0, m7_buts = 0

  events.forEach(ev => {
    const res = ev.resultat; const defPlus = ev.defenseplus; const defMoins = ev.defensemoins; const secteur = ev.secteur; const passed = ev.passed
    const isTirEvent = ['But', 'Ar GB', 'HC', 'Neut contre', 'tir raté NC'].includes(res)

    if (isGB) {
      if (res === 'But') stats.buts_encaisse++
      if (res === 'Ar GB' || res === 'Arret' || res === 'Arrêt') stats.arrets_total++
      if (res === 'HC') stats.tirs_non_cadres_recus++
      if ((passed && passed !== '') || (ev.nom && ev.nom.toLowerCase().includes('passe'))) stats.total_passes_decisives++
      if (res === 'PDB') stats.total_balles_perdues++
    } else {
      const isBut = res === 'But';
      if (isTirEvent) {
        tirs_total++
        if (isBut) stats.total_buts++
        else stats.tirs_rates++
        if (res === 'Ar GB') stats.tirs_arretes++;
        if (secteur) {
          if (secteur.includes('AL')) { aile_tirs++; if (isBut) aile_buts++ } else if (secteur.includes('9m')) { m9_tirs++; if (isBut) m9_buts++ } else if (secteur.includes('7m') || ev.jets7m) { m7_tirs++; if (isBut) m7_buts++ } else { m6_tirs++; if (isBut) m6_buts++ }
        }
      }
      if (res === 'PDB') stats.total_balles_perdues++
      if ((passed && passed !== '') || (ev.nom && ev.nom.toLowerCase().includes('passe'))) stats.total_passes_decisives++
      stats.efficacite_tir_pct = tirs_total > 0 ? (stats.total_buts / tirs_total) * 100 : 0
      stats.efficacite_aile_pct = aile_tirs > 0 ? (aile_buts / aile_tirs) * 100 : 0
      stats.efficacite_9m_pct = m9_tirs > 0 ? (m9_buts / m9_tirs) * 100 : 0
      stats.efficacite_6m_pct = m6_tirs > 0 ? (m6_buts / m6_tirs) * 100 : 0
      stats.efficacite_7m_pct = m7_tirs > 0 ? (m7_buts / m7_tirs) * 100 : 0
      stats.buts_sur_tirs_ratio_brut = `${stats.total_buts}/${tirs_total}`
    }
    if (defPlus) { stats.total_actions_def_positives++; if (defPlus.includes('recup')) stats.def_recuperations++; if (defPlus.includes('contre')) stats.def_contres++; if (defPlus.includes('duel gagné')) stats.def_duels_gagnes++; if (defPlus.includes('PF') || defPlus.includes('force')) stats.def_fautes++; }
    if (defMoins) { stats.total_actions_def_negatives++; if (defMoins.includes('Duel perdu')) stats.def_duels_perdus++; }
    if (res && res.includes('2min')) stats.def_sanctions_2min++;
  })

  if (isGB) {
    const t = stats.arrets_total + stats.buts_encaisse;
    stats.pct_arret_global = t > 0 ? (stats.arrets_total / t) * 100 : 0;
    stats.buts_sur_tirs_ratio_brut = `${stats.arrets_total}/${t}`;
  } else {
    const tp = stats.total_passes_decisives + stats.total_balles_perdues
    stats.ratio_passeur = tp > 0 ? stats.total_passes_decisives / stats.total_balles_perdues : stats.total_passes_decisives
  }
  return stats
}

async function fetchPlayers() {
  try {
    const [eR, pR, plR] = await Promise.all([fetch('http://localhost:8080/evenement'), fetch('http://localhost:8080/positions'), fetch('http://localhost:8080/auth/players')]);
    if(!plR.ok) throw new Error('Failed');
    const evD = await eR.json(); const poD = await pR.json(); const plD = await plR.json();
    const allEv = evD.docs || []; const pos = poD.docs || [];
    players.value = plD.map((p: any) => {
      const pEv = allEv.filter((ev: any) => ev.joueuse === p.nom_csv);
      const posObj = pos.find((px: any) => px.player_id === p.id);
      return { ...p, events: pEv, stats: computePlayerStats(pEv, posObj?.abrevation || ''), position: posObj?.abrevation || '' } as Player
    });
    if (players.value.length > 0) selectedIndices.value[0] = 0;
  } catch (e) { console.error(e); players.value = []; selectedIndices.value = [-1, -1] }
}

function toggleCompare() { isComparing.value = !isComparing.value; if (isComparing.value && selectedIndices.value[1] === -1 && players.value.length > 1) selectedIndices.value[1] = selectedIndices.value[0] === 0 ? 1 : 0; }
function toggleDropdown(viewIdx: number) { dropdowns.value = dropdowns.value.map((v, i) => i === viewIdx ? !v : false) }
function selectPlayerForView(viewIdx: number, playerIdx: number) { selectedIndices.value[viewIdx] = playerIdx; dropdowns.value[viewIdx] = false; }
function closeAllDropdowns() { dropdowns.value = [false, false] }
onMounted(() => { fetchPlayers(); document.addEventListener('click', closeAllDropdowns); })
onUnmounted(() => document.removeEventListener('click', closeAllDropdowns))
</script>


<style scoped>
.card-large { background: #fff; border-radius: 18px; border: 1px solid #f1f1f4; box-shadow: 0 18px 40px -20px rgba(16,24,40,0.12); }
.card { background: #fff; border-radius: 14px; border: 1px solid #f1f1f4; box-shadow: 0 10px 30px -18px rgba(16,24,40,0.08); }
.shadow-avatar { box-shadow: 0 18px 40px -26px rgba(168,85,247,0.35); }
.mini-kpi { background: #fff; border: 1px solid #f3f3f6; border-radius: 12px; padding: 10px 12px; box-shadow: 0 8px 26px -20px rgba(16,24,40,0.06); }
.tabs .tab { padding: 10px 18px; border-radius: 9999px; font-weight: 600; color: #6b7280; background: transparent; border: none; }
.tabs .tab.active { background: linear-gradient(90deg,#f472b6,#a78bfa); color: white; box-shadow: 0 6px 20px -12px rgba(167,139,250,0.4); }

</style>