<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const open = ref(false)
const scrolled = ref(false)

const onScroll = () => {
  scrolled.value = window.scrollY > 6
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

const navItems = [
  { label: 'Accueil', href: '#' },
  { label: 'Joueuses', href: '#' },
  { label: 'Stats Équipe', href: '#' },
  { label: 'Heatmaps', href: '#' },
]
</script>

<template>
  <!-- Header fixé, fond transparent pour laisser passer les lueurs -->
  <header class="fixed inset-x-0 top-0 z-50">
    <!-- Barrette “verre liquide” -->
    <div
        class="liquid-glass mx-auto mt-3 w-[min(94%,1200px)] rounded-2xl px-4 sm:px-6"
        :class="scrolled ? 'glass-scrolled' : 'glass-top'"
        role="navigation"
        aria-label="Global"
    >
      <nav class="flex h-14 items-center justify-between">
        <!-- Logo -->
        <div class="flex min-w-0 flex-1 items-center gap-3">
          <a href="#" class="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-xl">
            <img
                src="/Sambre-Avesnois-Logo-1-e1739525613932.png"
                alt="Sambre Avesnois Handball"
                class="h-8 w-auto"
                loading="eager"
                decoding="async"
            />
          </a>

          <!-- Séparateur subtil -->
          <span class="hidden sm:inline-block h-5 w-px bg-white/10"></span>

          <!-- Breadcrumb / titre (optionnel) -->
          <span class="hidden min-w-0 truncate text-sm text-white/70 sm:block">
            Dashboard Handball
          </span>
        </div>

        <!-- Desktop nav -->
        <div class="hidden lg:flex items-center gap-3">
          <a
              v-for="item in navItems"
              :key="item.label"
              :href="item.href"
              class="seg-link relative text-sm font-medium text-white/90 transition-colors px-3 py-1.5 rounded-full"
          >
            <span class="relative z-[1]">{{ item.label }}</span>
          </a>
        </div>

        <!-- Actions -->
        <div class="hidden lg:flex min-w-0 flex-1 justify-end items-center gap-3">
          <a
              href="#"
              class="seg-link relative text-sm font-medium text-white/90 transition-colors px-3 py-1.5 rounded-full"
          >
            <span class="relative z-[1]">Connexion</span>
          </a>
          <a
              href="#"
              class="rounded-xl bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm
                   ring-1 ring-white/15 hover:bg-white/15 transition"
          >
            Créer un compte
          </a>
        </div>

        <!-- Mobile menu button -->
        <button
            type="button"
            class="lg:hidden inline-flex items-center justify-center rounded-xl p-2 text-white hover:bg-white/10
                 ring-1 ring-white/15 backdrop-blur-sm transition"
            :aria-expanded="open"
            aria-controls="mobile-menu"
            @click="open = !open"
        >
          <span class="sr-only">Ouvrir le menu</span>
          <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="1.5" class="size-6">
            <path d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="1.5" class="size-6">
            <path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </nav>
    </div>

    <!-- Overlay mobile -->
    <div
        class="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity lg:hidden"
        :class="open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
        @click="open = false"
        aria-hidden="true"
    />

    <!-- Panneau mobile -->
    <div
        id="mobile-menu"
        class="fixed right-0 top-0 z-50 h-full w-full max-w-sm p-4 sm:p-6
             transition-transform duration-300 ease-out lg:hidden"
        :class="open ? 'translate-x-0' : 'translate-x-full'"
        role="dialog"
        aria-modal="true"
    >
      <div class="liquid-glass h-full rounded-l-2xl p-6 glass-scrolled">
        <div class="flex items-center justify-between">
          <a href="#" class="focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-xl">
            <img
                src="/Sambre-Avesnois-Logo-1-e1739525613932.png"
                alt="Sambre Avesnois Handball"
                class="h-8 w-auto"
                loading="eager"
                decoding="async"
            />
          </a>
          <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl p-2 text-white hover:bg-white/10
                   ring-1 ring-white/15 backdrop-blur-sm transition"
              @click="open = false"
          >
            <span class="sr-only">Fermer</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="1.5" class="size-6">
              <path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="mt-8 space-y-2">
          <a
              v-for="item in navItems"
              :key="item.label"
              :href="item.href"
              class="seg-link block relative text-base font-medium text-white/90 transition-colors px-4 py-2 rounded-full w-full"
              @click="open = false"
          >
            <span class="relative z-[1]">{{ item.label }}</span>
          </a>
        </div>

        <div class="mt-8 border-t border-white/10 pt-6 space-y-3">
          <a href="#" class="block rounded-xl px-4 py-3 text-base font-semibold text-white/90 hover:text-white
                             hover:bg-white/10 ring-1 ring-transparent hover:ring-white/10 transition">
            Connexion
          </a>
          <a
              href="#"
              class="block rounded-xl bg-white/10 px-4 py-3 text-base font-semibold text-white
                   backdrop-blur-sm ring-1 ring-white/15 hover:bg-white/15 transition"
          >
            Créer un compte
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Base “liquid glass” de la barre */
.liquid-glass {
  position: relative;
  background: rgba(20, 20, 22, 0.18);
  backdrop-filter: blur(18px) saturate(120%);
  -webkit-backdrop-filter: blur(18px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.glass-top {
  background: rgba(20, 20, 22, 0.14);
  border-color: rgba(255, 255, 255, 0.10);
}

.glass-scrolled {
  background: rgba(20, 20, 22, 0.22);
  border-color: rgba(255, 255, 255, 0.14);
}

/* Highlight glossy sur la barre */
.liquid-glass::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
      linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0.16),
          rgba(255, 255, 255, 0.06) 30%,
          rgba(255, 255, 255, 0.02) 60%,
          transparent 100%
      );
  mask: linear-gradient(to bottom, black 0%, black 60%, transparent 100%);
  pointer-events: none;
}

/* Grain très léger */
.liquid-glass::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-image: radial-gradient(rgba(255,255,255,0.06) 0.5px, transparent 0.6px);
  background-size: 12px 12px;
  opacity: 0.25;
  mix-blend-mode: overlay;
  pointer-events: none;
}

/* ========= PASTILLE "LIQUID GLASS" SUR LES LIENS (façon Apple) ========= */
.seg-link {
  position: relative;
  border-radius: 9999px;
  transition: color .25s ease, transform .25s ease;
}

/* Pastille inactive (invisible) — on prépare la zone de blur sans teinte visible */
.seg-link::before {
  content: "";
  position: absolute;
  inset: -2px;                 /* léger débord pour souligner le contour */
  border-radius: inherit;

  /* ⚠️ Clé du rendu “liquid”: blur + saturate, pas de gris par-dessus */
  background: rgba(255, 255, 255, 0.01);          /* alpha minimale pour activer le backdrop */
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);

  /* Bordure & relief très subtils, sans teinter l’intérieur */
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),     /* léger liseré interne haut */
      0 4px 16px rgba(0, 0, 0, 0.30);

  opacity: 0;
  transform: translateZ(0) scale(0.98);
  transition: opacity .25s ease, transform .25s ease, box-shadow .25s ease, border-color .25s ease;
  z-index: 0;
}

/* On retire totalement le voile gris/gradient précédent */
.seg-link::after { content: none; }

.seg-link:hover::before {
  opacity: 1;
  transform: translateZ(0) scale(1);
  border-color: rgba(255, 255, 255, 0.22);
  box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.22),
      0 6px 22px rgba(0, 0, 0, 0.35);
}

/* Optionnel : micro-levée au hover */
@media (hover: hover) and (pointer: fine) {
  .seg-link:hover { transform: translateY(-0.5px); }
}
</style>