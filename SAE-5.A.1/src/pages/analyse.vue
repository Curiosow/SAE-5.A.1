<template>
  <main class="min-h-screen relative overflow-hidden bg-gray-900 text-white font-sans">
    <!-- LUEURS ROSES ANIMÉES -->
    <div
        class="pointer-events-none fixed inset-0 z-0 animate-light1"
        style="background: radial-gradient(ellipse at 70% 10%, #ec4899 0%, transparent 70%);
             filter: blur(120px); opacity: 0.35; mix-blend: screen;"
    />
    <div
        class="pointer-events-none fixed inset-0 z-0 animate-light2"
        style="background: radial-gradient(ellipse at 20% 80%, #ec4899 0%, transparent 70%);
             filter: blur(140px); opacity: 0.25; mix-blend: screen;"
    />
    <div
        class="pointer-events-none fixed inset-0 z-0 animate-light3"
        style="background: radial-gradient(ellipse at 50% 50%, #ec4899 0%, transparent 70%);
             filter: blur(100px); opacity: 0.18; mix-blend: screen;"
    />

    <!-- PARTICULES FINES ANIMÉES -->
    <div
        v-for="n in PARTICLE_COUNT"
        :key="n"
        class="pointer-events-none fixed z-10 rounded-full bg-white"
        :class="[
        n % 7 === 0 ? 'w-[3px] h-[3px]' : 'w-[2px] h-[2px]',
        positions[(n - 1) % positions.length],
        animations[n % animations.length],
        n % 4 === 0 ? 'animate-twinkle' : '',
        'opacity-70'
      ]"
        :style="{
        animationDelay: `${(n % 5) * 1.2}s`,
        animationDuration: `${8 + (n % 5) * 0.8}s`,
        filter: n % 6 === 0 ? 'blur(0.4px)' : 'none'
      }"
    />

    <!-- CONTENU ANALYSES -->
    <div class="relative z-20 max-w-6xl mx-auto p-6">
      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-3xl font-bold">Analyses avancées</h1>
        <p class="text-white/70">Analyse complète des performances et interactions détaillées</p>
      </div>

      <!-- Filtres -->
      <div class="flex flex-wrap gap-4 mb-10">
        <select class="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-4 py-2 text-white">
          <option>Équipe Horaire</option>
        </select>
        <select class="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-4 py-2 text-white">
          <option>2024-25</option>
        </select>
      </div>

      <!-- Statistiques principales -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div
            v-for="(stat, i) in mainStats"
            :key="i"
            class="p-8 rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30 text-center
                 transition-all duration-300 ease-in-out hover:scale-[1.02]"
        >
          <p class="text-2xl font-bold text-pink-400">{{ stat.value }}</p>
          <p class="text-white/80 mt-2">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Onglets -->
      <div class="flex gap-4 mb-10">
        <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            class="px-5 py-2 rounded-xl border transition-all duration-300"
            :class="activeTab === tab
            ? 'bg-pink-500/30 border-pink-400 text-pink-200 shadow-lg scale-[1.05]'
            : 'bg-white/10 border-white/20 text-white/70 hover:text-white hover:scale-[1.02]'"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Contenu onglets -->
      <div v-if="activeTab === 'Performances'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-8 rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30">
          <h2 class="text-pink-300 font-semibold mb-4">Tendances des performances</h2>
          <p class="text-white/70">Graphique ou données de tendance ici.</p>
        </div>
        <div class="p-8 rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30">
          <h2 class="text-pink-300 font-semibold mb-4">Indicateurs spécifiques au handball</h2>
          <ul class="space-y-3 text-sm">
            <li class="flex justify-between">
              <span>Ratio tirs au but</span>
              <span>83%</span>
            </li>
            <li class="flex justify-between">
              <span>Contre-attaques réussies</span>
              <span>76%</span>
            </li>
            <li class="flex justify-between">
              <span>Efficacité défensive</span>
              <span>69%</span>
            </li>
            <li class="flex justify-between">
              <span>Précision des passes</span>
              <span>92%</span>
            </li>
          </ul>
        </div>
      </div>

      <div v-else-if="activeTab === 'Joueuses'">
        <div class="p-10 rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30">
          <h2 class="text-pink-300 text-lg font-semibold mb-4">Joueuses</h2>
          <p class="text-white/80">Comparaison des joueuses ici.</p>
        </div>
      </div>

      <div v-else-if="activeTab === 'Tactiques'">
        <div class="p-10 rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30">
          <h2 class="text-pink-300 text-lg font-semibold mb-4">Tactiques</h2>
          <p class="text-white/80">Analyse tactique en cours...</p>
        </div>
      </div>

      <div v-else-if="activeTab === 'Prédictions'">
        <div class="p-10 rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30">
          <h2 class="text-pink-300 text-lg font-semibold mb-4">Prédictions</h2>
          <p class="text-white/80">Prédictions des résultats futurs.</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const PARTICLE_COUNT = 36

const positions = [
  'top-10 left-10',
  'top-20 left-1/3',
  'top-1/2 left-1/4',
  'top-1/3 left-1/2',
  'top-2/3 left-1/5',
  'top-1/4 left-3/4',
  'top-3/4 left-1/6',
  'top-1/5 left-2/3',
  'top-2/5 left-1/2',
  'top-3/5 left-1/3',
  'top-4/5 left-1/4',
  'top-1/6 left-3/5',
  'top-5/6 left-1/2',
]

const animations = ['animate-float1', 'animate-float2', 'animate-float3']

const mainStats = [
  { label: 'Indice tactique', value: 'N/A' },
  { label: 'Probabilité de victoire', value: 'N/A' },
  { label: 'Réussite offensive', value: '87.3%' },
  { label: 'Adaptabilité tactique', value: '92.1%' },
]

const tabs = ['Performances', 'Joueuses', 'Tactiques', 'Prédictions']
let activeTab = $ref('Performances')
</script>

<style scoped>
.will-change-transform {
  will-change: transform, opacity;
}
</style>
