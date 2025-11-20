<template>
  <main class="min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
    <div class="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-12 pb-24">

      <!-- HEADER -->
      <header class="mb-10 text-center">
        <div class="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full">Analyses & Statistiques</div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tight mb-2">Comparateur de Matchs</h1>
        <p class="text-slate-500">Analysez les scores, les tactiques et les zones de pertes de balle.</p>
      </header>

      <!-- SÉLECTEURS -->
      <section class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-12 max-w-5xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center relative bg-slate-50 rounded-[20px] p-6">

          <!-- Match A -->
          <div>
            <label class="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
              <span class="flex h-5 w-5 items-center justify-center rounded bg-indigo-600 text-[10px] text-white">A</span>
              Match Référence
            </label>
            <select v-model="selectedMatchA" class="block w-full py-3 pl-4 pr-10 text-sm border-slate-200 rounded-xl focus:ring-indigo-500 bg-white shadow-sm cursor-pointer">
              <option :value="null">Sélectionner un match...</option>
              <option v-for="m in matches" :key="m.id" :value="m.id">
                {{ formatDate(m.dateMatch) }} — vs {{ m.adversaire || 'Inconnu' }}
              </option>
            </select>
          </div>

          <!-- VS Badge -->
          <div class="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 bg-white rounded-full items-center justify-center shadow border border-slate-100 text-xs font-black text-slate-300 z-10">VS</div>

          <!-- Match B -->
          <div>
            <label class="flex items-center gap-2 text-xs font-bold text-rose-500 uppercase tracking-wider mb-2">
              <span class="flex h-5 w-5 items-center justify-center rounded bg-rose-500 text-[10px] text-white">B</span>
              Match Comparé
            </label>
            <select v-model="selectedMatchB" class="block w-full py-3 pl-4 pr-10 text-sm border-slate-200 rounded-xl focus:ring-rose-500 bg-white shadow-sm cursor-pointer">
              <option :value="null">Sélectionner un match...</option>
              <option v-for="m in matches" :key="m.id" :value="m.id">
                {{ formatDate(m.dateMatch) }} — vs {{ m.adversaire || 'Inconnu' }}
              </option>
            </select>
          </div>
        </div>
      </section>

      <!-- LOADER -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-block h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-r-transparent"></div>
        <p class="mt-4 text-slate-500 font-medium">Chargement des données...</p>
      </div>

      <!-- CONTENU PRINCIPAL -->
      <div v-else-if="statsA && statsB" class="space-y-12 animate-fade-in">

        <!-- 1. SCOREBOARD & KPI (AVEC BADGE RÉSULTAT) -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ScoreboardCard :stats="statsA" color="#4F46E5" letter="A" />
          <ScoreboardCard :stats="statsB" color="#F43F5E" letter="B" />
        </section>

        <!-- 2. LIEUX PERTES DE BALLE (CAMEMBERTS) -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Camembert A -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h3 class="text-sm font-bold text-indigo-600 uppercase mb-6">Lieux Pertes de Balle (A)</h3>
            <div class="flex flex-col sm:flex-row items-center gap-8">
              <div class="relative w-40 h-40 rounded-full shadow-inner flex-shrink-0"
                   :style="{ background: getConicGradient(formatPieData(statsA.sambre.turnoverZones, 'indigo')) }">
                <div class="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span class="text-xl font-black text-indigo-800">{{ statsA.sambre.turnovers }}</span>
                </div>
              </div>
              <div class="flex-1 w-full space-y-2">
                <div v-for="(slice, idx) in formatPieData(statsA.sambre.turnoverZones, 'indigo').slice(0,5)" :key="idx" class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: slice.color }"></span>
                    <span class="text-slate-600 font-medium truncate max-w-[120px]" :title="slice.label">{{ slice.label }}</span>
                  </div>
                  <span class="font-bold text-indigo-600">{{ slice.percent }}%</span>
                </div>
                <div v-if="Object.keys(statsA.sambre.turnoverZones).length === 0" class="text-xs text-slate-400 italic">Aucune donnée.</div>
              </div>
            </div>
          </div>

          <!-- Camembert B -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h3 class="text-sm font-bold text-rose-500 uppercase mb-6">Lieux Pertes de Balle (B)</h3>
            <div class="flex flex-col sm:flex-row items-center gap-8">
              <div class="relative w-40 h-40 rounded-full shadow-inner flex-shrink-0"
                   :style="{ background: getConicGradient(formatPieData(statsB.sambre.turnoverZones, 'rose')) }">
                <div class="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span class="text-xl font-black text-rose-800">{{ statsB.sambre.turnovers }}</span>
                </div>
              </div>
              <div class="flex-1 w-full space-y-2">
                <div v-for="(slice, idx) in formatPieData(statsB.sambre.turnoverZones, 'rose').slice(0,5)" :key="idx" class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: slice.color }"></span>
                    <span class="text-slate-600 font-medium truncate max-w-[120px]" :title="slice.label">{{ slice.label }}</span>
                  </div>
                  <span class="font-bold text-rose-500">{{ slice.percent }}%</span>
                </div>
                <div v-if="Object.keys(statsB.sambre.turnoverZones).length === 0" class="text-xs text-slate-400 italic">Aucune donnée.</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 3. TACTIQUE OFFENSIVE & SPÉCIFIQUES (7m, 6c5) -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Tactiques (Enclenchements 06) -->
          <div class="card p-6 lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div class="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <span class="text-2xl">♟️</span>
              <h2 class="text-lg font-bold text-slate-900">Tactique Offensive (Enclenchements)</h2>
            </div>
            <div class="space-y-5">
              <div v-for="(tactic, idx) in getCommonTactics(statsA, statsB)" :key="idx" class="relative group">
                <div class="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span>{{ tactic.name }}</span>
                </div>
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <div class="w-full bg-slate-100 rounded-r-full h-2 relative overflow-hidden">
                      <div class="absolute left-0 top-0 h-full" style="background-color: #4F46E5" :style="{width: getPercentMax(tactic.countA, 15) + '%'}"></div>
                    </div>
                    <span class="text-xs font-bold text-indigo-700 w-8 text-right">{{ tactic.countA }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-full bg-slate-100 rounded-r-full h-2 relative overflow-hidden">
                      <div class="absolute left-0 top-0 h-full" style="background-color: #F43F5E" :style="{width: getPercentMax(tactic.countB, 15) + '%'}"></div>
                    </div>
                    <span class="text-xs font-bold text-rose-700 w-8 text-right">{{ tactic.countB }}</span>
                  </div>
                </div>
              </div>
              <div v-if="getCommonTactics(statsA, statsB).length === 0" class="text-center text-slate-400 italic">Aucune donnée tactique commune trouvée.</div>
            </div>
          </div>

          <!-- Spécifiques (7m, 6c5) - SANS TRANSITION ICI -->
          <div class="space-y-6">
            <!-- Carte 7m -->
            <div class="card p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 class="text-xs font-bold text-slate-500 uppercase mb-4">Jets de 7m (Réussis / Total)</h3>
              <div class="flex justify-around text-center">
                <div>
                  <div class="text-2xl font-black text-indigo-600">{{ statsA.sambre.penaltiesScored }}/{{ statsA.sambre.penaltiesTotal }}</div>
                  <div class="text-[10px] font-bold text-slate-400 uppercase mt-1">Match A</div>
                </div>
                <div class="w-px bg-slate-100"></div>
                <div>
                  <div class="text-2xl font-black text-rose-500">{{ statsB.sambre.penaltiesScored }}/{{ statsB.sambre.penaltiesTotal }}</div>
                  <div class="text-[10px] font-bold text-slate-400 uppercase mt-1">Match B</div>
                </div>
              </div>
            </div>

            <!-- Carte 6c5 -->
            <div class="card p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 class="text-xs font-bold text-slate-500 uppercase mb-4">Jeu en Supériorité (6c5)</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                  <span class="text-xs font-bold text-indigo-700">Match A</span>
                  <span class="font-black text-indigo-900">{{ statsA.sambre.powerPlayCount }} <span class="text-[10px] font-normal">actions</span></span>
                </div>
                <div class="flex justify-between items-center p-2 bg-rose-50 rounded-lg border border-rose-100">
                  <span class="text-xs font-bold text-rose-700">Match B</span>
                  <span class="font-black text-rose-900">{{ statsB.sambre.powerPlayCount }} <span class="text-[10px] font-normal">actions</span></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 4. GRANDE SECTION TRANSITION & MONTÉE DE BALLE (REMISE EN PLACE) -->
        <section class="card p-8 bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-3xl border border-indigo-100">
          <div class="flex items-center gap-2 mb-8">
            <span class="text-2xl"></span>
            <h2 class="text-lg font-bold text-indigo-900">Transition & Montée de Balle</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <!-- Grand Espace -->
            <div>
              <div class="text-xs font-bold text-indigo-400 uppercase mb-2">Buts Grand Espace</div>
              <div class="flex justify-center items-end gap-4">
                <div class="text-3xl font-black text-indigo-600">{{ statsA.sambre.fastBreakGoals }}</div>
                <span class="text-slate-300 text-2xl font-light">/</span>
                <div class="text-3xl font-black text-rose-500">{{ statsB.sambre.fastBreakGoals }}</div>
              </div>
            </div>

            <!-- Enclenchements Transition -->
            <div>
              <div class="text-xs font-bold text-indigo-400 uppercase mb-2">Enclenchement Transition</div>
              <div class="flex justify-center items-end gap-4">
                <div class="text-3xl font-black text-indigo-600">{{ statsA.sambre.transitionCount }}</div>
                <span class="text-slate-300 text-2xl font-light">/</span>
                <div class="text-3xl font-black text-rose-500">{{ statsB.sambre.transitionCount }}</div>
              </div>
            </div>

            <!-- Repli Défensif -->
            <div>
              <div class="text-xs font-bold text-indigo-400 uppercase mb-2">Replis Défensifs</div>
              <div class="flex justify-center items-end gap-4">
                <div class="text-3xl font-black text-indigo-600">{{ statsA.sambre.repliCount }}</div>
                <span class="text-slate-300 text-2xl font-light">/</span>
                <div class="text-3xl font-black text-rose-500">{{ statsB.sambre.repliCount }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 5. DÉFENSE & GARDIENNES -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Systèmes Défensifs -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 class="text-lg font-bold text-slate-900 mb-4">Systèmes Défensifs</h2>
            <div class="space-y-4">
              <div v-for="sys in ['0-6', '1-5', 'Strict', 'Défense 5 c 6']" :key="sys">
                <div class="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>{{ sys }}</span></div>
                <div class="flex h-3 rounded bg-slate-100 overflow-hidden relative">
                  <div class="h-full border-r border-white" style="background-color: #4F46E5" :style="{width: getDefenseShare(statsA, sys) + '%'}"></div>
                  <div class="h-full" style="background-color: #F43F5E" :style="{width: getDefenseShare(statsB, sys) + '%'}"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Gardiennes -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 class="text-lg font-bold text-slate-900 mb-4">Gardiennes (Arrêts)</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <h5 class="text-xs font-bold text-indigo-600 uppercase mb-2 border-b border-indigo-100 pb-1">Match A</h5>
                <div v-for="(g, name) in statsA.sambre.goalkeepers" :key="name" class="flex justify-between text-sm py-1">
                  <span class="text-slate-600">{{ name }}</span>
                  <span class="font-bold text-indigo-800">{{ g.saves }}</span>
                </div>
              </div>
              <div>
                <h5 class="text-xs font-bold text-rose-500 uppercase mb-2 border-b border-rose-100 pb-1">Match B</h5>
                <div v-for="(g, name) in statsB.sambre.goalkeepers" :key="name" class="flex justify-between text-sm py-1">
                  <span class="text-slate-600">{{ name }}</span>
                  <span class="font-bold text-rose-800">{{ g.saves }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 6. TABLEAUX JOUEUSES -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <!-- Table A -->
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div class="bg-indigo-50 px-4 py-3 border-b border-indigo-100">
              <span class="text-xs font-bold text-indigo-700 uppercase">Effectif Match A</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left">
                <thead class="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th class="px-4 py-2">Joueuse</th>
                  <th class="px-2 py-2 text-center">Buts/Tirs</th>
                  <th class="px-2 py-2 text-center">%</th>
                  <th class="px-2 py-2 text-center text-rose-500">PDB</th>
                </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                <tr v-for="p in sortedPlayers(statsA.sambre.players)" :key="p.name">
                  <td class="px-4 py-2 font-bold text-slate-700">{{ p.name }}</td>
                  <td class="px-2 py-2 text-center">{{ p.goals }}<span class="text-slate-300">/</span>{{ p.shots }}</td>
                  <td class="px-2 py-2 text-center font-bold" :class="getEfficiencyColor(p.goals, p.shots)">
                    {{ p.shots > 0 ? Math.round((p.goals/p.shots)*100) : 0 }}%
                  </td>
                  <td class="px-2 py-2 text-center text-rose-500 font-bold">{{ p.turnovers }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Table B -->
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div class="bg-rose-50 px-4 py-3 border-b border-rose-100">
              <span class="text-xs font-bold text-rose-700 uppercase">Effectif Match B</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left">
                <thead class="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th class="px-4 py-2">Joueuse</th>
                  <th class="px-2 py-2 text-center">Buts/Tirs</th>
                  <th class="px-2 py-2 text-center">%</th>
                  <th class="px-2 py-2 text-center text-rose-500">PDB</th>
                </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                <tr v-for="p in sortedPlayers(statsB.sambre.players)" :key="p.name">
                  <td class="px-4 py-2 font-bold text-slate-700">{{ p.name }}</td>
                  <td class="px-2 py-2 text-center">{{ p.goals }}<span class="text-slate-300">/</span>{{ p.shots }}</td>
                  <td class="px-2 py-2 text-center font-bold" :class="getEfficiencyColor(p.goals, p.shots)">
                    {{ p.shots > 0 ? Math.round((p.goals/p.shots)*100) : 0 }}%
                  </td>
                  <td class="px-2 py-2 text-center text-rose-500 font-bold">{{ p.turnovers }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>

      <!-- EMPTY STATE -->
      <div v-else class="text-center py-32 opacity-40">
        <div class="text-6xl grayscale mb-4">📊</div>
        <p class="text-xl font-medium text-slate-400">Sélectionnez deux matchs pour débuter.</p>
      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// --- COMPOSANTS INLINE ---
const ScoreboardCard = {
  props: ['stats', 'color', 'letter'],
  template: `
    <div class="relative overflow-hidden rounded-2xl bg-white border shadow-lg transition-all hover:shadow-xl" :style="{borderColor: color + '33'}">
      <div class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm"
           :style="getResultStyle(stats.result)">
        {{ stats.result }}
      </div>
      <div class="absolute top-0 left-0 w-full h-2" :style="{backgroundColor: color}"></div>
      <div class="p-6">
        <div class="flex justify-between items-start mb-6">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl flex items-center justify-center text-xl font-black text-white shadow-md" :style="{backgroundColor: color}">{{ letter }}</div>
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400">{{ stats.matchDate }}</div>
              <div class="font-bold text-slate-900 leading-tight">{{ stats.matchLabel }}</div>
            </div>
          </div>
          <div class="text-right pt-6">
            <div class="text-5xl font-black tracking-tighter text-slate-900">
              {{ stats.sambre.goals }} <span class="text-slate-300 text-3xl font-light">-</span> {{ stats.opponent.goals }}
            </div>
            <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Score Final</div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
            <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">Tirs</div>
            <div class="text-xl font-black text-slate-800">{{ stats.sambre.shots }}</div>
          </div>
          <div class="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
            <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">Précision</div>
            <div class="text-xl font-black" :style="{color: color}">{{ stats.sambre.efficiency }}%</div>
          </div>
          <div class="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
            <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">Pertes</div>
            <div class="text-xl font-black text-rose-500">{{ stats.sambre.turnovers }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  methods: {
    getResultStyle(res: string) {
      if (res === 'Victoire') return { backgroundColor: '#D1FAE5', color: '#065F46' };
      if (res === 'Défaite') return { backgroundColor: '#FFE4E6', color: '#9F1239' };
      return { backgroundColor: '#F1F5F9', color: '#475569' };
    }
  }
}

// --- TYPES & LOGIQUE ---
interface Match { id: number; adversaire: string; dateMatch: string; }
interface Evenement {
  id: number; matchId: number; nom: string; joueuse: string; defense: string; resultat: string;
  attaqueplacees: string; jets7m: string; grandespace: string; repli: string; secteur: string;
  passed: string; defenseplus: string; defensemoins: string; enclenchements06: string;
  enclenchements6c5: string; enclenchementstransier: string; lieupb: string;
}

interface PlayerStats { name: string; goals: number; shots: number; assists: number; turnovers: number; }

interface StatsTeam {
  goals: number; shots: number; efficiency: number; assists: number;
  turnovers: number;
  turnoverZones: Record<string, number>;
  players: Record<string, PlayerStats>;
  goalkeepers: Record<string, { saves: number }>;
  tactics: Record<string, number>;
  penaltiesScored: number; penaltiesTotal: number;
  powerPlayCount: number;
  fastBreakGoals: number; transitionCount: number; repliCount: number;
  defenseSystems: Record<string, number>;
}

interface MatchAnalysis {
  matchId: number; matchLabel: string; matchDate: string; result: string;
  sambre: StatsTeam; opponent: { goals: number; };
}

const matches = ref<Match[]>([])
const allEvents = ref<Evenement[]>([])
const selectedMatchA = ref<number | null>(null)
const selectedMatchB = ref<number | null>(null)
const isLoading = ref(false)
const SAMBRE_GKS = ['JUSTICIA', 'ALIX'];

async function fetchData() {
  isLoading.value = true
  try {
    const [rM, rE] = await Promise.all([fetch('http://localhost:8080/match'), fetch('http://localhost:8080/evenement')])
    const jM = await rM.json(); const jE = await rE.json();
    matches.value = jM.docs || []; allEvents.value = jE.docs || [];
  } catch(e) { console.error(e); }
  finally { isLoading.value = false }
}

function normalize(str: string) { return (str || "").trim() }

function computeStats(matchId: number): MatchAnalysis | null {
  const m = matches.value.find(x => x.id == matchId)
  if (!m) return null

  const evts = allEvents.value.filter(x => x.matchId == matchId)

  const stats: StatsTeam = {
    goals: 0, shots: 0, efficiency: 0, assists: 0, turnovers: 0,
    turnoverZones: {}, players: {}, goalkeepers: {},
    tactics: {}, penaltiesScored: 0, penaltiesTotal: 0, powerPlayCount: 0,
    fastBreakGoals: 0, transitionCount: 0, repliCount: 0, defenseSystems: {}
  }
  const opp = { goals: 0 }

  evts.forEach(e => {
    const nom = normalize(e.nom)
    const res = normalize(e.resultat)
    let player = normalize(e.joueuse).toUpperCase()

    if(player && !stats.players[player] && !SAMBRE_GKS.includes(player)) {
      stats.players[player] = { name: player, goals: 0, shots: 0, assists: 0, turnovers: 0 }
    }

    const isDefPhase = nom.startsWith('0-6') || nom.startsWith('1-5') || nom.startsWith('Déf') || nom.startsWith('Repli') || nom.includes('7m Adversaires')

    if (isDefPhase) {
      if (res === 'But') opp.goals++
      if (res === 'Ar GB' && player) {
        if(!stats.goalkeepers[player]) stats.goalkeepers[player] = { saves: 0 }
        stats.goalkeepers[player].saves++
      }
      const defSys = normalize(e.defense) || (nom.startsWith('0-6') ? '0-6' : nom.startsWith('1-5') ? '1-5' : '')
      if(defSys && ['0-6', '1-5', 'Strict', 'Défense 5 c 6'].some(d => defSys.includes(d))) {
        const key = ['0-6', '1-5', 'Strict', 'Défense 5 c 6'].find(d => defSys.includes(d)) || 'Autre'
        stats.defenseSystems[key] = (stats.defenseSystems[key] || 0) + 1
      }
    }
    else {
      // Attaque Sambre
      if (['But', 'Ar GB', 'HC', 'tir raté NC', 'Poteau', 'Tir'].includes(res)) {
        stats.shots++
        if (player && stats.players[player]) stats.players[player].shots++
        if (res === 'But') {
          stats.goals++
          if (player && stats.players[player]) stats.players[player].goals++
          if (normalize(e.grandespace)) stats.fastBreakGoals++
          if (normalize(e.jets7m).includes('Equipe à analyser')) stats.penaltiesScored++
        }
        if (normalize(e.jets7m).includes('Equipe à analyser')) stats.penaltiesTotal++
      }
      // Pertes Balle & Lieu
      if (['PDB', 'Marcher', 'Passage en force'].includes(res)) {
        stats.turnovers++
        if (player && stats.players[player]) stats.players[player].turnovers++
        const lieu = normalize(e.lieupb) || "Non renseigné"
        stats.turnoverZones[lieu] = (stats.turnoverZones[lieu] || 0) + 1
      }
      // Tactique
      const tac = normalize(e.enclenchements06)
      if (tac) stats.tactics[tac] = (stats.tactics[tac] || 0) + 1

      if (normalize(e.enclenchements6c5)) stats.powerPlayCount++
      if (normalize(e.enclenchementstransier)) stats.transitionCount++
    }
    // Repli
    if (normalize(e.repli)) stats.repliCount++
  })

  stats.efficiency = stats.shots > 0 ? Math.round((stats.goals/stats.shots)*100) : 0
  let result = 'Nul';
  if (stats.goals > opp.goals) result = 'Victoire';
  else if (stats.goals < opp.goals) result = 'Défaite';

  return {
    matchId, matchLabel: m.adversaire || `Adversaire Inconnu`, matchDate: new Date(m.dateMatch).toLocaleDateString('fr-FR'),
    result, sambre: stats, opponent: opp
  }
}

const statsA = computed(() => selectedMatchA.value ? computeStats(selectedMatchA.value) : null)
const statsB = computed(() => selectedMatchB.value ? computeStats(selectedMatchB.value) : null)

// --- HELPERS ---
function sortedPlayers(players: Record<string, PlayerStats>) {
  return Object.values(players).sort((a,b) => b.goals - a.goals)
}
function formatPieData(zones: Record<string, number>, theme: string) {
  const colors = theme === 'indigo' ? ['#4F46E5', '#818CF8', '#A5B4FC', '#C7D2FE'] : ['#F43F5E', '#FB7185', '#FDA4AF', '#FECDD3'];
  const total = Object.values(zones).reduce((a,b) => a+b, 0);
  return Object.entries(zones).map(([label, value], i) => ({
    label, value, percent: total > 0 ? Math.round((value/total)*100) : 0, color: colors[i % colors.length]
  })).sort((a,b) => b.value - a.value)
}
function getConicGradient(data: any[]) {
  if (!data || data.length === 0) return '#e5e7eb';
  let gradient = 'conic-gradient(';
  let currentDeg = 0;
  data.forEach((slice, index) => {
    const sliceDeg = (slice.percent / 100) * 360;
    gradient += `${slice.color} ${currentDeg}deg ${currentDeg + sliceDeg}deg`;
    currentDeg += sliceDeg;
    if (index < data.length - 1) gradient += ', ';
  });
  return gradient + ')';
}
function getCommonTactics(sA: MatchAnalysis, sB: MatchAnalysis) {
  const all = new Set([...Object.keys(sA.sambre.tactics), ...Object.keys(sB.sambre.tactics)])
  return Array.from(all).map(k => ({
    name: k, countA: sA.sambre.tactics[k]||0, countB: sB.sambre.tactics[k]||0
  })).sort((a,b) => (b.countA + b.countB) - (a.countA + a.countB)).slice(0, 6)
}
function getPercentMax(val: number, max: number) { return Math.min((val/max)*100, 100) }
function getDefenseShare(stat: MatchAnalysis, sys: string) {
  const total = Object.values(stat.sambre.defenseSystems).reduce((a,b)=>a+b,0)
  const val = stat.sambre.defenseSystems[sys] || 0
  return total > 0 ? (val/total)*100 : 0
}
function getEfficiencyColor(g: number, s: number) {
  if (s === 0) return 'text-slate-400';
  const r = (g/s);
  if (r >= 0.75) return 'text-emerald-600 font-bold';
  if (r >= 0.50) return 'text-blue-600';
  return 'text-orange-500';
}
function formatDate(d: string) { return d ? new Date(d).toLocaleDateString('fr-FR') : '' }

onMounted(() => fetchData())
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s ease-out forwards; opacity: 0; transform: translateY(10px); }
@keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
</style>