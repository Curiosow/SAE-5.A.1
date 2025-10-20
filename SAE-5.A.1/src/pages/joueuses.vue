<template>
  <main class="min-h-screen bg-[#f7f7fb]">
    <div class="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 pt-6 pb-12">

      <!-- Back button -->
      <div class="mb-4">
        <button @click="$router.back()"
                class="inline-flex items-center gap-2 text-sm text-gray-700 bg-white/60 backdrop-blur rounded-full px-3 py-2 shadow-sm border border-gray-100">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18L9 12l6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Retour aux Joueuses
        </button>
      </div>

      <!-- Large header card -->
      <header class="relative card-large p-6 sm:p-8 mb-6">
        <div class="grid grid-cols-[140px_1fr] gap--1 items-start">
          <!-- Avatar column -->
          <div class="relative">
            <div class="h-28 w-28 rounded-full shadow-xl shadow-avatar bg-gradient-to-br from-rose-400 to-violet-500 grid place-items-center text-3xl font-bold text-white overflow-hidden -translate-y-2">
              <img
                  v-if="players[selectedPlayerIndex]?.picture"
                  :src="players[selectedPlayerIndex].picture"
                  alt="Photo de la joueuse"
                  class="h-28 w-28 rounded-full object-cover scale-125 transition-transform"
                  style="object-position: top center;"
              />
              <span v-else>
  {{ players[selectedPlayerIndex]?.first_name?.charAt(0) }}{{ players[selectedPlayerIndex]?.last_name?.charAt(0) }}
  </span>
            </div>
            <div
                class="absolute -right--1 -bottom-1 h-7 w-7 rounded-full bg-white border border-gray-100 flex items-center justify-center text-sm font-semibold shadow-sm">
              {{ players[selectedPlayerIndex]?.jersey_number }}
            </div>
          </div>

          <!-- Content column: NAME -> BADGES -> KPI ROW -->
          <div class="flex flex-col gap-4">
            <!-- NAME -->
            <div>
              <div class="relative">
                <h1
                  class="text-2xl sm:text-3xl font-extrabold text-[#6B21A8] leading-tight cursor-pointer"
                  @click="showDropdown = !showDropdown"
                >
                  {{ players[selectedPlayerIndex]?.last_name }} {{ players[selectedPlayerIndex]?.first_name }}
                  <svg class="inline w-4 h-4 ml-2" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4" stroke="#6B21A8" stroke-width="2" fill="none"/></svg>
                </h1>
                <div
                  v-if="showDropdown"
                  class="absolute z-10 mt-2 bg-white border border-gray-200 rounded shadow-lg w-64"
                >
                  <ul>
                    <li
                      v-for="(p, idx) in players"
                      :key="p.id"
                      @click="selectPlayer(idx)"
                      class="px-4 py-2 hover:bg-violet-100 cursor-pointer"
                    >
                      {{ p.last_name }} {{ p.first_name }}
                    </li>
                  </ul>
                </div>
              </div>           </div>

            <!-- BADGES (sous le nom) -->
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs bg-white border border-gray-100 px-2 py-1 rounded-full text-gray-600 flex items-center gap-2">
                <svg class="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.2"/></svg>
                Pivot
              </span>

              <span class="text-xs bg-white border border-gray-100 px-2 py-1 rounded-full text-gray-600 flex items-center gap-2">
                <svg class="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none"><path d="M6 8h12" stroke="currentColor" stroke-width="1.2"/></svg>
  {{ players[selectedPlayerIndex]?.team_name }}
              </span>

              <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
            </div>

            <!-- KPI cards (sous les badges) -->
            <div class="mt-2">
              <!-- Desktop: single row; Mobile: grid 2x2 -->
              <div class="hidden md:flex gap-4">
                <div class="mini-kpi">
                  <div class="text-sm text-gray-500">Buts</div>
                  <div class="text-2xl font-semibold text-gray-900">45</div>
                  <div class="w-full mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div class="h-full rounded-full bg-gradient-to-r from-rose-400 to-violet-500" style="width:72%"></div>
                  </div>
                </div>

                <div class="mini-kpi">
                  <div class="text-sm text-gray-500">Assistances</div>
                  <div class="text-2xl font-semibold text-gray-900">28</div>
                  <div class="w-full mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div class="h-full rounded-full bg-gradient-to-r from-rose-400 to-violet-500" style="width:62%"></div>
                  </div>
                </div>

                <div class="mini-kpi">
                  <div class="text-sm text-gray-500">Arrêts</div>
                  <div class="text-2xl font-semibold text-gray-900">0</div>
                  <div class="w-full mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div class="h-full rounded-full bg-gradient-to-r from-rose-400 to-violet-500" style="width:6%"></div>
                  </div>
                </div>

                <div class="mini-kpi">
                  <div class="text-sm text-gray-500">Contre-attaques</div>
                  <div class="text-2xl font-semibold text-gray-900">12</div>
                  <div class="w-full mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div class="h-full rounded-full bg-gradient-to-r from-rose-400 to-violet-500" style="width:44%"></div>
                  </div>
                </div>
              </div>

              <!-- Mobile grid 2x2 -->
              <div class="grid grid-cols-2 gap-4 md:hidden">
                <div class="mini-kpi">
                  <div class="text-sm text-gray-500">Buts</div>
                  <div class="text-xl font-semibold text-gray-900">45</div>
                  <div class="w-full mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div class="h-full rounded-full bg-gradient-to-r from-rose-400 to-violet-500" style="width:72%"></div>
                  </div>
                </div>

                <div class="mini-kpi">
                  <div class="text-sm text-gray-500">Assistances</div>
                  <div class="text-xl font-semibold text-gray-900">28</div>
                  <div class="w-full mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div class="h-full rounded-full bg-gradient-to-r from-rose-400 to-violet-500" style="width:62%"></div>
                  </div>
                </div>

                <div class="mini-kpi">
                  <div class="text-sm text-gray-500">Arrêts</div>
                  <div class="text-xl font-semibold text-gray-900">0</div>
                  <div class="w-full mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div class="h-full rounded-full bg-gradient-to-r from-rose-400 to-violet-500" style="width:6%"></div>
                  </div>
                </div>

                <div class="mini-kpi">
                  <div class="text-sm text-gray-500">Contre-attaques</div>
                  <div class="text-xl font-semibold text-gray-900">12</div>
                  <div class="w-full mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div class="h-full rounded-full bg-gradient-to-r from-rose-400 to-violet-500" style="width:44%"></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- end KPI -->
          </div>
        </div>
      </header>

      <!-- Tabs -->
      <nav class="tabs flex gap-2 bg-white/60 border border-gray-100 rounded-full px-1 py-1 mb-6" role="tablist">
        <button
            v-for="t in tabs"
            :key="t"
            :class="['tab px-4 py-2 rounded-full text-sm font-semibold', activeTab === t ? 'active' : '']"
            @click="activeTab = t"
            role="tab"
            :aria-selected="activeTab === t"
        >
          {{ t }}
        </button>
      </nav>

      <!-- Main content depending on tab (for now same content across tabs, but ready) -->
      <section v-if="activeTab === 'Performance'">
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <!-- Left column: 3 cards row (offensives / defensives / discipline) -->
          <div class="space-y-6">
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistiques offensives</h3>
              <ul class="space-y-3 text-sm text-gray-700">
                <li class="flex justify-between"><span>Buts totaux</span><strong>45</strong></li>
                <li class="flex justify-between"><span>Assistances</span><strong>28</strong></li>
                <li class="flex justify-between"><span>Contre-attaques</span><strong>12</strong></li>
                <li class="flex justify-between"><span>Tir à 7 mètres</span><strong>7</strong></li>
              </ul>
            </div>

            <div class="card p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistiques défensives</h3>
              <ul class="space-y-3 text-sm text-gray-700">
                <li class="flex justify-between"><span>Arrêts</span><strong>0</strong></li>
                <li class="flex justify-between"><span>Actions défensives</span><strong>25</strong></li>
                <li class="flex justify-between"><span>Taux d'arrêts</span><strong>0%</strong></li>
              </ul>
            </div>

            <div class="card p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Discipline</h3>
              <ul class="space-y-3 text-sm text-gray-700">
                <li class="flex justify-between"><span>Pénaltis</span><strong>8</strong></li>
                <li class="flex justify-between"><span>Cartons jaunes</span><strong>1</strong></li>
                <li class="flex justify-between"><span>Cartons rouges</span><strong>1</strong></li>
                <li class="flex justify-between"><span>Suspensions</span><strong>0</strong></li>
              </ul>
            </div>
          </div>

          <!-- Right column: summary / small visual area -->
          <aside class="card p-6">
            <h4 class="text-sm font-semibold text-gray-900">Résumé</h4>
            <div class="mt-4 text-sm text-gray-600">
              <p>Buts : <strong>45</strong></p>
              <p>Assistances : <strong>28</strong></p>
              <p>Contre-attaques : <strong>12</strong></p>
            </div>
            <div class="mt-6">
              <button class="btn-gradient w-full">Voir plus</button>
            </div>
          </aside>
        </div>
      </section>

      <section v-else-if="activeTab === 'Précision'">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Tirs & Précision</h3>
            <p class="text-sm text-gray-600">Détails sur la précision des tirs, zones, etc.</p>
          </div>
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">7m</h3>
            <p class="text-sm text-gray-600">Statistiques des pénaltys à 7m.</p>
          </div>
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Précision par zone</h3>
            <p class="text-sm text-gray-600">Heatmap & zones.</p>
          </div>
        </div>
      </section>

      <section v-else-if="activeTab === 'Avancés'">
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Analyses avancées</h3>
          <p class="text-sm text-gray-600">Mesures avancées, expected goals, clustering...</p>
        </div>
      </section>

      <section v-else-if="activeTab === 'Heat Map'">
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Heat Map</h3>
          <p class="text-sm text-gray-600">Affichage de la carte de chaleur des tirs / déplacements.</p>
        </div>
      </section>

      <div class="mt-8"></div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const tabs = ['Performance', 'Précision', 'Avancés', 'Heat Map']
