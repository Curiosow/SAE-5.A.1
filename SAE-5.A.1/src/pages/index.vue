<template>
  <main class="min-h-screen bg-[#F7F7FB]">
    <div class="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 pt-24 pb-16">

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

        <section class="card p-6 sm:p-8">
          <div class="flex items-start gap-4">
            <div class="h-14 w-14 rounded-2xl bg-white p-1 shadow-[0_6px_16px_rgba(168,85,247,0.15)] border border-gray-100 flex items-center justify-center">
              <img :src="getTeamLogo('SAMBRE AVESNOIS HANDBALL')" alt="Logo" class="h-full w-full object-contain" />
            </div>
            <div class="min-w-0">
              <h1 class="text-[20px] sm:text-[22px] font-semibold text-[#5B21B6]">Equipe Avesnois</h1>
              <p class="text-[13px] text-gray-500">Maubeuge, France</p>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-4 gap-3">
            <div class="stat-chip"><span class="text-emerald-600 text-[22px] font-semibold leading-none">{{ summary.wins }}</span><span class="text-[11px] text-gray-500">Victoires</span></div>
            <div class="stat-chip"><span class="text-amber-500 text-[22px] font-semibold leading-none">{{ summary.draws }}</span><span class="text-[11px] text-gray-500">Nuls</span></div>
            <div class="stat-chip"><span class="text-rose-500 text-[22px] font-semibold leading-none">{{ summary.losses }}</span><span class="text-[11px] text-gray-500">Défaites</span></div>
            <div class="stat-chip"><span class="text-gray-900 text-[22px] font-semibold leading-none">{{ summary.points }}</span><span class="text-[11px] text-gray-500">Points</span></div>
          </div>

          <div class="mt-6 flex flex-wrap items-center justify-between">
            <div class="text-[12px]"><div class="text-gray-500">Position</div><div class="font-semibold text-gray-900">#{{ summary.rank }}</div></div>
            <div class="text-[12px] text-gray-500">Série : <span class="text-gray-900 font-medium">{{ summary.form }}</span></div>
          </div>
        </section>

        <aside class="card relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          <div class="relative z-10 flex justify-center pt-6">
            <div class="bg-gray-50 border border-gray-100 rounded-full px-4 py-1 flex items-center gap-2 shadow-sm">
              <div class="h-3 w-3 rounded-full bg-gradient-to-r from-rose-500 to-violet-500"></div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500">Ligue Butagaz Énergie</span>
            </div>
          </div>

          <div class="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-4">
            <div v-if="isLoadingMatches" class="text-sm text-gray-400 animate-pulse">Recherche du match...</div>
            <div v-else-if="displayNextMatch" class="w-full grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <div class="flex flex-col items-center gap-3 text-center group">
                <div class="h-16 w-16 sm:h-20 sm:w-20 relative transition-transform group-hover:scale-110 duration-300">
                  <img :src="displayNextMatch.homeLogo" class="w-full h-full object-contain" />
                </div>
                <span class="text-xs font-bold uppercase leading-tight max-w-[100px] text-gray-800">{{ displayNextMatch.homeName }}</span>
              </div>

              <div class="flex flex-col items-center justify-center w-[100px]">
                <div v-if="displayNextMatch.isTomorrow" class="text-[24px] sm:text-[28px] font-black leading-none tracking-tighter italic text-gray-900">DEMAIN</div>
                <div v-else class="flex flex-col items-center leading-none text-gray-900">
                  <span class="text-[32px] sm:text-[40px] font-black">{{ displayNextMatch.day }}</span>
                  <span class="text-[14px] sm:text-[16px] font-bold uppercase tracking-wide text-gray-500">{{ displayNextMatch.month }}</span>
                </div>
                <div class="mt-2 text-lg font-bold text-rose-600 bg-rose-50 px-3 py-0.5 rounded-lg">{{ displayNextMatch.time }}</div>
              </div>

              <div class="flex flex-col items-center gap-3 text-center group">
                <div class="h-16 w-16 sm:h-20 sm:w-20 relative transition-transform group-hover:scale-110 duration-300">
                  <img :src="displayNextMatch.awayLogo" class="w-full h-full object-contain" />
                </div>
                <span class="text-xs font-bold uppercase leading-tight max-w-[100px] text-gray-800">{{ displayNextMatch.awayName }}</span>
              </div>
            </div>
            <div v-else class="text-center text-gray-400 text-sm">Aucun match programmé.</div>
          </div>

          <div class="relative z-10 p-6 pt-0">
            <button @click="showDetailsModal = true" class="w-full btn-gradient text-xs font-bold uppercase tracking-widest">
              Voir le calendrier complet
            </button>
          </div>
        </aside>
      </div>


      <section class="mt-8 card p-4 sm:p-6">
        <h4 class="text-sm font-semibold text-gray-900 mb-4">Classement</h4>
        <div v-if="!classement.length" class="text-center py-4 text-gray-500">Chargement ou aucune donnée.</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
            <tr class="text-left text-gray-500">
              <th class="py-2 pr-3 w-12">Pos</th>
              <th class="py-2 pr-3">Équipe</th>
              <th class="py-2 pr-3 w-10 text-center">V</th>
              <th class="py-2 pr-3 w-10 text-center">N</th>
              <th class="py-2 pr-3 w-10 text-center">D</th>
              <th class="py-2 pr-3 w-14 text-center">PTS</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="equipe in classement" :key="equipe.id"
                @click="openTeamResults(equipe.competition_engagement_equipe_libelle)"
                class="border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group">
              <td class="py-3 pr-3">
                  <span class="inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold"
                        :class="[equipe.classement_place <= 3 ? 'bg-rose-100 text-rose-700' : 'bg-gray-50 text-gray-600']">
                    {{ equipe.classement_place }}
                  </span>
              </td>
              <td class="py-3 pr-3">
                <div class="flex items-center gap-3">
                  <img :src="getTeamLogo(equipe.competition_engagement_equipe_libelle)" class="h-6 w-6 object-contain" alt="" />
                  <span class="text-gray-800 font-medium truncate max-w-[200px] group-hover:text-rose-600 transition-colors" :title="equipe.competition_engagement_equipe_libelle">
                    {{ equipe.competition_engagement_equipe_libelle }}
                  </span>
                </div>
              </td>
              <td class="py-3 pr-3 text-center">{{ equipe.classement_nbr_match_gagne }}</td>
              <td class="py-3 pr-3 text-center">{{ equipe.classement_nbr_match_nul }}</td>
              <td class="py-3 pr-3 text-center">{{ equipe.classement_nbr_match_perdu }}</td>
              <td class="py-3 pr-3 text-center font-bold text-gray-900">{{ equipe.classement_point_total }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <Teleport to="body">
      <div v-if="showDetailsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showDetailsModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-white z-10">
            <h3 class="text-lg font-bold text-gray-900">Calendrier</h3>
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer select-none group">
                <div class="relative"><input type="checkbox" v-model="onlySambreFilter" class="sr-only peer"><div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div></div>
                <span class="text-sm font-medium text-gray-600 group-hover:text-gray-900">Sambre Avesnois uniquement</span>
              </label>
              <button @click="showDetailsModal = false" class="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">✕</button>
            </div>
          </div>
          <div class="flex-1 overflow-y-auto p-6 bg-[#F7F7FB]">
            <div v-if="isLoadingMatches" class="text-center text-gray-500 py-8">Chargement des matchs...</div>
            <div v-else-if="matchesToDisplay.length === 0" class="text-center py-12 text-gray-400">Aucun match trouvé avec ce filtre.</div>
            <div v-else class="space-y-3">
              <div v-for="match in matchesToDisplay" :key="match.id" class="group relative overflow-hidden bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all duration-300" :class="{ 'ring-1 ring-rose-200': isSambreMatch(match) }">
                <div v-if="isSambreMatch(match)" class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-400 to-violet-500"></div>
                <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div class="flex-1 flex items-center justify-end gap-3 w-full"><span class="text-sm font-medium text-right hidden sm:block" :class="match.competition_engagement_equipe_libelle_1 === TARGET_TEAM ? 'text-rose-700 font-bold' : 'text-gray-700'">{{ match.competition_engagement_equipe_libelle_1 }}</span><span class="text-sm font-bold text-right sm:hidden" :class="match.competition_engagement_equipe_libelle_1 === TARGET_TEAM ? 'text-rose-700' : 'text-gray-700'">{{ match.competition_engagement_equipe_libelle_1.split(' ').slice(0,1).join('') }}</span><img :src="getTeamLogo(match.competition_engagement_equipe_libelle_1)" class="h-10 w-10 object-contain" /></div>
                  <div class="flex flex-col items-center justify-center min-w-[80px] px-2 border-x border-gray-50 mx-2"><span class="text-lg font-bold text-gray-900 leading-none">{{ new Date(match.rencontre_conclusion_info_date_match).getDate() }}</span><span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{{ new Date(match.rencontre_conclusion_info_date_match).toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '') }}</span><span class="text-xs font-bold text-rose-600 mt-1">{{ match.rencontre_conclusion_info_heure_match.slice(0, 5) }}</span></div>
                  <div class="flex-1 flex items-center justify-start gap-3 w-full"><img :src="getTeamLogo(match.competition_engagement_equipe_libelle_2)" class="h-10 w-10 object-contain" /><span class="text-sm font-medium text-left hidden sm:block" :class="match.competition_engagement_equipe_libelle_2 === TARGET_TEAM ? 'text-rose-700 font-bold' : 'text-gray-700'">{{ match.competition_engagement_equipe_libelle_2 }}</span><span class="text-sm font-bold text-left sm:hidden" :class="match.competition_engagement_equipe_libelle_2 === TARGET_TEAM ? 'text-rose-700' : 'text-gray-700'">{{ match.competition_engagement_equipe_libelle_2.split(' ').slice(0,1).join('') }}</span></div>
                </div>
                <div class="mt-2 text-center text-[10px] text-gray-400 uppercase tracking-wide">{{ match.ville_libelle }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showResultsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showResultsModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">

          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
            <div class="flex items-center gap-3">
              <img :src="getTeamLogo(selectedTeamName)" class="h-8 w-8 object-contain" />
              <div>
                <h3 class="text-lg font-bold text-gray-900">Résultats de la saison</h3>
                <p class="text-xs text-gray-500">{{ selectedTeamName }}</p>
              </div>
            </div>
            <button @click="showResultsModal = false" class="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">✕</button>
          </div>

          <div class="flex-1 overflow-y-auto p-6 bg-[#F7F7FB]">
            <div v-if="teamResultsToDisplay.length === 0" class="text-center py-12 text-gray-400">Aucun match joué pour le moment.</div>
            <div v-else class="space-y-3">
              <div v-for="match in teamResultsToDisplay" :key="match.id" class="group bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-2" :class="getMatchResultColor(match, selectedTeamName)">
                <div class="flex flex-col sm:flex-row items-center justify-between gap-4">

                  <div class="flex-1 flex items-center justify-end gap-3 w-full">
                     <span class="text-sm text-right hidden sm:block"
                           :class="match.competition_engagement_equipe_libelle_1 === selectedTeamName ? 'font-black text-gray-900' : 'font-medium text-gray-500'">
                       {{ match.competition_engagement_equipe_libelle_1 }}
                     </span>
                    <span class="text-sm font-bold text-right sm:hidden">{{ match.competition_engagement_equipe_libelle_1.split(' ').slice(0,1).join('') }}</span>
                    <img :src="getTeamLogo(match.competition_engagement_equipe_libelle_1)" class="h-10 w-10 object-contain" />
                  </div>

                  <div class="flex flex-col items-center justify-center min-w-[100px] px-4">
                    <div class="text-2xl font-black text-gray-900 leading-none flex items-center gap-2">
                      <span>{{ match.rencontres_info_equipe1_score }}</span>
                      <span class="text-gray-300 text-lg">-</span>
                      <span>{{ match.rencontres_info_equipe2_score }}</span>
                    </div>
                    <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                      {{ new Date(match.rencontre_conclusion_info_date_match).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) }}
                    </div>
                  </div>

                  <div class="flex-1 flex items-center justify-start gap-3 w-full">
                    <img :src="getTeamLogo(match.competition_engagement_equipe_libelle_2)" class="h-10 w-10 object-contain" />
                    <span class="text-sm text-left hidden sm:block"
                          :class="match.competition_engagement_equipe_libelle_2 === selectedTeamName ? 'font-black text-gray-900' : 'font-medium text-gray-500'">
                       {{ match.competition_engagement_equipe_libelle_2 }}
                     </span>
                    <span class="text-sm font-bold text-left sm:hidden">{{ match.competition_engagement_equipe_libelle_2.split(' ').slice(0,1).join('') }}</span>
                  </div>
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

