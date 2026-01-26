<script setup lang="ts">
// Aucun script nécessaire pour ce footer simple
</script>

<template>
  <span class="w-full py-4 bg-pink/100 backdrop-blur-md backdrop-saturate-180 rounded-t-2xl shadow-lg text-center text-gray-900 font-medium fixed bottom-0 left-0 z-50">
    © 2026 Sambre Avesnois HandBall - Proposé par l'IUT de Maubeuge. Tous droits réservés.
  </span>
</template>

<style scoped>
.liquid-glass-footer {
  width: 100%;
  padding: 1rem 0;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  border-radius: 16px 16px 0 0;
  box-shadow: 0 4px 32px rgba(0,0,0,0.08);
  text-align: center;
  color: #222;
  font-weight: 500;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
}
</style>