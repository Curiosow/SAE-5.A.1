<template>
  <main class="min-h-screen bg-[#F7F7FB] text-slate-800 font-sans">
    <div class="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-50/60 to-transparent -z-10 pointer-events-none"></div>

    <div class="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 pt-32 pb-24 mt-12">

      <header class="flex flex-col items-center text-center mb-12 animate-fade-in-down">
        <h1 class="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight mb-8 drop-shadow-sm cursor-pointer" @click="goHome">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Sambre</span> Analytics
        </h1>

        <nav v-if="selectedTeam || selectedMatchId" class="flex items-center gap-2 text-sm font-bold text-slate-500 mb-8 bg-white px-6 py-2 rounded-full shadow-sm">
          <button @click="goHome" class="hover:text-indigo-600 transition-colors">Accueil</button>
          <span v-if="selectedTeam">/</span>
          <button v-if="selectedTeam" @click="selectedMatchId = null" class="hover:text-indigo-600 transition-colors">{{ selectedTeam.nom }}</button>
          <span v-if="selectedMatchId">/ Match</span>
        </nav>

        <div v-if="!selectedTeam && !selectedMatchId" class="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 inline-flex select-none mb-10">
          <button @click="selectionMode = 'clubs'" :class="selectionMode === 'clubs' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'" class="px-8 py-3 text-sm font-bold rounded-xl transition-all">Par Clubs</button>
          <button @click="selectionMode = 'matchs'" :class="selectionMode === 'matchs' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'" class="px-8 py-3 text-sm font-bold rounded-xl transition-all">Par Matchs</button>
        </div>

        <div v-if="!selectedTeam && !selectedMatchId && selectionMode === 'clubs'" class="w-full max-w-6xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          <button v-for="team in teams" :key="team.id" @click="selectTeam(team)" class="flex flex-col items-center justify-center bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <img v-if="team.logo" :src="team.logo" class="w-14 h-14 object-contain mb-4" />
            <span v-else class="text-2xl font-black text-slate-200 mb-4">{{ team.nom.substring(0,1) }}</span>
            <span class="text-sm font-bold text-slate-700 text-center">{{ team.nom }}</span>
          </button>
        </div>

        <div v-if="!selectedTeam && !selectedMatchId && selectionMode === 'matchs'" class="w-full max-w-2xl bg-white rounded-[24px] shadow-sm border border-slate-100 divide-y divide-slate-50 overflow-hidden">
          <div v-for="m in allMatchesWithScores" :key="m.id" @click="selectMatchDirectly(m)" class="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
            <div class="flex flex-col">
              <span class="font-bold text-slate-900">Sambre vs {{ m.adversaire }}</span>
              <span class="text-xs text-slate-400">{{ formatDate(m.dateMatch) }}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-black px-3 py-1 bg-slate-100 rounded-lg">
                {{ m.scoreSambre }} - {{ m.scoreAdversaire }}
              </span>
            </div>
          </div>
        </div>
      </header>

      <Transition name="fade" mode="out-in">
        <div v-if="selectedTeam && !selectedMatchId && teamStats" class="max-w-5xl mx-auto space-y-8 animate-fade-in-up">

          <button @click="goBack" class="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold text-sm mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" /></svg>
            Retour aux équipes
          </button>

          <div class="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-8">
            <div class="w-32 h-32 flex items-center justify-center bg-slate-50 rounded-full border-4 border-white shadow-lg">
              <img v-if="selectedTeam.logo" :src="selectedTeam.logo" class="w-20 h-20 object-contain" />
              <span v-else class="text-4xl font-black text-slate-300">{{ selectedTeam.nom.substring(0,1) }}</span>
            </div>
            <div class="flex-1 text-center md:text-left">
              <div class="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Analyse Globale</div>
              <h2 class="text-3xl font-black text-slate-900 mb-4">{{ selectedTeam.nom }}</h2>
              <div class="flex gap-3 justify-center md:justify-start">
                <span class="px-4 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">{{ teamStats.matchesPlayed }} Matchs analysés</span>
                <span class="px-4 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">{{ teamStats.wins }} Victoires</span>
                <span class="px-4 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold" v-if="teamStats.draws > 0">{{ teamStats.draws }} Nul(s)</span>
                <span class="px-4 py-1 bg-rose-100 text-rose-800 rounded-lg text-xs font-bold">{{ teamStats.losses }} Défaites</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-[24px] text-center border border-slate-100">
              <div class="text-3xl font-black text-indigo-600">{{ teamStats.totalGoals }}</div>
              <div class="text-[10px] text-slate-400 font-bold uppercase mt-2">Buts Totaux</div>
            </div>
            <div class="bg-white p-6 rounded-[24px] text-center border border-slate-100">
              <div class="text-3xl font-black text-slate-800">{{ teamStats.efficiency }}%</div>
              <div class="text-[10px] text-slate-400 font-bold uppercase mt-2">Efficacité Global</div>
            </div>
            <div class="bg-white p-6 rounded-[24px] text-center border border-slate-100">
              <div class="text-3xl font-black text-rose-500">{{ teamStats.avgTurnovers }}</div>
              <div class="text-[10px] text-slate-400 font-bold uppercase mt-2">Pertes / Match</div>
            </div>
            <div class="bg-white p-6 rounded-[24px] text-center border border-slate-100">
              <div class="text-3xl font-black text-blue-500">{{ teamStats.avgAssists }}</div>
              <div class="text-[10px] text-slate-400 font-bold uppercase mt-2">Passes D. / Match</div>
            </div>
          </div>

          <div class="bg-white rounded-[24px] border border-slate-100 overflow-hidden">
            <div class="p-5 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-500 uppercase">
              Historique des rencontres
            </div>
            <div v-for="m in teamStats.history" :key="m.id" @click="selectedMatchId = m.id" class="p-5 flex justify-between items-center hover:bg-slate-50 transition-all cursor-pointer border-b border-slate-50 last:border-0 group">
              <div class="flex flex-col">
                <span class="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                   {{ isSambre(selectedTeam) ? m.adversaire : 'vs Sambre' }}
                </span>
                <span class="text-xs text-slate-400">{{ formatDate(m.dateMatch) }}</span>
              </div>
              <div class="flex items-center gap-4">
                <span class="font-black text-lg" :class="getTeamResultColor(m, selectedTeam)">
                   {{ isSambre(selectedTeam) ? m.scoreSambre : m.scoreAdversaire }} - {{ isSambre(selectedTeam) ? m.scoreAdversaire : m.scoreSambre }}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-300 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
            <div v-if="teamStats.history.length === 0" class="p-8 text-center text-slate-400 italic">
              Aucun match trouvé pour cette équipe.
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="slide-up" mode="out-in">
        <div v-if="selectedMatchId && currentMatchStats" class="animate-fade-in-up space-y-8">

          <button @click="goBack" class="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold text-sm mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" /></svg>
            Retour
          </button>

          <div class="bg-white rounded-[32px] overflow-hidden shadow-xl border border-slate-100 relative">
            <div class="h-2 bg-gradient-to-r" :class="currentMatchStats.isSambreHome ? 'from-indigo-500 to-rose-500' : 'from-rose-500 to-indigo-500'"></div>
            <div class="p-8 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">

              <div class="text-center md:text-left">
                <div class="text-6xl font-black tracking-tighter" :class="currentMatchStats.isSambreHome ? 'text-indigo-600' : 'text-slate-800'">
                  {{ currentMatchStats.isSambreHome ? currentMatchStats.sambre.goals : currentMatchStats.opponent.goals }}
                </div>
                <div class="text-xs font-bold uppercase text-slate-400 mt-1">
                  {{ currentMatchStats.isSambreHome ? 'Sambre (Dom)' : currentMatchStats.adversaireName + ' (Dom)' }}
                </div>
              </div>

              <div class="flex flex-col items-center">
                 <span class="px-6 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-black uppercase mb-2 shadow-inner">
                   {{ currentMatchStats.resultSambre }}
                 </span>
                <div class="text-sm font-medium text-slate-400">{{ formatDate(currentMatchStats.date) }}</div>
              </div>

              <div class="text-center md:text-right">
                <div class="text-6xl font-black tracking-tighter" :class="!currentMatchStats.isSambreHome ? 'text-indigo-600' : 'text-slate-800'">
                  {{ !currentMatchStats.isSambreHome ? currentMatchStats.sambre.goals : currentMatchStats.opponent.goals }}
                </div>
                <div class="text-xs font-bold uppercase text-slate-400 mt-1">
                  {{ !currentMatchStats.isSambreHome ? 'Sambre (Ext)' : currentMatchStats.adversaireName + ' (Ext)' }}
                </div>
              </div>

            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center">
              <h3 class="font-bold text-lg text-slate-800 mb-6 w-full text-center lg:text-left">
                Duel d'Impact
              </h3>
              <div class="relative w-full h-80">
                <Radar v-if="currentMatchStats.charts" :data="currentMatchStats.charts.radarData" :options="radarOptions" />
              </div>
            </div>

            <div class="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center">
              <h3 class="font-bold text-lg text-slate-800 mb-6 w-full text-center lg:text-left">
                Efficacité par Zone (%)
              </h3>
              <div class="relative w-full h-80">
                <Bar v-if="currentMatchStats.charts" :data="currentMatchStats.charts.barData" :options="barOptions" />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            <div class="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 class="font-bold text-slate-800">Performance Individuelle (Sambre)</h3>
              <span class="text-xs font-bold bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-500">
                   {{ currentMatchStats.sambre.players.length }} Joueuses
                </span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left">
                <thead class="text-xs text-slate-400 uppercase bg-slate-50">
                <tr>
                  <th class="px-6 py-4 font-bold">Joueuse</th>
                  <th class="px-4 py-4 text-center">Buts</th>
                  <th class="px-4 py-4 text-center">Tirs</th>
                  <th class="px-4 py-4 text-center">Efficacité</th>
                  <th class="px-4 py-4 text-center">P.D</th>
                  <th class="px-4 py-4 text-center text-rose-500">Pertes</th>
                </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                <tr v-for="p in currentMatchStats.sambre.players" :key="p.name" class="hover:bg-indigo-50/20 transition-colors">
                  <td class="px-6 py-4 font-bold text-slate-700">{{ p.name }}</td>
                  <td class="px-4 py-4 text-center font-black text-slate-900">{{ p.goals }}</td>
                  <td class="px-4 py-4 text-center text-slate-500">{{ p.shots }}</td>
                  <td class="px-4 py-4 text-center font-bold" :class="p.efficiency >= 70 ? 'text-emerald-600' : p.efficiency >= 50 ? 'text-indigo-600' : 'text-slate-400'">
                    {{ p.efficiency }}%
                  </td>
                  <td class="px-4 py-4 text-center font-bold text-blue-500">{{ p.assists }}</td>
                  <td class="px-4 py-4 text-center font-bold text-rose-500">{{ p.turnovers }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </Transition>

      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineAsyncComponent } from 'vue'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const Bar = defineAsyncComponent(() => import('vue-chartjs').then(m => m.Bar))