// --- CONFIG ---
const TARGET_TEAM = "SAMBRE AVESNOIS HANDBALL"
const kpis = { goals: 485, trendGoals: 12.5, shotAccuracy: 68.4, trendShot: 3.2, goalsAgainst: 325, trendAgainst: 2.1, counters: 89, trendCounters: 8.7 }
const topPlayers = [ { id: 1, avatar: 'https://placehold.co/64x64', stat: '45 buts', accuracy: 78.5 }, { id: 2, avatar: 'https://placehold.co/64x64', stat: '8 assistances', accuracy: 0 }, { id: 3, avatar: 'https://placehold.co/64x64', stat: '38 buts', accuracy: 82.3 } ]
const dots = [7, 9, 11, 2, 6, 4, 1]; const bubblePos = [ { left: '18%', top: '18%' }, { left: '46%', top: '12%' }, { left: '74%', top: '18%' }, { left: '22%', top: '58%' }, { left: '50%', top: '48%' }, { left: '78%', top: '58%' }, { left: '50%', top: '78%' } ]
const progressRows = [ { label: 'Possession', value: 64 }, { label: 'Taux de convertion', value: 72 }, { label: 'Tirs à 7m', value: 85 }, { label: 'Défense', value: 58 } ]

// --- TEAMS & LOGOS ---
interface Team { id: string; name: string; logo: string; }
const teams = ref<Team[]>([])
const teamLogoMap = ref<Map<string, string>>(new Map())
async function fetchTeams() {
  try {
    const res = await fetch('http://localhost:8080/teamlogo')
    if(res.ok) {
      const data = await res.json()
      if(data && Array.isArray(data.docs)) {
        teams.value = data.docs
        const map = new Map()
        teams.value.forEach(t => map.set(t.name, t.logo))
        teamLogoMap.value = map
      }
    }
  } catch (e) { console.error("Erreur fetch teams", e) }
}
function getTeamLogo(teamName: string) { return teamLogoMap.value.get(teamName) || 'https://placehold.co/64x64?text=Logo' }

