<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-purple-700">Joueuse 1</h1>
      <span class="px-3 py-1 text-sm bg-green-100 text-green-600 rounded-full">Active</span>
    </div>

    <!-- Stats top -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white shadow rounded-xl p-4 text-center">
        <p class="text-2xl font-bold text-purple-700">45</p>
        <p class="text-gray-500 text-sm">Buts</p>
      </div>
      <div class="bg-white shadow rounded-xl p-4 text-center">
        <p class="text-2xl font-bold text-purple-700">28</p>
        <p class="text-gray-500 text-sm">Attaques</p>
      </div>
      <div class="bg-white shadow rounded-xl p-4 text-center">
        <p class="text-2xl font-bold text-purple-700">0</p>
        <p class="text-gray-500 text-sm">Arrêts</p>
      </div>
      <div class="bg-white shadow rounded-xl p-4 text-center">
        <p class="text-2xl font-bold text-purple-700">12</p>
        <p class="text-gray-500 text-sm">Cartons reçus</p>
      </div>
    </div>

    <!-- Bottom sections -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Statistiques offensives -->
      <div class="bg-white shadow rounded-xl p-4">
        <h2 class="font-semibold text-gray-700 mb-3">Statistiques offensives</h2>
        <ul class="space-y-2 text-sm text-gray-600">
          <li>Buts inscrits: 45</li>
          <li>Tirs: 28</li>
          <li>Passes décisives: 12</li>
          <li>Dribbles réussis: 7</li>
        </ul>
      </div>

      <!-- Statistiques défensives -->
      <div class="bg-white shadow rounded-xl p-4">
        <h2 class="font-semibold text-gray-700 mb-3">Statistiques défensives</h2>
        <ul class="space-y-2 text-sm text-gray-600">
          <li>Arrêts: 0</li>
          <li>Actions défensives: 9</li>
          <li>Interceptions: 25</li>
        </ul>
      </div>

      <!-- Discipline -->
      <div class="bg-white shadow rounded-xl p-4">
        <h2 class="font-semibold text-gray-700 mb-3">Discipline</h2>
        <ul class="space-y-2 text-sm text-gray-600">
          <li>Cartons rouges: 1</li>
          <li>Cartons jaunes: 3</li>
          <li>Sanctions reçues: 2</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Joueuse",
};
</script>

<style scoped>
/* Optionnel : ajustements spécifiques */
</style>
