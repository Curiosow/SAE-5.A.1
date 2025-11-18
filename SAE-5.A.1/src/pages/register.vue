<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const errorMsg = ref<string | null>(null)

const user = ref({
  firstname: "",
  lastname: "",
  email: "",
  password: ""
});

// Validation email
const emailValid = computed(() =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.value.email)
)

// Autorisation du bouton
const canSubmit = computed(() =>
    !loading.value && user.value.firstname.trim() !== '' && user.value.lastname.trim() !== '' && user.value.email.trim() !== '' && user.value.password.trim() !== '' && emailValid.value
)

async function submitRegister() {
  errorMsg.value = null
  loading.value = true
  
  try {
    const res = await fetch('http://localhost:8080/auth/register_coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email: user.value.email, password: user.value.password, firstName: user.value.firstname, lastName: user.value.lastname }),
    })

  if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.message || `Erreur ${res.status}`)
    }

    const mockToken = 'mock-token-' + Math.random().toString(36).substring(2) + '-' + Date.now()
    localStorage.setItem('auth_token', mockToken)

    const redirect = (route.query.redirect as string) || '/'
    await router.push(redirect)
  } catch (err: any) {
      errorMsg.value = err?.message || 'Erreur lors de l\'inscription'
  } finally {
    loading.value = false
  }
};

function onSubmitForm(e: Event) {
  e.preventDefault()
  submitRegister()
}

</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-[#F7F7FB]">
    <section class="w-full max-w-xl bg-white border border-[#F1F1F4] rounded-[18px] shadow-[0_16px_36px_-14px_rgba(16,24,40,0.10)] p-12">
      <h1 class="text-[28px] font-semibold text-[#5B21B6] mb-10 pb-[.35rem] relative text-center">
        Inscription
      </h1>
      <form @submit="onSubmitForm" class="flex flex-col gap-8">
        <!-- ...champs du formulaire... -->
        <div>
          <label class="block text-base font-medium text-gray-700 mb-2" for="firstname">Prénom</label>
          <input
              v-model="user.firstname"
              id="firstname"
              type="text"
              required
              class="w-full px-6 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition text-lg"
              placeholder="Votre prénom"
          />
        </div>
        <div>
          <label class="block text-base font-medium text-gray-700 mb-2" for="lastname">Nom de famille</label>
          <input
              v-model="user.lastname"
              id="lastname"
              type="text"
              required
              class="w-full px-6 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition text-lg"
              placeholder="Votre nom"
          />
        </div>
        <div>
          <label class="block text-base font-medium text-gray-700 mb-2" for="email">Adresse e-mail</label>
          <input
              v-model="user.email"
              id="email"
              type="email"
              required
              class="w-full px-6 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition text-lg"
              placeholder="exemple@email.com"
          />
        </div>
        <div>
          <label class="block text-base font-medium text-gray-700 mb-2" for="password">Mot de passe</label>
          <input
              v-model="user.password"
              id="password"
              type="password"
              required
              class="w-full px-6 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition text-lg"
              placeholder="••••••••"
          />
        </div>
        <button
            type="submit"
            class="w-full py-3 mt-4 rounded-full text-white text-lg font-semibold bg-gradient-to-r from-pink-400 to-violet-400 shadow-[0_8px_22px_rgba(244,114,182,0.25)] hover:from-pink-500 hover:to-violet-500 transition"
        >
          S'inscrire
        </button>
      </form>
      <router-link
          to="/login"
          class="block mt-8 text-center text-[#A78BFA] font-semibold hover:underline transition"
      >
        &#8592; Retour à la connexion
      </router-link>
    </section>
  </main>
</template>