const Radar = defineAsyncComponent(() => import('vue-chartjs').then(m => m.Radar))

const API_URL = "https://oscarapi.eternyuhc.fr/"

// CONSTANTE INFALLIBLE : C'est cet ID et UNIQUEMENT celui ci qui sert de repère pour Sambre.
const SAMBRE_TEAM_ID = "e2a4c7b1-9f3d-4e6a-8b2c-7d1e5f4c3a2b"
const SAMBRE_VARIANTS = ['SAMBRE', 'SAHB', 'AVESNOIS']

// --- STATE ---
const isLoading = ref(false)
const selectionMode = ref('clubs')
const teams = ref<any[]>([])
const bddMatches = ref<any[]>([])
const allEvents = ref<any[]>([])
const rencontresOfficielles = ref<any[]>([])

const selectedTeam = ref<any>(null)
const selectedMatchId = ref<number | null>(null)

// --- CONFIG CHARTS ---
const radarOptions = {
  responsive: true, maintainAspectRatio: false,
  scales: { r: { angleLines: { display: true }, suggestedMin: 0, suggestedMax: 100 } },
  plugins: { legend: { position: 'bottom' } }
}
const barOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
  scales: { y: { beginAtZero: true, max: 100 } }
}

// --- HELPERS ---
const normalizeStr = (s: string) => s ? s.toUpperCase().replace(/[^A-Z]/g, '').replace('HANDBALL', '').replace('HB', '') : ''
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('fr-FR', {day:'numeric', month:'short'}) : ''

