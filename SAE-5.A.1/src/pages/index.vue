<template>
  <main class="min-h-screen relative overflow-hidden bg-rose-100">
    <!-- LUEURS ROSES ANIMÉES -->
    <div
        class="pointer-events-none fixed inset-0 z-0 animate-light1 will-change-transform"
        style="background: radial-gradient(ellipse at 70% 10%, #ec4899 0%, transparent 70%); filter: blur(120px); opacity: 0.35; mix-blend: screen;"
    />
    <div
        class="pointer-events-none fixed inset-0 z-0 animate-light2 will-change-transform"
        style="background: radial-gradient(ellipse at 20% 80%, #ec4899 0%, transparent 70%); filter: blur(140px); opacity: 0.25; mix-blend: screen;"
    />
    <div
        class="pointer-events-none fixed inset-0 z-0 animate-light3 will-change-transform"
        style="background: radial-gradient(ellipse at 50% 50%, #ec4899 0%, transparent 70%); filter: blur(100px); opacity: 0.18; mix-blend: screen;"
    />

    <!-- PARTICULES FINES ANIMÉES -->
    <div
        v-for="n in PARTICLE_COUNT"
        :key="n"
        class="pointer-events-none fixed z-10 rounded-full bg-white will-change-transform"
        :class="[
        // tailles aléatoires légères pour la profondeur
        n % 7 === 0 ? 'w-[3px] h-[3px]' : 'w-[2px] h-[2px]',
        // positions de départ
        positions[(n - 1) % positions.length],
        // variantes d'animations pour éviter l'effet trop uniforme
        animations[n % animations.length],
        // scintillement occasionnel
        n % 4 === 0 ? 'animate-twinkle' : '',
        // légère transparence
        'opacity-70'
      ]"
        :style="{
        // décalage de départ pour désynchroniser les cycles
        animationDelay: `${(n % 5) * 1.2}s`,
        // petite variation de vitesse
        animationDuration: `${8 + (n % 5) * 0.8}s`,
        // un soupçon de flou pour certaines particules
        filter: n % 6 === 0 ? 'blur(0.4px)' : 'none'
      }"
    />
  </main>
</template>

<script setup lang="ts">
/**
 * Particules : on place quelques ancres réutilisables sur le viewport
 * pour couvrir suffisamment la page (les particules sont fixed).
 */
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
  'top-1/7 left-2/5',
  'top-2/7 left-3/4',
  'top-3/7 left-1/3',
  'top-4/7 left-1/2',
  'top-5/7 left-1/4',
  'top-6/7 left-1/5',
  'top-1/8 left-1/6',
  // densité supplémentaire
  'top-[12%] left-[78%]',
  'top-[28%] left-[12%]',
  'top-[46%] left-[66%]',
  'top-[72%] left-[28%]',
  'top-[84%] left-[54%]',
  'top-[38%] left-[84%]',
]

/**
 * Variantes d’animations pour des mouvements organiques.
 * (définies dans tailwind.config.js)
 */
const animations = ['animate-float1', 'animate-float2', 'animate-float3']
</script>

<style scoped>
/* Hint perf pour le moteur de rendu */
.will-change-transform {
  will-change: transform, opacity;
}
</style>