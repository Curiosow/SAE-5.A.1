<script setup>
import Analyse from "~/src/pages/analyse.vue";
import Navbar from "~/src/components/navbar.vue";

useHead({
  link: [
{ rel: 'icon', href: '/favicon.ico' },
],
})
</script>

<template>
  <div>
    <navbar/>
    <NuxtPage />
  </div>
</template>