// Check 100% fiable basé sur l'ID de l'équipe (plus de bug de nom)
const isSambre = (team: any) => {
  return team && String(team.id) === SAMBRE_TEAM_ID
}

// Gère la couleur du texte des victoires/défaites
const getTeamResultColor = (m: any, team: any) => {
  const isSelectedTeamSambre = isSambre(team)
  const myScore = isSelectedTeamSambre ? m.scoreSambre : m.scoreAdversaire
  const oppScore = isSelectedTeamSambre ? m.scoreAdversaire : m.scoreSambre

  if (myScore > oppScore) return 'text-emerald-600'
  if (myScore < oppScore) return 'text-rose-500'
  return 'text-slate-500'
}

const getZone = (s: string, is7m: boolean) => {
  if (is7m || s?.includes('7m')) return '7m'
  if (!s) return '6m'
  const z = s.toLowerCase()
  if (z.includes('9m') || z.includes('zone') || z.includes('ext')) return '9m'
  if (z.includes('aile') || z.includes('al')) return 'Ailes'
  return '6m'
}

// --- FETCH ---
async function fetchData() {
  isLoading.value = true
  try {
    const [rT, rM, rE, rRenc] = await Promise.all([
      fetch(`${API_URL}/teamlogo`),
      fetch(`${API_URL}/match`),
      fetch(`${API_URL}/evenement`),
      fetch(`${API_URL}/rencontre`)
    ])
    teams.value = (await rT.json()).docs || []
    bddMatches.value = (await rM.json()).docs || []
    allEvents.value = (await rE.json()).docs || []
    rencontresOfficielles.value = (await rRenc.json()).docs || []
  } catch(e) { console.error(e) }
  finally { isLoading.value = false }
}

