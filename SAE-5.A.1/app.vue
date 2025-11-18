<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from "~/src/components/navbar.vue";
import Footer from "~/src/components/footer.vue";

const route = useRoute()
const showNavbar = computed(() => route.path !== '/login' && route.path !== '/register')

useHead({
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
})
</script>

<template>
  <div>
    <Navbar v-if="showNavbar"/>
    <NuxtPage />
    <Footer/>
  </div>
</template>
