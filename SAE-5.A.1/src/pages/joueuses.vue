<template>
  <main class="min-h-screen bg-[#f7f7fb] pt-16">
      <div class="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 pt-6 pb-12">


        <!-- Large header card -->
        <header class="relative card-large p-6 sm:p-8 mb-6">
          <div class="grid grid-cols-[140px_1fr] gap--1 items-start">
            <!-- Avatar column -->
            <div class="relative">
              <div class="h-28 w-28 rounded-full shadow-xl shadow-avatar bg-gradient-to-br from-rose-400 to-violet-500 grid place-items-center text-3xl font-bold text-white overflow-hidden -translate-y-2">
                <img
                  v-if="selectedPlayer?.picture"
                  :src="selectedPlayer.picture"
                  alt="Photo de la joueuse"
                  class="h-28 w-28 rounded-full object-cover scale-125 transition-transform"
                  style="object-position: top center;"
                />
                <span v-else>
                  {{ selectedPlayer?.first_name?.charAt(0) ?? '' }}{{ selectedPlayer?.last_name?.charAt(0) ?? '' }}
                </span>
              </div>
              <div class="absolute -right--1 -bottom-1 h-7 w-7 rounded-full bg-white border border-gray-100 flex items-center justify-center text-sm font-semibold shadow-sm">
                {{ selectedPlayer?.jersey_number ?? '-' }}
              </div>
            </div>

            <!-- Content column -->
            <div class="flex flex-col gap-4">
              <div class="relative">
                <h1
                  class="text-2xl sm:text-3xl font-extrabold text-[#6B21A8] leading-tight cursor-pointer"
                  @click="showDropdown = !showDropdown"
                >
                  {{ selectedPlayer?.last_name ?? '' }} {{ selectedPlayer?.first_name ?? '' }}
                  <svg class="inline w-4 h-4 ml-2" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4" stroke="#6B21A8" stroke-width="2" fill="none"/></svg>
                </h1>

                <div v-if="showDropdown" class="absolute z-10 mt-2 bg-white border border-gray-200 rounded shadow-lg w-64">
                  <ul>
                    <li
                      v-for="(p, idx) in players"
                      :key="p.id ?? p.uuid"
                      @click="selectPlayer(idx)"
                      class="px-4 py-2 hover:bg-violet-100 cursor-pointer"
                    >
                      {{ p.last_name }} {{ p.first_name }}
                    </li>
                  </ul>
                </div>
              </div>

              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs bg-white border border-gray-100 px-2 py-1 rounded-full text-gray-600 flex items-center gap-2">Pivot</span>
                <span class="text-xs bg-white border border-gray-100 px-2 py-1 rounded-full text-gray-600 flex items-center gap-2">{{ selectedPlayer?.team_name ?? '—' }}</span>
                <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
              </div>

              <!-- KPI -->
              <div class="mt-2">
                <div class="hidden md:flex gap-4">
                  <div class="mini-kpi">
                    <div class="text-sm text-gray-500">Buts</div>
                    <div class="text-2xl font-semibold text-gray-900">{{ selectedPlayer?.stats?.total_buts ?? 0 }}</div>
                    <div class="w-full mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div class="h-full rounded-full bg-gradient-to-r from-rose-400 to-violet-500" :style="{ width: pct(selectedPlayer?.stats?.efficacite_tir_pct) }"></div>
                    </div>
                  </div>

                  <div class="mini-kpi">
                    <div class="text-sm text-gray-500">Assistances</div>
                    <div class="text-2xl font-semibold text-gray-900">{{ selectedPlayer?.stats?.total_passes_decisives ?? 0 }}</div>
                    <div class="w-full mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div class="h-full rounded-full bg-gradient-to-r from-rose-400 to-violet-500" :style="{ width: pct(selectedPlayer?.stats?.ratio_passeur) }"></div>
                    </div>
                  </div>

                  <div class="mini-kpi">
                    <div class="text-sm text-gray-500">Contres</div>
                    <div class="text-2xl font-semibold text-gray-900">{{ selectedPlayer?.stats?.tirs_arretes ?? 0 }}</div>
                    <div class="w-full mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div class="h-full rounded-full bg-gradient-to-r from-rose-400 to-violet-500" :style="{ width: pct(selectedPlayer?.stats?.efficacite_7m_pct) }"></div>
                    </div>
                  </div>

                  <div class="mini-kpi">
                    <div class="text-sm text-gray-500">Ballons perdus</div>
                    <div class="text-2xl font-semibold text-gray-900">{{ selectedPlayer?.stats?.total_balles_perdues ?? 0 }}</div>
                    <div class="w-full mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div class="h-full rounded-full bg-gradient-to-r from-rose-400 to-violet-500" :style="{ width: pct(selectedPlayer?.stats?.total_balles_perdues) }"></div>
                    </div>
                  </div>
                </div>

                <!-- Mobile -->
                <div class="grid grid-cols-2 gap-4 md:hidden">
                  <div class="mini-kpi">
                    <div class="text-sm text-gray-500">Buts</div>
                    <div class="text-xl font-semibold text-gray-900">{{ selectedPlayer?.stats?.total_buts ?? 0 }}</div>
                  </div>
                  <div class="mini-kpi">
                    <div class="text-sm text-gray-500">Assistances</div>
                    <div class="text-xl font-semibold text-gray-900">{{ selectedPlayer?.stats?.total_passes_decisives ?? 0 }}</div>
                  </div>
                  <div class="mini-kpi">
                    <div class="text-sm text-gray-500">Arrêts</div>
                    <div class="text-xl font-semibold text-gray-900">{{ selectedPlayer?.stats?.tirs_arretes ?? 0 }}</div>
                  </div>
                  <div class="mini-kpi">
                    <div class="text-sm text-gray-500">Ballons perdus</div>
                    <div class="text-xl font-semibold text-gray-900">{{ selectedPlayer?.stats?.total_balles_perdues ?? 0 }}</div>
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

        <!-- Content -->
        <section v-if="activeTab === 'Stats'">
          <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            <div class="space-y-6">
              <div class="card p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistiques positives</h3>
                <ul class="space-y-3 text-sm text-gray-700">
                  <li class="flex justify-between"><span>Buts totaux</span><strong>{{ selectedPlayer?.stats?.total_buts ?? 0 }}</strong></li>
                  <li class="flex justify-between"><span>Assistances</span><strong>{{ selectedPlayer?.stats?.total_passes_decisives ?? 0 }}</strong></li>
                  <li class="flex justify-between"><span>Ratio buts/tirs</span><strong>{{ selectedPlayer?.stats?.buts_sur_tirs_ratio_brut ?? '0 / 0' }}</strong></li>
                  <li class="flex justify-between"><span>Tirs ratés</span><strong>{{ selectedPlayer?.stats?.tirs_rates ?? 0 }}</strong></li>
                </ul>
              </div>

              <div class="card p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistiques négatives</h3>
                <ul class="space-y-3 text-sm text-gray-700">
                  <li class="flex justify-between"><span>Tirs ratés</span><strong>{{ selectedPlayer?.stats?.tirs_arretes ?? 0 }}</strong></li>
                  <li class="flex justify-between"><span>Actions défensives positives</span><strong>{{ selectedPlayer?.stats?.total_actions_def_positives ?? 0 }}</strong></li>
                  <li class="flex justify-between"><span>Sanctions 2min</span><strong>{{ selectedPlayer?.stats?.def_sanctions_2min ?? 0 }}</strong></li>
                </ul>
              </div>

              <div class="card p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Discipline</h3>
                <ul class="space-y-3 text-sm text-gray-700">
                  <li class="flex justify-between"><span>Fautes défensives</span><strong>{{ selectedPlayer?.stats?.def_fautes ?? 0 }}</strong></li>
                  <li class="flex justify-between"><span>Duels gagnés</span><strong>{{ selectedPlayer?.stats?.def_duels_gagnes ?? 0 }}</strong></li>
                  <li class="flex justify-between"><span>Duels perdus</span><strong>{{ selectedPlayer?.stats?.def_duels_perdus ?? 0 }}</strong></li>
                </ul>
              </div>
            </div>

            <aside class="card p-6">
              <h4 class="text-sm font-semibold text-gray-900">Résumé</h4>
              <div class="mt-4 text-sm text-gray-600">
                <p>Buts : <strong>{{ selectedPlayer?.stats?.total_buts ?? 0 }}</strong></p>
                <p>Assistances : <strong>{{ selectedPlayer?.stats?.total_passes_decisives ?? 0 }}</strong></p>
                <p>Arrêts : <strong>{{ selectedPlayer?.stats?.tirs_arretes ?? 0 }}</strong></p>
              </div>
              <div class="mt-6">
                <button class="btn-gradient w-full">Voir plus</button>
              </div>
            </aside>
          </div>
        </section>



        <section v-else-if="activeTab === 'Graphiques'">
          <img src="/src/pages/Capture d’écran 2025-11-03 à 00.11.30.png" alt="Capture" class="w-full max-w-sm mx-auto" />

          <!-- 2) Image en background CSS (responsive, sans JS) -->
          <div class="screenshot-bg w-full max-w-2xl mx-auto" role="img" aria-label="Capture"></div>

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

      </div>
    </main>
  </template>

  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'

  interface Stats {
    def_duels_gagnes?: number
    total_buts?: number
    buts_sur_tirs_ratio_brut?: string
    total_actions_def_negatives?: number
    def_duels_perdus?: number
    def_recuperations?: number
    efficacite_aile_pct?: number
    total_balles_perdues?: number
    total_actions_def_positives?: number
    def_contres?: number
    def_sanctions_2min?: number
    efficacite_9m_pct?: number
    efficacite_6m_pct?: number
    ratio_passeur?: number
    total_passes_decisives?: number
    tirs_rates?: number
    def_fautes?: number
    efficacite_tir_pct?: number
    tirs_arretes?: number
    efficacite_7m_pct?: number
    [k: string]: any
  }

  interface Player {
    id?: number
    uuid?: string
    first_name?: string
    last_name?: string
    picture?: string
    jersey_number?: number
    team_name?: string
    stats?: Stats | null
  }

  const tabs = ['Stats', 'Graphiques', 'Heat Map']
  const activeTab = ref<string>('Stats')

  const players = ref<Player[]>([])
  const selectedPlayerIndex = ref<number>(-1)
  const showDropdown = ref<boolean>(false)

  const selectedPlayer = computed<Player | null>(() => {
    if (selectedPlayerIndex.value < 0) return null
    return players.value[selectedPlayerIndex.value] ?? null
  })

  function pct(v?: number | null): string {
    if (v == null || Number.isNaN(Number(v))) return '0%'
    const n = Math.max(0, Math.min(100, Math.round(Number(v))))
    return `${n}%`
  }

  async function loadPlayerStats(uuid?: string): Promise<Stats | null> {
    if (!uuid) return null
    try {
      const statsUrl = `http://localhost:8080/handball/players/${encodeURIComponent(uuid)}/stats`
      const res = await fetch(statsUrl)
      if (!res.ok) return null
      const data = await res.json()
      return data as Stats
    } catch {
      return null
    }
  }

  async function fetchPlayers() {
    try {
      const res = await fetch('http://localhost:8080/auth/players')
      if (!res.ok) { players.value = []; selectedPlayerIndex.value = -1; return }
      const data = await res.json()
      if (!Array.isArray(data)) { players.value = []; selectedPlayerIndex.value = -1; return }
      players.value = data as Player[]

      // charger les stats en parallèle et attacher
      await Promise.all(players.value.map(async (p, idx) => {
        const id = p.id ?? p.uuid
        if (!id) return
        const stats = await loadPlayerStats(String(id))
        if (stats) players.value[idx] = { ...players.value[idx], stats }
      }))

      selectedPlayerIndex.value = players.value.length > 0 ? 0 : -1
    } catch {
      players.value = []
      selectedPlayerIndex.value = -1
    }
  }

  async function selectPlayer(idx: number) {
    if (idx < 0 || idx >= players.value.length) return
    selectedPlayerIndex.value = idx
    showDropdown.value = false
    const p = players.value[idx]
    if (!p?.stats) {
      const id = p?.id ?? p?.uuid
      if (id) {
        const stats = await loadPlayerStats(String(id))
        if (stats) players.value[idx] = { ...players.value[idx], stats }
      }
    }
  }

  onMounted(fetchPlayers)
  </script>

  <style scoped>
  .card-large { background: #fff; border-radius: 18px; border: 1px solid #f1f1f4; box-shadow: 0 18px 40px -20px rgba(16,24,40,0.12); display: flex; align-items: flex-start; }
  .card { background: #fff; border-radius: 14px; border: 1px solid #f1f1f4; box-shadow: 0 10px 30px -18px rgba(16,24,40,0.08); }
  .shadow-avatar { box-shadow: 0 18px 40px -26px rgba(168,85,247,0.35); }
  .mini-kpi { width: 200px; background: #fff; border: 1px solid #f3f3f6; border-radius: 12px; padding: 10px 12px; box-shadow: 0 8px 26px -20px rgba(16,24,40,0.06); }
  .tabs .tab { padding: 10px 18px; border-radius: 9999px; font-weight: 600; color: #6b7280; background: transparent; border: none; }
  .tabs .tab.active { background: linear-gradient(90deg,#f472b6,#a78bfa); color: white; box-shadow: 0 6px 20px -12px rgba(167,139,250,0.4); }
  .btn-gradient { border-radius: 9999px; padding: 8px 14px; color: #fff; font-weight: 600; background: linear-gradient(90deg, #F472B6 0%, #A78BFA 100%); box-shadow: 0 8px 22px rgba(244,114,182,0.25); }
  @media (min-width: 1024px) { .mini-kpi { width: 220px; } }
  .screenshot-bg {
    height: 800px;
    background-image: url('/images/Capture-d-ecran-2025-11-03-a-00.11.30.png');
    background-size: cover;
    background-position: center;
    border-radius: 8px;
  }
  </style>