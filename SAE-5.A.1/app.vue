<script setup>
import Analyse from "~/src/pages/analyse.vue";
import Navbar from "~/src/components/navbar.vue";
import Footer from "~/src/components/footer.vue";

useHead({
  link: [
{ rel: 'icon', href: '/favicon.ico' },
],
})
</script>

<template>
  <div>
    <Navbar/>
    <NuxtPage />
    <Footer/>
  </div>
</template>