const activeTab = ref('Performance')
const players = ref([])
const selectedPlayerIndex = ref(0)
const showDropdown = ref(false)

async function fetchPlayers() {
  const res = await fetch('http://localhost:8080/auth/players')
  players.value = await res.json()
}

function selectPlayer(idx: number) {
  selectedPlayerIndex.value = idx
  showDropdown.value = false
}

onMounted(fetchPlayers)
</script>

<style scoped>
/* Card styles */
.card-large {
  background: #fff;
  border-radius: 18px;
  border: 1px solid #f1f1f4;
  box-shadow: 0 18px 40px -20px rgba(16,24,40,0.12);
  display: flex;
  align-items: flex-start;
}

.card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #f1f1f4;
  box-shadow: 0 10px 30px -18px rgba(16,24,40,0.08);
}

/* Avatar shadow */
.shadow-avatar {
  box-shadow: 0 18px 40px -26px rgba(168,85,247,0.35);
}

/* mini KPI */
.mini-kpi {
  width: 200px;
  background: #fff;
  border: 1px solid #f3f3f6;
  border-radius: 12px;
  padding: 10px 12px;
  box-shadow: 0 8px 26px -20px rgba(16,24,40,0.06);
}

/* tabs */
.tabs .tab {
  padding: 10px 18px;
  border-radius: 9999px;
  font-weight: 600;
  color: #6b7280;
  background: transparent;
  border: none;
}
.tabs .tab.active {
  background: linear-gradient(90deg,#f472b6,#a78bfa);
  color: white;
  box-shadow: 0 6px 20px -12px rgba(167,139,250,0.4);
}

/* button gradient */
.btn-gradient {
  border-radius: 9999px;
  padding: 8px 14px;
  color: #fff;
  font-weight: 600;
  background: linear-gradient(90deg, #F472B6 0%, #A78BFA 100%);
  box-shadow: 0 8px 22px rgba(244,114,182,0.25);
}

/* small typography tweaks */
.text-white\/85 { color: rgba(255,255,255,0.85); }

/* responsive tweaks */
@media (min-width: 1024px) {
  .mini-kpi { width: 220px; }
}
</style>