// --- SUMMARY ---
const summary = ref({ wins: 0, draws: 0, losses: 0, points: 0, rank: 0, form: 'V‑V‑N‑V‑V' })
async function fetchTeamSummary() {
  try {
    const res = await fetch('http://localhost:8080/rankingAvesnois')
    if (res.ok) {
      const data = await res.json()
      summary.value = { ...summary.value, wins: data.victoires, draws: data.nuls, losses: data.defaites, points: data.points, rank: data.position }
    }
  } catch (e) { console.error("Erreur fetch résumé", e) }
}

// --- CLASSEMENT ---
const classement = ref<any[]>([])
const isLoadingClassement = ref(true)
async function fetchClassement() {
  isLoadingClassement.value = true
  try {
    const res = await fetch('http://localhost:8080/ranking')
    const data = await res.json()
    if (data?.docs) classement.value = data.docs
  } catch (e) { console.error(e) } finally { isLoadingClassement.value = false }
}

// --- RENCONTRES & CALENDRIER ---
const matches = ref<any[]>([])
const isLoadingMatches = ref(true)
const showDetailsModal = ref(false)
const onlySambreFilter = ref(false)

async function fetchRencontres() {
  isLoadingMatches.value = true
  try {
    const res = await fetch('http://localhost:8080/rencontre')
    const data = await res.json()
    if (data?.docs) matches.value = data.docs
  } catch (e) { console.error(e) } finally { isLoadingMatches.value = false }
}

