// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  css: [
    '~/assets/css/main.css'
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  dir: {
    pages: 'src/pages',
    components: 'src/components'
  },

  vite: {
    define: {
      '__USE_PROD_API__': process.env.NODE_ENV === 'production'
    }
  }
})