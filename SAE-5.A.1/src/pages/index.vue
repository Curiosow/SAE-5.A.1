<template>
  <main class="min-h-screen bg-[#F7F7FB]">
    <div class="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 pt-24 pb-16">

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <section class="card p-6 sm:p-8">
          <div class="flex items-start gap-4">
            <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-rose-400 to-violet-500 text-white grid place-items-center text-xl font-semibold shadow-[0_6px_16px_rgba(168,85,247,0.35)]">
              A
            </div>
            <div class="min-w-0">
              <h1 class="text-[20px] sm:text-[22px] font-semibold text-[#5B21B6]">Equipe Avesnois</h1>
              <p class="text-[13px] text-gray-500">Maubeuge, France</p>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-4 gap-3">
            <div class="stat-chip">
              <span class="text-emerald-600 text-[22px] font-semibold leading-none">{{ summary.wins }}</span>
              <span class="text-[11px] text-gray-500">Victoires</span>
            </div>
            <div class="stat-chip">
              <span class="text-amber-500 text-[22px] font-semibold leading-none">{{ summary.draws }}</span>
              <span class="text-[11px] text-gray-500">Égalités / Nulles</span>
            </div>
            <div class="stat-chip">
              <span class="text-rose-500 text-[22px] font-semibold leading-none">{{ summary.losses }}</span>
              <span class="text-[11px] text-gray-500">Défaites</span>
            </div>
            <div class="stat-chip">
              <span class="text-gray-900 text-[22px] font-semibold leading-none">{{ summary.points }}</span>
              <span class="text-[11px] text-gray-500">Points</span>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap items-center justify-between">
            <div class="text-[12px]">
              <div class="text-gray-500">Position dans la ligue</div>
              <div class="font-semibold text-gray-900">#{{ summary.rank }}</div>
            </div>
            <div class="text-[12px] text-gray-500">
              Série : <span class="text-gray-900 font-medium">{{ summary.form }}</span>
            </div>
          </div>
        </section>

        <aside class="card p-6">
          <h2 class="font-semibold text-gray-900">Prochain match</h2>

          <div v-if="isLoadingMatches" class="mt-4 text-sm text-gray-500">Chargement...</div>

          <div v-else-if="displayNextMatch" class="mt-4 flex items-center gap-3">
            <div class="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
              VS
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate" :title="displayNextMatch.opponent">
                {{ displayNextMatch.opponent }}
              </p>
              <p class="text-xs text-gray-500 capitalize">
                {{ displayNextMatch.date }} — {{ displayNextMatch.venue }}
              </p>
            </div>
          </div>

          <p v-else-if="!isLoadingMatches" class="mt-4 text-sm text-gray-500">
            Aucun match à venir cette saison.
          </p>

          <button @click="showDetailsModal = true" class="mt-6 w-full btn-gradient">
            Détails du calendrier
          </button>
        </aside>
      </div>

      <h3 class="mt-10 section-title">Performance d’équipe</h3>

      <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="kpi-card">
          <div class="kpi-head">
            <span>Buts marqués</span>
            <svg class="h-4 w-4 text-gray-300" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12 8.5h.01M11 11h2v5h-2z" fill="currentColor"/>
            </svg>
          </div>
          <div class="kpi-value">{{ kpis.goals }}</div>
          <div class="kpi-trend up">+{{ kpis.trendGoals }}%</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-head">
            <span>Précision de tir</span>
            <svg class="h-4 w-4 text-gray-300" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12 8.5h.01M11 11h2v5h-2z" fill="currentColor"/>
            </svg>
          </div>
          <div class="kpi-value text-rose-600">{{ kpis.shotAccuracy }}%</div>
          <div class="kpi-trend down">-{{ kpis.trendShot }}%</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-head">
            <span>Buts concédés</span>
            <svg class="h-4 w-4 text-gray-300" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12 8.5h.01M11 11h2v5h-2z" fill="currentColor"/>
            </svg>
          </div>
          <div class="kpi-value">{{ kpis.goalsAgainst }}</div>
          <div class="kpi-trend down">-{{ kpis.trendAgainst }}%</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-head">
            <span>Contre‑attaques</span>
            <svg class="h-4 w-4 text-gray-300" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12 8.5h.01M11 11h2v5h-2z" fill="currentColor"/>
            </svg>
          </div>
          <div class="kpi-value">{{ kpis.counters }}</div>
          <div class="kpi-trend up">+{{ kpis.trendCounters }}%</div>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <section class="card p-6 sm:p-8 h-[260px]">
          <h4 class="text-sm font-semibold text-gray-900">Performance de la saison</h4>
          <div class="mt-4 h-[180px] grid place-items-center text-gray-400 text-sm">
            Aucune statistique
          </div>
        </section>

        <aside class="card p-6">
          <h4 class="text-sm font-semibold text-gray-900">Meilleures joueuses</h4>
          <ul class="mt-4 space-y-3">
            <li v-for="(p, i) in topPlayers" :key="p.id" class="flex items-center justify-between">
              <div class="flex items-center gap-3 min-w-0">
                <img :src="p.avatar" alt="" class="h-9 w-9 rounded-full object-cover"/>
                <div class="min-w-0">
                  <p class="truncate text-sm font-medium text-gray-900">Joueuse {{ i + 1 }}</p>
                  <p class="text-xs text-gray-500">{{ p.stat }}</p>
                </div>
              </div>
              <span class="text-rose-600 text-sm font-semibold">{{ p.accuracy }}%</span>
            </li>
          </ul>
        </aside>
      </div>

      <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section class="card p-6 sm:p-8">
          <h4 class="text-sm font-semibold text-gray-900">Formation d’équipe</h4>
          <div class="mt-6 relative h-[240px]">
            <div
                v-for="(p, idx) in bubblePos"
                :key="idx"
                class="absolute h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-rose-400 to-violet-500 shadow-[0_8px_18px_rgba(168,85,247,0.28)] grid place-items-center text-white text-sm font-medium"
                :style="p"
            >
              {{ dots[idx] }}
            </div>
            <div class="absolute bottom-0 left-0 text-[11px] text-gray-500 flex items-center gap-4">
              <span class="inline-flex items-center gap-1">
                <span class="inline-block h-2 w-2 rounded-full bg-rose-500"></span> Joueuses de champ
              </span>
              <span class="inline-flex items-center gap-1">
                <span class="inline-block h-2 w-2 rounded-full bg-violet-500"></span> Gardienne
              </span>
            </div>
          </div>
        </section>

        <section class="card p-6 sm:p-8">
          <h4 class="text-sm font-semibold text-gray-900">Statistiques de match</h4>
          <div class="mt-6 space-y-4">
            <div v-for="row in progressRows" :key="row.label" class="space-y-1">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-700">{{ row.label }}</span>
                <span class="font-medium text-gray-900">{{ row.value }}%</span>
              </div>
              <div class="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                    class="h-full rounded-full bg-gradient-to-r from-rose-400 to-violet-500"
                    :style="{ width: row.value + '%' }"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section class="mt-8 card p-4 sm:p-6">
        <h4 class="text-sm font-semibold text-gray-900 mb-4">Classement de la ligue Butaz</h4>

        <div v-if="isLoadingClassement" class="text-center py-4 text-gray-500">
          Chargement du classement...
        </div>

        <div v-else-if="errorClassement" class="text-center py-4 text-red-500">
          Erreur: {{ errorClassement.message }}
        </div>

        <div v-else-if="!classement.length" class="text-center py-4 text-gray-500">
          Aucune donnée de classement disponible.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
            <tr class="text-left text-gray-500">
              <th class="py-2 pr-3 w-16">Pos.</th>
              <th class="py-2 pr-3">Équipe</th>
              <th class="py-2 pr-3 w-12 text-center">V</th>
              <th class="py-2 pr-3 w-12 text-center">N</th>
              <th class="py-2 pr-3 w-12 text-center">D</th>
              <th class="py-2 pr-3 w-16 text-center">PTS</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="equipe in classement" :key="equipe.id" class="border-t border-gray-100">
              <td class="py-3 pr-3">
                  <span
                      class="inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold"
                      :class="[
                      equipe.classement_place === 1 ? 'bg-amber-100 text-amber-700' :
                      equipe.classement_place === 2 ? 'bg-gray-100 text-gray-700'  :
                      equipe.classement_place === 3 ? 'bg-rose-100 text-rose-700'  : 'bg-gray-50 text-gray-600'
                    ]"
                  >{{ equipe.classement_place }}</span>
              </td>
              <td class="py-3 pr-3">
                <span class="text-gray-800 font-medium">{{ equipe.competition_engagement_equipe_libelle }}</span>
              </td>
              <td class="py-3 pr-3 text-center">{{ equipe.classement_nbr_match_gagne }}</td>
              <td class="py-3 pr-3 text-center">{{ equipe.classement_nbr_match_nul }}</td>
              <td class="py-3 pr-3 text-center">{{ equipe.classement_nbr_match_perdu }}</td>
              <td class="py-3 pr-3 text-center font-semibold text-gray-900">{{ equipe.classement_point_total }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>

    <Teleport to="body">
      <div v-if="showDetailsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showDetailsModal = false"></div>

        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Prochains matchs de la ligue</h3>
            <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <div v-if="isLoadingMatches" class="text-center text-gray-500 py-8">
              Chargement des matchs...
            </div>
            <div v-else class="space-y-4">
              <div
                  v-for="match in upcomingMatches"
                  :key="match.id"
                  class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50"
                  :class="{ 'border-rose-200 bg-rose-50': match.competition_engagement_equipe_libelle_1 === TARGET_TEAM || match.competition_engagement_equipe_libelle_2 === TARGET_TEAM }"
              >
                <div class="min-w-[140px] text-sm">
                  <div class="font-medium text-gray-900 capitalize">
                    {{ new Date(match.rencontre_conclusion_info_date_match).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' }) }}
                  </div>
                  <div class="text-gray-500">
                    {{ match.rencontre_conclusion_info_heure_match.slice(0, 5) }}
                  </div>
                </div>

                <div class="flex-1 text-sm">
                  <div class="font-medium" :class="match.competition_engagement_equipe_libelle_1 === TARGET_TEAM ? 'text-rose-700' : 'text-gray-900'">
                    {{ match.competition_engagement_equipe_libelle_1 }}
                  </div>
                  <div class="text-xs text-gray-500 my-1">VS</div>
                  <div class="font-medium" :class="match.competition_engagement_equipe_libelle_2 === TARGET_TEAM ? 'text-rose-700' : 'text-gray-900'">
                    {{ match.competition_engagement_equipe_libelle_2 }}
                  </div>
                </div>

                <div class="text-xs text-gray-500 sm:text-right max-w-[150px]">
                  {{ match.equipement_nom_salle }}<br>
                  {{ match.ville_libelle }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// --- DONNÉES STATIQUES (Mocks) ---
const summary = { wins: 12, draws: 3, losses: 1, points: 39, rank: 1, form: 'V‑V‑N‑V‑V' }
const kpis = { goals: 485, trendGoals: 12.5, shotAccuracy: 68.4, trendShot: 3.2, goalsAgainst: 325, trendAgainst: 2.1, counters: 89, trendCounters: 8.7 }
const topPlayers = [
  { id: 1, avatar: 'https://placehold.co/64x64', stat: '45 buts', accuracy: 78.5 },
  { id: 2, avatar: 'https://placehold.co/64x64', stat: '8 assistances', accuracy: 0 },
  { id: 3, avatar: 'https://placehold.co/64x64', stat: '38 buts', accuracy: 82.3 },
]
const dots = [7, 9, 11, 2, 6, 4, 1]
const bubblePos = [
  { left: '18%', top: '18%' }, { left: '46%', top: '12%' }, { left: '74%', top: '18%' },
  { left: '22%', top: '58%' }, { left: '50%', top: '48%' }, { left: '78%', top: '58%' }, { left: '50%', top: '78%' },
]
const progressRows = [
  { label: 'Possession', value: 64 }, { label: 'Taux de convertion des tirs', value: 72 },
  { label: 'Tirs à 7m', value: 85 }, { label: 'Taux d’actions défensives', value: 58 },
]

// =========================================
// === LOGIQUE CLASSEMENT (Ranking) ===
// =========================================
interface EquipeClassement {
  id: number;
  poule_competition_id: number;
  competition_engagement_equipe_libelle: string;
  structure_id: number;
  classement_place: number;
  classement_point_total: number;
  classement_nbr_match_joue: number;
  classement_nbr_match_gagne: number;
  classement_nbr_match_nul: number;
  classement_nbr_match_perdu: number;
}

const classement = ref<EquipeClassement[]>([])
const isLoadingClassement = ref(true)
const errorClassement = ref<Error | null>(null)
const API_ENDPOINT_RANKING = 'http://localhost:8080/ranking'

async function fetchClassement() {
  isLoadingClassement.value = true
  errorClassement.value = null
  try {
    const response = await fetch(API_ENDPOINT_RANKING)
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    const data = await response.json()
    if (data && Array.isArray(data.docs)) {
      classement.value = data.docs
    } else {
      classement.value = []
    }
  } catch (err) {
    console.error('Erreur fetch classement:', err)
    errorClassement.value = err as Error
  } finally {
    isLoadingClassement.value = false
  }
}

// =========================================
// === LOGIQUE RENCONTRES (Next Match) ===
// =========================================
const TARGET_TEAM = "SAMBRE AVESNOIS HANDBALL"

interface Rencontre {
  id: number;
  rencontre_conclusion_info_date_match: string; // YYYY-MM-DD
  rencontre_conclusion_info_heure_match: string; // HH:MM:SS
  competition_engagement_equipe_libelle_1: string;
  competition_engagement_equipe_libelle_2: string;
  equipement_nom_salle: string;
  ville_libelle: string;
}

const matches = ref<Rencontre[]>([])
const isLoadingMatches = ref(false)
const showDetailsModal = ref(false)
// Assurez-vous que le backend Java autorise CORS pour cette URL aussi !
const API_ENDPOINT_RENCONTRE = 'http://localhost:8080/rencontre'

async function fetchRencontres() {
  isLoadingMatches.value = true
  try {
    const res = await fetch(API_ENDPOINT_RENCONTRE)
    if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`)
    const data = await res.json()
    if (data && Array.isArray(data.docs)) {
      matches.value = data.docs
    }
  } catch (e) {
    console.error("Erreur fetch rencontres", e)
  } finally {
    isLoadingMatches.value = false
  }
}

function getMatchDateTime(m: Rencontre): Date {
  return new Date(`${m.rencontre_conclusion_info_date_match}T${m.rencontre_conclusion_info_heure_match}`)
}

const upcomingMatches = computed(() => {
  const now = new Date()
  // On peut ajuster 'now' à hier pour inclure les matchs du jour même s'ils sont passés de peu
  now.setHours(0, 0, 0, 0)
  return matches.value
      .filter(m => getMatchDateTime(m) >= now)
      .sort((a, b) => getMatchDateTime(a).getTime() - getMatchDateTime(b).getTime())
})

const nextSambreMatch = computed(() => {
  return upcomingMatches.value.find(m =>
      m.competition_engagement_equipe_libelle_1 === TARGET_TEAM ||
      m.competition_engagement_equipe_libelle_2 === TARGET_TEAM
  )
})

const displayNextMatch = computed(() => {
  const m = nextSambreMatch.value
  if (!m) return null
  const isHome = m.competition_engagement_equipe_libelle_1 === TARGET_TEAM
  const opponent = isHome ? m.competition_engagement_equipe_libelle_2 : m.competition_engagement_equipe_libelle_1
  const venue = isHome ? 'Domicile' : `Extérieur (${m.ville_libelle})`
  const dateObj = getMatchDateTime(m)
  // Formatage : "Sam. 28 sept • 20:30"
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  }).format(dateObj).replace(',', ' •')

  return { opponent, date: formattedDate, venue }
})

// --- LIFECYCLE ---
onMounted(() => {
  fetchClassement()
  fetchRencontres()
})
</script>

<style scoped>
/* ---- primitives visuelles proches du screen ---- */
.card{
  background: #fff;
  border: 1px solid #F1F1F4;
  border-radius: 18px;
  box-shadow: 0 16px 36px -14px rgba(16,24,40,0.10);
}

/* bouton dégradé */
.btn-gradient{
  border-radius: 9999px;
  padding: 8px 14px;
  color: #fff;
  font-weight: 600;
  background: linear-gradient(90deg, #F472B6 0%, #A78BFA 100%);
  box-shadow: 0 8px 22px rgba(244,114,182,0.25);
}

/* titre de section avec léger soulignement (proche du screen) */
.section-title{
  color:#6B21A8; /* violet profond */
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

/* chips du header */
.stat-chip{
  background:#FAFAFB;
  border:1px solid #F1F1F4;
  border-radius:14px;
  padding:10px 12px;
  display:flex; flex-direction:column; gap:4px;
  box-shadow: 0 6px 16px -10px rgba(16,24,40,0.10);
}

/* KPI */
.kpi-card{
  background:#fff;
  border:1px solid #F1F1F4;
  border-radius:16px;
  padding:18px 16px;
  box-shadow: 0 10px 26px -16px rgba(16,24,40,0.12);
}
.kpi-head{ display:flex; align-items:center; justify-content:space-between; font-size:13px; color:#6B7280; }
.kpi-value{ margin-top:6px; font-size:28px; font-weight:700; color:#111827; line-height:1; }
.kpi-trend{ margin-top:4px; font-size:12px; font-weight:600; }
.kpi-trend.up{ color:#10B981; }
.kpi-trend.down{ color:#EF4444; }
</style>