function getMatchDateTime(m: any): Date { return new Date(`${m.rencontre_conclusion_info_date_match}T${m.rencontre_conclusion_info_heure_match}`) }

const upcomingMatches = computed(() => {
  const now = new Date(); now.setHours(0,0,0,0)
  return matches.value.filter(m => getMatchDateTime(m) >= now).sort((a, b) => getMatchDateTime(a).getTime() - getMatchDateTime(b).getTime())
})
const matchesToDisplay = computed(() => {
  if (onlySambreFilter.value) return upcomingMatches.value.filter(m => isSambreMatch(m))
  return upcomingMatches.value
})
const nextSambreMatch = computed(() => upcomingMatches.value.find(m => isSambreMatch(m)))
const displayNextMatch = computed(() => {
  const m = nextSambreMatch.value; if (!m) return null
  const dateObj = getMatchDateTime(m)
  const now = new Date(); const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1)
  const isTomorrow = dateObj.toDateString() === tomorrow.toDateString()
  const monthStr = dateObj.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase()
  return { homeName: m.competition_engagement_equipe_libelle_1, homeLogo: getTeamLogo(m.competition_engagement_equipe_libelle_1), awayName: m.competition_engagement_equipe_libelle_2, awayLogo: getTeamLogo(m.competition_engagement_equipe_libelle_2), time: m.rencontre_conclusion_info_heure_match.slice(0, 5), isTomorrow: isTomorrow, day: dateObj.getDate(), month: monthStr }
})
function isSambreMatch(m: any) { return m.competition_engagement_equipe_libelle_1 === TARGET_TEAM || m.competition_engagement_equipe_libelle_2 === TARGET_TEAM }