// --- COMPUTED ---

// 1. Liste des matchs avec Vrai Score (compté depuis les buts)
const allMatchesWithScores = computed(() => {
  return bddMatches.value.map(m => {
    const events = allEvents.value.filter(e => e.match_id === m.id)

    // Recomptage absolu des buts
    let sS = 0, sA = 0
    events.forEach(e => {
      if (e.resultat === 'But') {
        if (String(e.team_id) === SAMBRE_TEAM_ID) sS++
        else sA++
      }
    })

    // Trouver qui est à Domicile pour l'affichage officiel
    let isSambreHome = true
    const advNorm = normalizeStr(m.adversaire)
    const renc = rencontresOfficielles.value.find(r =>
        r.calendrier_date_journee_debut === m.dateMatch &&
        (normalizeStr(r.competition_engagement_equipe_libelle_1).includes(advNorm) ||
            normalizeStr(r.competition_engagement_equipe_libelle_2).includes(advNorm))
    )
    if (renc) {
      const eq1 = renc.competition_engagement_equipe_libelle_1 || ""
      isSambreHome = SAMBRE_VARIANTS.some(v => eq1.toUpperCase().includes(v))
    }

    return { ...m, scoreSambre: sS, scoreAdversaire: sA, isSambreHome }
  }).sort((a,b) => new Date(b.dateMatch).getTime() - new Date(a.dateMatch).getTime())
})

