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

    <!-- CONTENU JOUEUSE -->
    <div class="relative z-20 max-w-6xl mx-auto p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-10">
        <h1 class="text-3xl font-bold">Joueuse 1</h1>
        <span class="px-3 py-1 text-sm bg-green-400/20 text-green-300 rounded-full border border-green-400/40">
          Active
        </span>
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

      <!-- Contenu selon onglet -->
      <div v-if="activeTab === 'Performances'">
        <!-- Stats top -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div
              v-for="(stat, i) in topStats"
              :key="i"
              class="p-8 rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30 text-center
                   transition-all duration-300 ease-in-out hover:scale-[1.02]"
          >
            <p class="text-3xl font-bold text-pink-400">{{ stat.value }}</p>
            <p class="text-white/80 mt-2">{{ stat.label }}</p>
          </div>
        </div>

        <!-- Bottom sections -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
              v-for="(section, i) in bottomSections"
              :key="i"
              class="p-8 rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30
                   transition-all duration-300 ease-in-out hover:scale-[1.01]"
          >
            <h2 class="font-semibold text-lg text-pink-300 mb-4">{{ section.title }}</h2>
            <ul class="space-y-2 text-sm text-white/90">
              <li v-for="(item, j) in section.items" :key="j">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'Pénalités'">
        <div class="p-10 rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30">
          <h2 class="text-pink-300 text-lg font-semibold mb-4">Pénalités</h2>
          <p class="text-white/80">Aucune pénalité enregistrée.</p>
        </div>
      </div>

      <div v-else-if="activeTab === 'Assists'">
        <div class="p-10 rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30">
          <h2 class="text-pink-300 text-lg font-semibold mb-4">Assists</h2>
          <p class="text-white/80">Passes décisives : 12</p>
        </div>
      </div>

      <div v-else-if="activeTab === 'Discipline'">
        <div class="p-10 rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30">
          <h2 class="text-pink-300 text-lg font-semibold mb-4">Discipline</h2>
          <ul class="text-white/90 space-y-2">
            <li>Cartons rouges : 1</li>
            <li>Cartons jaunes : 3</li>
            <li>Sanctions reçues : 2</li>
          </ul>
        </div>
      </div>

      <div v-else-if="activeTab === 'Ton Mvp'">
        <div class="p-10 rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30">
          <h2 class="text-pink-300 text-lg font-semibold mb-4">MVP</h2>
          <p class="text-white/80">Meilleure performance à venir 🔥</p>
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

const tabs = ['Performances', 'Pénalités', 'Assists', 'Discipline', 'Ton Mvp']
let activeTab = $ref('Performances')

const topStats = [
  { label: 'Buts', value: 45 },
  { label: 'Attaques', value: 28 },
  { label: 'Arrêts', value: 0 },
  { label: 'Cartons reçus', value: 12 },
]

const bottomSections = [
  {
    title: 'Statistiques offensives',
    items: ['Buts inscrits: 45', 'Tirs: 28', 'Passes décisives: 12', 'Dribbles réussis: 7'],
  },
  {
    title: 'Statistiques défensives',
    items: ['Arrêts: 0', 'Actions défensives: 9', 'Interceptions: 25'],
  },
  {
    title: 'Discipline',
    items: ['Cartons rouges: 1', 'Cartons jaunes: 3', 'Sanctions reçues: 2'],
  },
]
</script>

<style scoped>
.will-change-transform {
  will-change: transform, opacity;
}
</style>