// --- HISTORIQUE (MODALE RÉSULTATS) ---
const showResultsModal = ref(false)
const selectedTeamName = ref('')

function openTeamResults(teamName: string) {
  selectedTeamName.value = teamName
  showResultsModal.value = true
}

const teamResultsToDisplay = computed(() => {
  const now = new Date()
  if (!selectedTeamName.value) return []
  return matches.value
      .filter(m => {
        const isTeamMatch = m.competition_engagement_equipe_libelle_1 === selectedTeamName.value || m.competition_engagement_equipe_libelle_2 === selectedTeamName.value
        const isPast = getMatchDateTime(m) < now
        const hasScore = m.rencontres_info_equipe1_score !== null && m.rencontres_info_equipe2_score !== null
        return isTeamMatch && isPast && hasScore
      })
      .sort((a, b) => getMatchDateTime(b).getTime() - getMatchDateTime(a).getTime()) // Récent en premier
})

function getMatchResultColor(match: any, team: string) {
  const isHome = match.competition_engagement_equipe_libelle_1 === team
  const scoreUs = isHome ? match.rencontres_info_equipe1_score : match.rencontres_info_equipe2_score
  const scoreThem = isHome ? match.rencontres_info_equipe2_score : match.rencontres_info_equipe1_score

  if (scoreUs > scoreThem) return 'border-emerald-200 bg-emerald-50/30'
  if (scoreUs === scoreThem) return 'border-amber-200 bg-amber-50/30'
  return 'border-rose-200 bg-rose-50/30'
}

onMounted(() => {
  fetchTeams(); fetchTeamSummary(); fetchClassement(); fetchRencontres();
})
</script>

<style scoped>
.card{ background: #fff; border: 1px solid #F1F1F4; border-radius: 18px; box-shadow: 0 16px 36px -14px rgba(16,24,40,0.10); }
.btn-gradient{ border-radius: 9999px; padding: 8px 14px; color: #fff; font-weight: 600; background: linear-gradient(90deg, #F472B6 0%, #A78BFA 100%); box-shadow: 0 8px 22px rgba(244,114,182,0.25); }
.section-title{ color:#6B21A8; font-weight:600; font-size: 15px; position:relative; padding-bottom:.35rem; }
.section-title::after{ content:""; position:absolute; left:0; bottom:0; width:210px; height:3px; border-radius:6px; background: linear-gradient(90deg,#60A5FA 0%,#A78BFA 50%,#F472B6 100%); opacity:.75; }
.stat-chip{ background:#FAFAFB; border:1px solid #F1F1F4; border-radius:14px; padding:10px 12px; display:flex; flex-direction:column; gap:4px; box-shadow: 0 6px 16px -10px rgba(16,24,40,0.10); }
.kpi-card{ background:#fff; border:1px solid #F1F1F4; border-radius:16px; padding:18px 16px; box-shadow: 0 10px 26px -16px rgba(16,24,40,0.12); }
.kpi-head{ display:flex; align-items:center; justify-content:space-between; font-size:13px; color:#6B7280; }
.kpi-value{ margin-top:6px; font-size:28px; font-weight:700; color:#111827; line-height:1; }
.kpi-trend{ margin-top:4px; font-size:12px; font-weight:600; }
.kpi-trend.up{ color:#10B981; }
.kpi-trend.down{ color:#EF4444; }
</style>