// 2. Stats Globales
const teamStats = computed(() => {
  if (!selectedTeam.value) return null

  const isSambreSelected = isSambre(selectedTeam.value)
  const teamId = String(selectedTeam.value.id)

  // On filtre TOUS les events de cette équipe précise
  const teamEvents = allEvents.value.filter(e => String(e.team_id) === teamId)
  if (teamEvents.length === 0) return { matchesPlayed: 0, wins:0, losses:0, draws:0, history: [] }

  // Retrouver les matchs joués par cette équipe
  const matchIds = [...new Set(teamEvents.map(e => e.match_id))]
  const history = allMatchesWithScores.value.filter(m => matchIds.includes(m.id))

  // Calcul propre des victoires
  let wins = 0, losses = 0, draws = 0
  history.forEach(m => {
    // Si Sambre est l'équipe sélectionnée, myScore = scoreSambre. Sinon myScore = scoreAdversaire.
    const myScore = isSambreSelected ? m.scoreSambre : m.scoreAdversaire
    const oppScore = isSambreSelected ? m.scoreAdversaire : m.scoreSambre
    if (myScore > oppScore) wins++
    else if (myScore < oppScore) losses++
    else draws++
  })

  // Calcul des techniques
  let goals = 0, shots = 0, turnovers = 0, assists = 0
  teamEvents.forEach(e => {
    const res = (e.resultat || "").trim()
    if (['But', 'Tir', 'Arrêt du GB', 'Poteau', 'Sortie', 'Tir non cadré'].some(x => res.includes(x))) {
      shots++
      if (res === 'But') goals++
    }
    if (['PDB', 'Marcher', 'Passage en force'].some(x => res.includes(x))) turnovers++
    if (e.passed) assists++
  })

  const nb = history.length
  return {
    matchesPlayed: nb,
    wins, losses, draws,
    totalGoals: goals,
    efficiency: shots ? Math.round((goals/shots)*100) : 0,
    avgTurnovers: nb ? (turnovers/nb).toFixed(1) : 0,
    avgAssists: nb ? (assists/nb).toFixed(1) : 0,
    history: history
  }
})

