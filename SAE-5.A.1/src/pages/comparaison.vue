<template>
  <main class="min-h-screen bg-[#F7F7FB] text-slate-800 font-sans">
    <div class="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/40 to-transparent -z-10 pointer-events-none"></div>

    <div class="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-24 pb-24">

      <header class="flex flex-col items-center text-center mb-12 animate-fade-in-down">
        <span class="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 uppercase bg-white border border-indigo-100 rounded-full shadow-sm">
          Analyses & Statistiques
        </span>
        <h1 class="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-8 drop-shadow-sm">
          Analyse de Match
        </h1>

        <div class="relative bg-white p-1.5 rounded-full shadow-sm border border-slate-200 inline-flex select-none">
          <div
              class="absolute inset-y-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              :class="isComparisonMode ? 'translate-x-full left-1.5' : 'left-1.5'"
          ></div>
          <button
              @click="isComparisonMode = false"
              class="relative z-10 px-8 py-2.5 text-sm font-bold rounded-full transition-colors duration-300 w-44"
              :class="!isComparisonMode ? 'text-white' : 'text-slate-500 hover:text-slate-900'"
          >
            Match Unique
          </button>
          <button
              @click="enableComparison"
              class="relative z-10 px-8 py-2.5 text-sm font-bold rounded-full transition-colors duration-300 w-44"
              :class="isComparisonMode ? 'text-white' : 'text-slate-500 hover:text-slate-900'"
          >
            Comparateur
          </button>
        </div>
      </header>

      <section class="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-12 transition-all duration-500 ease-in-out">
        <div class="grid gap-8 items-center relative transition-all duration-500" :class="isComparisonMode ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-xl mx-auto'">

          <div class="group">
            <label class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1 group-focus-within:text-indigo-600 transition-colors">
              <span class="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 text-[10px] text-slate-500 group-focus-within:bg-indigo-100 group-focus-within:text-indigo-700 transition-colors font-black">A</span>
              {{ isComparisonMode ? 'Match de Référence' : 'Sélectionner le Match' }}
            </label>
            <div class="relative">
              <select v-model="selectedMatchA" class="block w-full py-4 pl-5 pr-12 text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all cursor-pointer outline-none appearance-none shadow-inner hover:bg-slate-100">
                <option :value="null">Choisir un adversaire...</option>
                <option v-for="m in matches" :key="m.id" :value="m.id">
                  {{ formatDate(m.dateMatch) }} — {{ m.adversaire || 'Inconnu' }}
                </option>
              </select>
              <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
              </div>
            </div>
          </div>

          <div v-if="isComparisonMode" class="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 bg-white rounded-full items-center justify-center shadow-lg border border-slate-100 z-10 animate-pop-in">
            <span class="text-xs font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-rose-500">VS</span>
          </div>

          <div v-if="isComparisonMode" class="group animate-fade-in-right">
            <label class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1 group-focus-within:text-rose-500 transition-colors">
              <span class="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 text-[10px] text-slate-500 group-focus-within:bg-rose-100 group-focus-within:text-rose-700 transition-colors font-black">B</span>
              Match à Comparer
            </label>
            <div class="relative">
              <select v-model="selectedMatchB" class="block w-full py-4 pl-5 pr-12 text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 focus:bg-white transition-all cursor-pointer outline-none appearance-none shadow-inner hover:bg-slate-100">
                <option :value="null">Choisir un adversaire...</option>
                <option v-for="m in matches" :key="m.id" :value="m.id">
                  {{ formatDate(m.dateMatch) }} — {{ m.adversaire || 'Inconnu' }}
                </option>
              </select>
              <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Transition name="fade">
        <div v-if="isLoading" class="flex flex-col items-center py-20">
          <div class="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p class="mt-4 text-sm font-medium text-slate-400 animate-pulse">Analyse des données...</p>
        </div>
      </Transition>

      <Transition name="slide-up" mode="out-in">

        <div v-if="!isLoading && isComparisonMode && statsA && statsB" key="comparison" class="space-y-12">

          <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ScoreboardCard :stats="statsA" color="#4F46E5" letter="A" class="animate-fade-in-left delay-100" />
            <ScoreboardCard :stats="statsB" color="#F43F5E" letter="B" class="animate-fade-in-right delay-200" />
          </section>

          <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 class="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-8 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-indigo-600"></span> Pertes de Balle (A)
              </h3>
              <div class="flex flex-col sm:flex-row items-center gap-10">
                <div class="relative w-40 h-40 flex-shrink-0 group">
                  <div class="absolute inset-0 rounded-full blur-xl bg-indigo-100/50 group-hover:bg-indigo-200/50 transition-colors"></div>
                  <div class="relative w-full h-full rounded-full shadow-inner overflow-hidden" :style="{ background: getConicGradient(formatPieData(statsA.sambre.turnoverZones, 'indigo')) }">
                    <div class="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <span class="text-2xl font-black text-indigo-800">{{ statsA.sambre.turnovers }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex-1 w-full space-y-2">
                  <div v-for="(slice, idx) in formatPieData(statsA.sambre.turnoverZones, 'indigo').slice(0,5)" :key="idx" class="flex items-center justify-between text-xs group/item">
                    <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full transition-transform group-hover/item:scale-125" :style="{ backgroundColor: slice.color }"></span>
                      <span class="text-slate-600 font-medium truncate max-w-[120px]" :title="slice.label">{{ slice.label }}</span>
                    </div>
                    <span class="font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded">{{ slice.percent }}%</span>
                  </div>
                  <div v-if="Object.keys(statsA.sambre.turnoverZones).length === 0" class="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl">Aucune donnée.</div>
                </div>
              </div>
            </div>

            <div class="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 class="text-xs font-bold text-rose-500 uppercase tracking-wider mb-8 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-rose-500"></span> Pertes de Balle (B)
              </h3>
              <div class="flex flex-col sm:flex-row items-center gap-10">
                <div class="relative w-40 h-40 flex-shrink-0 group">
                  <div class="absolute inset-0 rounded-full blur-xl bg-rose-100/50 group-hover:bg-rose-200/50 transition-colors"></div>
                  <div class="relative w-full h-full rounded-full shadow-inner overflow-hidden" :style="{ background: getConicGradient(formatPieData(statsB.sambre.turnoverZones, 'rose')) }">
                    <div class="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <span class="text-2xl font-black text-rose-800">{{ statsB.sambre.turnovers }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex-1 w-full space-y-2">
                  <div v-for="(slice, idx) in formatPieData(statsB.sambre.turnoverZones, 'rose').slice(0,5)" :key="idx" class="flex items-center justify-between text-xs group/item">
                    <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full transition-transform group-hover/item:scale-125" :style="{ backgroundColor: slice.color }"></span>
                      <span class="text-slate-600 font-medium truncate max-w-[120px]" :title="slice.label">{{ slice.label }}</span>
                    </div>
                    <span class="font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded">{{ slice.percent }}%</span>
                  </div>
                  <div v-if="Object.keys(statsB.sambre.turnoverZones).length === 0" class="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl">Aucune donnée.</div>
                </div>
              </div>
            </div>
          </section>

          <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
              <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                <span class="text-2xl">♟️</span>
                <h2 class="text-lg font-bold text-slate-900">Tactique Offensive</h2>
              </div>
              <div class="space-y-6">
                <div v-for="(tactic, idx) in getCommonTactics(statsA, statsB)" :key="idx" class="relative group">
                  <div class="flex justify-between text-sm font-bold text-slate-700 mb-2"><span>{{ tactic.name }}</span></div>
                  <div class="flex flex-col gap-1.5">
                    <div class="flex items-center gap-3">
                      <div class="w-full bg-slate-100 rounded-full h-2.5 relative overflow-hidden"><div class="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out" style="background-color: #4F46E5" :style="{width: getPercentMax(tactic.countA, 15) + '%'}"></div></div>
                      <span class="text-xs font-bold text-indigo-700 w-6 text-right">{{ tactic.countA }}</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="w-full bg-slate-100 rounded-full h-2.5 relative overflow-hidden"><div class="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out" style="background-color: #F43F5E" :style="{width: getPercentMax(tactic.countB, 15) + '%'}"></div></div>
                      <span class="text-xs font-bold text-rose-700 w-6 text-right">{{ tactic.countB }}</span>
                    </div>
                  </div>
                </div>
                <div v-if="getCommonTactics(statsA, statsB).length === 0" class="text-center text-slate-400 italic py-4">Aucune donnée tactique.</div>
              </div>
            </div>

            <div class="space-y-6">
              <div class="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-center">
                <h3 class="text-xs font-bold text-slate-400 uppercase mb-4 text-center">Jets de 7m</h3>
                <div class="flex justify-around text-center items-center">
                  <div><div class="text-3xl font-black text-indigo-600">{{ statsA.sambre.penaltiesScored }}<span class="text-lg text-indigo-300 font-medium">/{{ statsA.sambre.penaltiesTotal }}</span></div><div class="text-[10px] font-bold text-slate-400 uppercase mt-1">Match A</div></div>
                  <div class="w-px h-12 bg-slate-100"></div>
                  <div><div class="text-3xl font-black text-rose-500">{{ statsB.sambre.penaltiesScored }}<span class="text-lg text-rose-300 font-medium">/{{ statsB.sambre.penaltiesTotal }}</span></div><div class="text-[10px] font-bold text-slate-400 uppercase mt-1">Match B</div></div>
                </div>
              </div>
              <div class="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-center">
                <h3 class="text-xs font-bold text-slate-400 uppercase mb-4 text-center">Jeu en 6c5</h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center p-3 bg-indigo-50/50 rounded-xl border border-indigo-100"><span class="text-xs font-bold text-indigo-700">Match A</span><span class="text-xl font-black text-indigo-900">{{ statsA.sambre.powerPlayCount }}</span></div>
                  <div class="flex justify-between items-center p-3 bg-rose-50/50 rounded-xl border border-rose-100"><span class="text-xs font-bold text-rose-700">Match B</span><span class="text-xl font-black text-rose-900">{{ statsB.sambre.powerPlayCount }}</span></div>
                </div>
              </div>
            </div>
          </section>

          <section class="bg-gradient-to-br from-white to-indigo-50/30 p-8 rounded-[32px] border border-white shadow-sm">
            <div class="flex items-center gap-3 mb-8">
              <span class="text-2xl">🚀</span><h2 class="text-lg font-bold text-slate-900">Transition & Montée de Balle</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div><div class="text-xs font-bold text-indigo-400 uppercase mb-2">Buts Grand Espace</div><div class="flex justify-center items-end gap-4"><div class="text-4xl font-black text-indigo-600">{{ statsA.sambre.fastBreakGoals }}</div><span class="text-slate-200 text-3xl font-light">/</span><div class="text-4xl font-black text-rose-500">{{ statsB.sambre.fastBreakGoals }}</div></div></div>
              <div><div class="text-xs font-bold text-indigo-400 uppercase mb-2">Encl. Transition</div><div class="flex justify-center items-end gap-4"><div class="text-4xl font-black text-indigo-600">{{ statsA.sambre.transitionCount }}</div><span class="text-slate-200 text-3xl font-light">/</span><div class="text-4xl font-black text-rose-500">{{ statsB.sambre.transitionCount }}</div></div></div>
              <div><div class="text-xs font-bold text-indigo-400 uppercase mb-2">Replis Défensifs</div><div class="flex justify-center items-end gap-4"><div class="text-4xl font-black text-indigo-600">{{ statsA.sambre.repliCount }}</div><span class="text-slate-200 text-3xl font-light">/</span><div class="text-4xl font-black text-rose-500">{{ statsB.sambre.repliCount }}</div></div></div>
            </div>
          </section>

          <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
              <h2 class="text-lg font-bold text-slate-900 mb-6">Systèmes Défensifs</h2>
              <div class="space-y-6">
                <div v-for="sys in ['0-6', '1-5', 'Strict', 'Défense 5 c 6']" :key="sys">
                  <div class="flex justify-between text-xs font-bold text-slate-500 mb-2"><span>{{ sys }}</span></div>
                  <div class="flex h-3.5 rounded-full bg-slate-50 overflow-hidden relative border border-slate-100">
                    <div class="h-full border-r-2 border-white transition-all duration-1000 ease-out" style="background-color: #4F46E5" :style="{width: getDefenseShare(statsA, sys) + '%'}"></div>
                    <div class="h-full transition-all duration-1000 ease-out" style="background-color: #F43F5E" :style="{width: getDefenseShare(statsB, sys) + '%'}"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-center">
              <h2 class="text-lg font-bold text-slate-900 mb-6 text-center">Effectifs Utilisés</h2>
              <div class="grid grid-cols-2 gap-6">
                <div class="bg-indigo-50/50 p-6 rounded-2xl text-center border border-indigo-100"><div class="text-4xl font-black text-indigo-600">{{ Object.keys(statsA.sambre.players).length }}</div><div class="text-xs font-bold text-indigo-400 uppercase mt-2">Joueuses (A)</div></div>
                <div class="bg-rose-50/50 p-6 rounded-2xl text-center border border-rose-100"><div class="text-4xl font-black text-rose-500">{{ Object.keys(statsB.sambre.players).length }}</div><div class="text-xs font-bold text-rose-400 uppercase mt-2">Joueuses (B)</div></div>
              </div>
            </div>
          </section>
        </div>

        <div v-else-if="!isLoading && !isComparisonMode && statsA" key="single" class="space-y-12">

          <div class="max-w-4xl mx-auto">
            <ScoreboardCard :stats="statsA" color="#4F46E5" letter="A" class="shadow-xl shadow-indigo-100/50" />
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div class="space-y-8">
              <div class="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 text-center">Lieu Pertes de Balle</h3>
                <div class="relative w-56 h-56 mb-8 group cursor-default">
                  <div class="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <div class="relative w-full h-full rounded-full shadow-inner overflow-hidden" :style="{ background: getConicGradient(formatPieData(statsA.sambre.turnoverZones, 'indigo')) }">
                    <div class="absolute inset-0 m-auto w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-xl">
                      <span class="text-4xl font-black text-slate-800">{{ statsA.sambre.turnovers }}</span>
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">Total</span>
                    </div>
                  </div>
                </div>
                <div class="w-full space-y-3">
                  <div v-for="(slice, idx) in formatPieData(statsA.sambre.turnoverZones, 'indigo').slice(0,4)" :key="idx" class="flex items-center justify-between text-sm px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-default">
                    <div class="flex items-center gap-3">
                      <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: slice.color }"></span>
                      <span class="text-slate-600 font-medium">{{ slice.label }}</span>
                    </div>
                    <span class="font-bold text-slate-900">{{ slice.percent }}%</span>
                  </div>
                </div>
              </div>

              <div class="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Défense</h3>
                <div class="space-y-5">
                  <div v-for="sys in ['0-6', '1-5', 'Strict', 'Défense 5 c 6']" :key="sys">
                    <div class="flex justify-between text-xs font-bold text-slate-600 mb-2"><span>{{ sys }}</span><span class="text-indigo-600">{{ Math.round(getDefenseShare(statsA, sys)) }}%</span></div>
                    <div class="flex h-2.5 rounded-full bg-slate-50 overflow-hidden relative border border-slate-100">
                      <div class="h-full rounded-full transition-all duration-1000 ease-out" style="background-color: #4F46E5" :style="{width: getDefenseShare(statsA, sys) + '%'}"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="lg:col-span-2 bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-fit">
              <div class="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 class="font-bold text-slate-800 text-lg">Statistiques Individuelles</h3>
                <span class="px-3 py-1 bg-white border border-slate-100 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                  {{ Object.keys(statsA.sambre.players).length }} Joueuses
                </span>
              </div>
              <div class="overflow-x-auto flex-1">
                <table class="w-full text-sm text-left">
                  <thead class="text-xs text-slate-400 uppercase bg-slate-50/50">
                  <tr>
                    <th class="px-6 py-4 font-bold tracking-wider">Joueuse</th>
                    <th class="px-4 py-4 text-center font-bold tracking-wider">Buts / Tirs</th>
                    <th class="px-4 py-4 text-center font-bold tracking-wider">Efficacité</th>
                    <th class="px-4 py-4 text-center font-bold tracking-wider text-blue-500">P.D</th>
                    <th class="px-4 py-4 text-center font-bold tracking-wider text-rose-500">Pertes</th>
                  </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                  <tr v-for="p in sortedPlayers(statsA.sambre.players)" :key="p.name" class="hover:bg-indigo-50/30 transition-colors group">
                    <td class="px-6 py-4 font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">{{ p.name }}</td>
                    <td class="px-4 py-4 text-center font-medium text-slate-600">{{ p.goals }} <span class="text-slate-300 mx-1">/</span> {{ p.shots }}</td>
                    <td class="px-4 py-4 text-center">
                        <span class="inline-block px-2 py-1 rounded font-bold text-xs transition-transform hover:scale-105" :class="getEfficiencyClass(p.goals, p.shots)">
                          {{ p.shots > 0 ? Math.round((p.goals/p.shots)*100) : 0 }}%
                        </span>
                    </td>
                    <td class="px-4 py-4 text-center font-bold text-blue-600 bg-blue-50/10">{{ p.assists }}</td>
                    <td class="px-4 py-4 text-center font-bold text-rose-500 bg-rose-50/10">{{ p.turnovers }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
              <h3 class="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-6">Tactiques Offensives</h3>
              <div class="flex flex-wrap gap-3">
                <div v-for="(count, name) in statsA.sambre.tactics" :key="name" class="px-4 py-2 bg-slate-50 rounded-full border border-slate-100 text-xs font-medium flex items-center gap-2 hover:bg-white hover:shadow-sm transition-all">
                  <span class="text-slate-600">{{ name }}</span>
                  <span class="bg-indigo-600 text-white px-2 py-0.5 rounded-md font-bold text-[10px]">{{ count }}</span>
                </div>
              </div>
            </div>
            <div class="bg-indigo-50/50 p-8 rounded-[24px] border border-indigo-100 shadow-sm flex justify-around items-center">
              <div class="text-center"><div class="text-4xl font-black text-indigo-700 mb-1">{{ statsA.sambre.fastBreakGoals }}</div><div class="text-[10px] uppercase font-bold text-indigo-400">Buts Gd Espace</div></div>
              <div class="w-px h-16 bg-indigo-200"></div>
              <div class="text-center"><div class="text-4xl font-black text-indigo-700 mb-1">{{ statsA.sambre.transitionCount }}</div><div class="text-[10px] uppercase font-bold text-indigo-400">Encl. Transition</div></div>
              <div class="w-px h-16 bg-indigo-200"></div>
              <div class="text-center"><div class="text-4xl font-black text-indigo-700 mb-1">{{ statsA.sambre.penaltiesScored }}<span class="text-lg text-indigo-400 font-normal">/{{ statsA.sambre.penaltiesTotal }}</span></div><div class="text-[10px] uppercase font-bold text-indigo-400">Jets 7m</div></div>
            </div>
          </div>

        </div>

        <div v-else-if="!isLoading" key="empty" class="flex flex-col items-center justify-center py-32 opacity-50 select-none animate-fade-in-up">
          <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <span class="text-4xl grayscale">📊</span>
          </div>
          <p class="text-xl font-bold text-slate-900 mb-2">Prêt à analyser ?</p>
          <p class="text-slate-500">Sélectionnez un match ci-dessus pour lancer le rapport.</p>
        </div>

      </Transition>

    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// --- STATE ---
const apiUrl = "http://localhost:8080"
const isComparisonMode = ref(false)
const matches = ref<Match[]>([])
const allEvents = ref<Evenement[]>([])
const selectedMatchA = ref<number | null>(null)
const selectedMatchB = ref<number | null>(null)
const isLoading = ref(false)
const SAMBRE_GKS = ['JUSTICIA', 'ALIX']

// --- ACTIONS ---
function enableComparison() {
  isComparisonMode.value = true
}

// --- SCOREBOARD COMPONENT (Inlined) ---
const ScoreboardCard = {
  props: ['stats', 'color', 'letter'],
  template: `
    <div class="relative overflow-hidden rounded-[24px] bg-white border border-slate-100 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 duration-300 group">
      <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-50" :style="{ color: color }"></div>

      <div class="p-8">
        <div class="flex justify-between items-start mb-8">
          <div class="flex items-center gap-4">
            <div class="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-current/30 transform group-hover:scale-110 transition-transform duration-500" :style="{ backgroundColor: color }">
              {{ letter }}
            </div>
            <div>
              <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span> {{ stats.matchDate }}
              </div>
              <div class="font-bold text-slate-900 text-lg leading-tight">{{ stats.matchLabel }}</div>
            </div>
          </div>
          <div class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm transform group-hover:scale-105 transition-transform" :style="getResultStyle(stats.result)">
            {{ stats.result }}
          </div>
        </div>

        <div class="text-center py-4 mb-8 relative">
          <div class="text-6xl sm:text-8xl font-black tracking-tighter text-slate-900 flex justify-center items-center gap-4 drop-shadow-sm">
            {{ stats.sambre.goals }}
            <span class="text-3xl font-light text-slate-200">/</span>
            <span class="text-slate-400 font-bold text-4xl">{{ stats.opponent.goals }}</span>
          </div>
          <div class="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">Score Final</div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div class="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 group-hover:border-slate-200 transition-colors">
            <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">Tirs</div>
            <div class="text-2xl font-black text-slate-800">{{ stats.sambre.shots }}</div>
          </div>
          <div class="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 group-hover:border-slate-200 transition-colors">
            <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">Efficacité</div>
            <div class="text-2xl font-black" :style="{ color: color }">{{ stats.sambre.efficiency }}%</div>
          </div>
          <div class="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 group-hover:border-slate-200 transition-colors">
            <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">Pertes</div>
            <div class="text-2xl font-black text-rose-500">{{ stats.sambre.turnovers }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  methods: {
    getResultStyle(res: string) {
      if (res === 'Victoire') return { backgroundColor: '#ECFDF5', color: '#047857' };
      if (res === 'Défaite') return { backgroundColor: '#FFF1F2', color: '#BE123C' };
      return { backgroundColor: '#F8FAFC', color: '#64748B' };
    }
  }
}

// --- LOGIC ---
interface Match { id: number; adversaire: string; dateMatch: string; }
interface Evenement { id: number; matchId: number; nom: string; joueuse: string; defense: string; resultat: string; attaqueplacees: string; jets7m: string; grandespace: string; repli: string; secteur: string; passed: string; defenseplus: string; defensemoins: string; enclenchements06: string; enclenchements6c5: string; enclenchementstransier: string; lieupb: string; }
interface PlayerStats { name: string; goals: number; shots: number; assists: number; turnovers: number; }
interface StatsTeam { goals: number; shots: number; efficiency: number; assists: number; turnovers: number; turnoverZones: Record<string, number>; players: Record<string, PlayerStats>; goalkeepers: Record<string, { saves: number }>; tactics: Record<string, number>; penaltiesScored: number; penaltiesTotal: number; powerPlayCount: number; fastBreakGoals: number; transitionCount: number; repliCount: number; defenseSystems: Record<string, number>; }
interface MatchAnalysis { matchId: number; matchLabel: string; matchDate: string; result: string; sambre: StatsTeam; opponent: { goals: number; }; }

async function fetchData() {
  isLoading.value = true
  try {
    const [rM, rE] = await Promise.all([fetch(`${apiUrl}/match`), fetch(`${apiUrl}/evenement`)])
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
  const stats: StatsTeam = { goals: 0, shots: 0, efficiency: 0, assists: 0, turnovers: 0, turnoverZones: {}, players: {}, goalkeepers: {}, tactics: {}, penaltiesScored: 0, penaltiesTotal: 0, powerPlayCount: 0, fastBreakGoals: 0, transitionCount: 0, repliCount: 0, defenseSystems: {} }
  const opp = { goals: 0 }

  evts.forEach(e => {
    const nom = normalize(e.nom), res = normalize(e.resultat); let player = normalize(e.joueuse).toUpperCase()
    if(player && !stats.players[player] && !SAMBRE_GKS.includes(player)) stats.players[player] = { name: player, goals: 0, shots: 0, assists: 0, turnovers: 0 }

    if (nom.startsWith('0-6') || nom.startsWith('1-5') || nom.startsWith('Déf') || nom.startsWith('Repli') || nom.includes('7m Adversaires')) {
      if (res === 'But') opp.goals++
      const defSys = normalize(e.defense) || (nom.startsWith('0-6') ? '0-6' : nom.startsWith('1-5') ? '1-5' : '')
      if(defSys) { const k = ['0-6', '1-5', 'Strict'].find(d => defSys.includes(d)) || 'Autre'; stats.defenseSystems[k] = (stats.defenseSystems[k] || 0) + 1 }
    } else {
      if (['But', 'Ar GB', 'HC', 'tir raté NC', 'Poteau', 'Tir'].includes(res)) {
        stats.shots++; if(player && stats.players[player]) stats.players[player].shots++
        if (res === 'But') { stats.goals++; if(player && stats.players[player]) stats.players[player].goals++ }
        if (normalize(e.grandespace)) stats.fastBreakGoals++
        if (normalize(e.jets7m).includes('Equipe à analyser')) stats.penaltiesTotal++
        if (normalize(e.jets7m).includes('Equipe à analyser') && res === 'But') stats.penaltiesScored++
      }
      if (normalize(e.passed)) { stats.assists++; if(player && stats.players[player]) stats.players[player].assists++ }
      if (['PDB', 'Marcher', 'Passage en force'].includes(res)) {
        stats.turnovers++; if(player && stats.players[player]) stats.players[player].turnovers++
        const lieu = normalize(e.lieupb) || "Zone Inconnue"; stats.turnoverZones[lieu] = (stats.turnoverZones[lieu] || 0) + 1
      }
      const tac = normalize(e.enclenchements06); if (tac) stats.tactics[tac] = (stats.tactics[tac] || 0) + 1
      if (normalize(e.enclenchements6c5)) stats.powerPlayCount++
      if (normalize(e.enclenchementstransier)) stats.transitionCount++
    }
    if (normalize(e.repli)) stats.repliCount++
  })
  stats.efficiency = stats.shots > 0 ? Math.round((stats.goals/stats.shots)*100) : 0
  let result = 'Nul'; if (stats.goals > opp.goals) result = 'Victoire'; else if (stats.goals < opp.goals) result = 'Défaite';
  return { matchId, matchLabel: m.adversaire || `Adversaire`, matchDate: new Date(m.dateMatch).toLocaleDateString('fr-FR'), result, sambre: stats, opponent: opp }
}

const statsA = computed(() => selectedMatchA.value ? computeStats(selectedMatchA.value) : null)
const statsB = computed(() => selectedMatchB.value ? computeStats(selectedMatchB.value) : null)

// --- HELPERS ---
function sortedPlayers(players: Record<string, PlayerStats>) { return Object.values(players).sort((a,b) => b.goals - a.goals) }
function formatPieData(zones: Record<string, number>, theme: string) {
  const c = theme === 'indigo' ? ['#4F46E5', '#818CF8', '#A5B4FC', '#C7D2FE'] : ['#F43F5E', '#FB7185', '#FDA4AF', '#FECDD3'];
  const total = Object.values(zones).reduce((a,b) => a+b, 0);
  return Object.entries(zones).map(([label, value], i) => ({ label, value, percent: total>0?Math.round((value/total)*100):0, color: c[i%c.length] })).sort((a,b)=>b.value-a.value)
}
function getConicGradient(data: any[]) {
  if(!data.length) return '#f1f5f9'; let g = 'conic-gradient(', d = 0;
  data.forEach((s, i) => { const deg = (s.percent/100)*360; g += `${s.color} ${d}deg ${d+deg}deg${i<data.length-1?', ':''}`; d += deg; })
  return g + ')';
}
function getEfficiencyClass(g: number, s: number) {
  const r = s>0?g/s:0; if(r>=0.75) return 'bg-emerald-100 text-emerald-700'; if(r>=0.5) return 'bg-blue-50 text-blue-600'; return 'bg-orange-50 text-orange-600';
}
function formatDate(d: string) { return d ? new Date(d).toLocaleDateString('fr-FR', {day:'numeric', month:'short'}) : '' }
function getCommonTactics(sA: MatchAnalysis, sB: MatchAnalysis) { const all = new Set([...Object.keys(sA.sambre.tactics), ...Object.keys(sB.sambre.tactics)]); return Array.from(all).map(k => ({ name: k, countA: sA.sambre.tactics[k]||0, countB: sB.sambre.tactics[k]||0 })).sort((a,b)=>(b.countA+b.countB)-(a.countA+a.countB)).slice(0,6) }
function getPercentMax(val: number, max: number) { return Math.min((val/max)*100, 100) }
function getDefenseShare(stat: MatchAnalysis, sys: string) { const total = Object.values(stat.sambre.defenseSystems).reduce((a,b)=>a+b,0); const val = stat.sambre.defenseSystems[sys] || 0; return total > 0 ? (val/total)*100 : 0 }

onMounted(() => fetchData())
</script>

<style scoped>
/* Animations Custom */
.animate-fade-in-down { animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

.animate-pop-in { animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; opacity: 0; transform: scale(0.8) translateX(-50%) translateY(-50%); }
@keyframes popIn { to { opacity: 1; transform: scale(1) translateX(-50%) translateY(-50%); } }

.animate-fade-in-left { animation: fadeInLeft 0.6s ease-out forwards; opacity: 0; transform: translateX(-20px); }
@keyframes fadeInLeft { to { opacity: 1; transform: translateX(0); } }

.animate-fade-in-right { animation: fadeInRight 0.6s ease-out forwards; opacity: 0; transform: translateX(20px); }
@keyframes fadeInRight { to { opacity: 1; transform: translateX(0); } }

.animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; transform: translateY(20px); }
@keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }

.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }

/* Transitions Vue */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(20px); }
</style>