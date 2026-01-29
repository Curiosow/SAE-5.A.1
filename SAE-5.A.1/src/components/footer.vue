<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isMobile = ref(false)
const showFooter = ref(true)

const updateMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    showFooter.value = true
  } else {
    const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
    showFooter.value = scrolledToBottom
  }
}

onMounted(() => {
  updateMobile()
  window.addEventListener('resize', updateMobile)

  const handleScroll = () => {
    if (isMobile.value) {
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
      showFooter.value = scrolledToBottom
    }
  }

  window.addEventListener('scroll', handleScroll)

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', updateMobile)
  })
})
</script>

<template>
  <span v-if="showFooter" class="w-full py-4 bg-pink/100 backdrop-blur-md backdrop-saturate-180 rounded-t-2xl shadow-lg text-center text-gray-900 font-medium fixed bottom-0 left-0 z-50">
    © 2026 Sambre Avesnois HandBall - Proposé par l'IUT de Maubeuge. Tous droits réservés.
  </span>
</template>