// 3. Détail Match Complet
const currentMatchStats = computed(() => {
  if (!selectedMatchId.value) return null
  const m = allMatchesWithScores.value.find(x => x.id === selectedMatchId.value)
  if (!m) return null

  const evts = allEvents.value.filter(e => e.match_id === m.id)

  const sambre = { goals: 0, shots: 0, efficiency: 0, turnovers: 0, saves: 0, fastBreakGoals: 0, assists: 0, players: {} as any }
  const opp = { goals: 0, shots: 0, efficiency: 0, turnovers: 0, saves: 0, assists: 0 }

  const zonesSambre = { '6m':{ok:0,tot:0}, '9m':{ok:0,tot:0}, 'Ailes':{ok:0,tot:0}, '7m':{ok:0,tot:0} }
  const zonesOpp = { '6m':{ok:0,tot:0}, '9m':{ok:0,tot:0}, 'Ailes':{ok:0,tot:0}, '7m':{ok:0,tot:0} }

  evts.forEach(e => {
    const res = (e.resultat || "").trim()
    const isSambreAction = String(e.team_id) === SAMBRE_TEAM_ID
    const target = isSambreAction ? sambre : opp
    const zoneMap = isSambreAction ? zonesSambre : zonesOpp

    if (['But', 'Tir', 'Arrêt du GB', 'Poteau', 'Sortie', 'Tir non cadré'].some(x => res.includes(x))) {
      target.shots++
      const z = getZone(e.secteur, e.jets_7m)
      zoneMap[z].tot++

      if (res === 'But') {
        target.goals++
        zoneMap[z].ok++
        if (isSambreAction && e.grandespace) sambre.fastBreakGoals++
      }
      if (res === 'Arrêt du GB') {
        (isSambreAction ? opp : sambre).saves++
      }
    }

    if (['PDB', 'Marcher', 'Passage en force', 'Reprise de dribble'].some(x => res.includes(x))) target.turnovers++
    if (e.passed) target.assists++

    if (isSambreAction) {
      const pName = e.joueuse ? e.joueuse.trim() : 'Inconnue'
      if (!sambre.players[pName]) sambre.players[pName] = { name: pName, goals: 0, shots: 0, turnovers: 0, assists: 0, efficiency: 0 }
      const p = sambre.players[pName]
      if (['But', 'Tir', 'Arrêt du GB', 'Poteau'].some(x => res.includes(x))) p.shots++
      if (res === 'But') p.goals++
      if (res.includes('PDB')) p.turnovers++
      if (e.passed) p.assists++
      p.efficiency = p.shots > 0 ? Math.round((p.goals/p.shots)*100) : 0
    }
  })

  sambre.efficiency = sambre.shots > 0 ? Math.round((sambre.goals/sambre.shots)*100) : 0
  opp.efficiency = opp.shots > 0 ? Math.round((opp.goals/opp.shots)*100) : 0

  sambre.players = Object.values(sambre.players).sort((a:any, b:any) => b.goals - a.goals)

  let resultSambre = 'Match Nul'
  if (sambre.goals > opp.goals) resultSambre = 'Victoire SAHB'
  else if (sambre.goals < opp.goals) resultSambre = 'Défaite SAHB'

  const radarData = {
    labels: ['Efficacité (%)', 'Arrêts GB', 'Jeu Rapide', 'Sécurité Balle', 'Passes D.'],
    datasets: [
      {
        label: 'Sambre',
        backgroundColor: 'rgba(79, 70, 229, 0.2)', borderColor: '#4F46E5', pointBackgroundColor: '#4F46E5',
        data: [sambre.efficiency, Math.min(100, sambre.saves * 5), Math.min(100, sambre.fastBreakGoals * 10), Math.max(0, 100 - (sambre.turnovers * 4)), Math.min(100, sambre.assists * 5)]
      },
      {
        label: m.adversaire,
        backgroundColor: 'rgba(244, 63, 94, 0.2)', borderColor: '#F43F5E', pointBackgroundColor: '#F43F5E',
        data: [opp.efficiency, Math.min(100, opp.saves * 5), 0, Math.max(0, 100 - (opp.turnovers * 4)), Math.min(100, opp.assists * 5)]
      }
    ]
  }

  const barData = {
    labels: ['Ailes', '6m', '9m', '7m'],
    datasets: [
      { label: 'Sambre (%)', backgroundColor: '#4F46E5', data: [zonesSambre['Ailes'].tot ? (zonesSambre['Ailes'].ok/zonesSambre['Ailes'].tot)*100 : 0, zonesSambre['6m'].tot ? (zonesSambre['6m'].ok/zonesSambre['6m'].tot)*100 : 0, zonesSambre['9m'].tot ? (zonesSambre['9m'].ok/zonesSambre['9m'].tot)*100 : 0, zonesSambre['7m'].tot ? (zonesSambre['7m'].ok/zonesSambre['7m'].tot)*100 : 0] },
      { label: `${m.adversaire} (%)`, backgroundColor: '#F43F5E', data: [zonesOpp['Ailes'].tot ? (zonesOpp['Ailes'].ok/zonesOpp['Ailes'].tot)*100 : 0, zonesOpp['6m'].tot ? (zonesOpp['6m'].ok/zonesOpp['6m'].tot)*100 : 0, zonesOpp['9m'].tot ? (zonesOpp['9m'].ok/zonesOpp['9m'].tot)*100 : 0, zonesOpp['7m'].tot ? (zonesOpp['7m'].ok/zonesOpp['7m'].tot)*100 : 0] }
    ]
  }

  return {
    date: m.dateMatch,
    resultSambre,
    isSambreHome: m.isSambreHome,
    adversaireName: m.adversaire,
    sambre, opponent: opp,
    charts: { radarData, barData }
  }
})

// --- ACTIONS UI ---
function selectTeam(t: any) { selectedTeam.value = t; selectedMatchId.value = null }
function selectMatchDirectly(m: any) { selectedMatchId.value = m.id; selectedTeam.value = null }

function goBack() {
  if (selectedMatchId.value) {
    selectedMatchId.value = null
  } else if (selectedTeam.value) {
    selectedTeam.value = null
  }
}
function goHome() { selectedTeam.value = null; selectedMatchId.value = null; selectionMode.value = 'clubs' }

onMounted(fetchData)
</script>

<style scoped>
.animate-fade-in-down { animation: fadeInDown 0.6s ease-out; }
.animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
@keyframes fadeInDown { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
</style>