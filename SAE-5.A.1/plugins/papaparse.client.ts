import Papa from 'papaparse'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      papaparse: Papa
    }
  }
})


