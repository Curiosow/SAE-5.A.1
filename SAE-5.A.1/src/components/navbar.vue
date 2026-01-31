<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const open = ref(false)
const scrolled = ref(false)
const router = useRouter()
const route = useRoute() // Pour gérer l'état actif

const firstName = ref<string | null>(null)
const account_type = ref<string | null>(null)

const onScroll = () => {
  scrolled.value = window.scrollY > 10
}

const handleLogout = () => {
  console.log('Déconnexion en cours...')
  localStorage.clear()
  open.value = false
  router.push('/login')
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    firstName.value = localStorage.getItem('first_name')
    account_type.value = localStorage.getItem('account_type')
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScroll)
  }
})

const globalItems = [
  { label: 'Accueil', href: '/' },
]

const coachItems = [
  { label: 'Joueuses', href: '/joueuses' },
  { label: 'Matchs', href: '/comparaison' },
  { label: 'Objectifs', href: '/Objectifs' }, // Ajout du lien
  { label: 'Téléverser', href: '/match' },
  { label: 'Gestion', href: '/gestion' },
  { label: 'Heatmaps', href: '/heatmap' },
]

const playerItems = [
  { label: 'Mon Profil', href: '/joueuseprofil' },
  { label: 'Mes Objectifs', href: '/Objectifs' }, // Ajout pour la joueuse aussi
]

const isCoach = computed(() => account_type.value === 'coach')
const isPlayer = computed(() => account_type.value === 'player')

// Fonction pour vérifier si le lien est actif
const isActive = (path: string) => route.path === path
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 transition-all duration-500" :class="scrolled ? 'pt-0' : 'pt-4'">
    <div
        class="mx-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        :class="[
          scrolled
            ? 'w-full rounded-none bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100 py-2'
            : 'w-[min(94%,1200px)] rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-3'
        ]"
    >
      <div class="px-4 sm:px-6">
        <nav class="flex h-10 items-center justify-between">

          <div class="flex items-center gap-3">
            <router-link to="/" class="shrink-0 group relative" @click="open = false">
              <div class="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img
                  src="/Sambre-Avesnois-Logo-1-e1739525613932.png"
                  alt="Logo"
                  class="h-9 w-auto relative z-10 transition-transform group-hover:scale-105"
              />
            </router-link>

            <div class="hidden sm:flex flex-col leading-none">
              <span class="text-xs font-bold text-gray-900 tracking-wide">SAMBRE AVESNOIS</span>
              <span class="text-[10px] font-medium text-gray-500">
                Bonjour, <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold">{{ firstName }}</span>
              </span>
            </div>
          </div>

          <div class="hidden lg:flex items-center gap-1 bg-gray-100/50 p-1 rounded-full border border-gray-200/50">
            <router-link
                v-for="item in globalItems"
                :key="item.label"
                :to="item.href"
                class="relative px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-300"
                :class="isActive(item.href) ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-purple-600 hover:bg-white/50'"
            >
              {{ item.label }}
            </router-link>

            <div v-if="isCoach" class="w-px h-4 bg-gray-300 mx-1"></div>

            <router-link
                v-if="isCoach"
                v-for="item in coachItems"
                :key="item.label"
                :to="item.href"
                class="relative px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-300"
                :class="isActive(item.href) ? 'bg-white text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-purple-600 hover:bg-white/50'"
            >
              {{ item.label }}
            </router-link>

            <router-link
                v-if="isPlayer"
                v-for="item in playerItems"
                :key="item.label"
                :to="item.href"
                class="relative px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-300"
                :class="isActive(item.href) ? 'bg-white text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-purple-600 hover:bg-white/50'"
            >
              {{ item.label }}
            </router-link>
          </div>

          <div class="hidden lg:flex items-center gap-3">
            <button
                @click="handleLogout"
                class="group flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-100 bg-red-50/50 text-xs font-bold text-red-600 hover:bg-red-100 hover:pr-5 transition-all duration-300"
            >
              <span>Déconnexion</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

          <button
              type="button"
              class="lg:hidden p-2 text-gray-500 hover:text-purple-600 transition-colors"
              @click="open = !open"
          >
            <div class="w-6 h-5 relative flex flex-col justify-between">
              <span class="w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-left" :class="open ? 'rotate-45 translate-x-0.5' : ''"></span>
              <span class="w-full h-0.5 bg-current rounded-full transition-all duration-300" :class="open ? 'opacity-0' : ''"></span>
              <span class="w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-left" :class="open ? '-rotate-45 translate-x-0.5' : ''"></span>
            </div>
          </button>
        </nav>
      </div>
    </div>

    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-40 bg-gray-900/20 backdrop-blur-sm lg:hidden" @click="open = false"></div>
    </Transition>

    <div
        class="fixed top-0 right-0 z-50 h-full w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden flex flex-col"
        :class="open ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="p-6 border-b border-gray-100 flex items-center justify-between">
        <span class="text-sm font-bold text-gray-900">Menu</span>
        <button @click="open = false" class="text-gray-400 hover:text-gray-900">✕</button>
      </div>

      <div class="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">Navigation</p>

        <router-link
            v-for="item in globalItems"
            :key="item.href"
            :to="item.href"
            @click="open = false"
            class="block px-4 py-3 rounded-xl text-sm font-medium transition-all"
            :class="isActive(item.href) ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'"
        >
          {{ item.label }}
        </router-link>

        <div v-if="isCoach" class="pt-4 mt-4 border-t border-gray-100">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">Espace Coach</p>
          <router-link
              v-for="item in coachItems"
              :key="item.href"
              :to="item.href"
              @click="open = false"
              class="block px-4 py-3 rounded-xl text-sm font-medium transition-all"
              :class="isActive(item.href) ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'"
          >
            {{ item.label }}
          </router-link>
        </div>

        <div v-if="isPlayer" class="pt-4 mt-4 border-t border-gray-100">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">Espace Joueuse</p>
          <router-link
              v-for="item in playerItems"
              :key="item.href"
              :to="item.href"
              @click="open = false"
              class="block px-4 py-3 rounded-xl text-sm font-medium transition-all"
              :class="isActive(item.href) ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'"
          >
            {{ item.label }}
          </router-link>
        </div>
      </div>

      <div class="p-6 border-t border-gray-100 bg-gray-50/50">
        <button
            @click="handleLogout"
            class="w-full flex items-center justify-center gap-2 bg-white border border-red-100 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-all text-sm shadow-sm"
        >
          Déconnexion
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Pas besoin de CSS custom complexe, Tailwind gère tout. */
/* Juste un petit fix pour la scrollbar si besoin */
::-webkit-scrollbar { width: 0px; }
</style>