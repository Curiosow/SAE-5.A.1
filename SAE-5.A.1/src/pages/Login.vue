<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import './Login.css' // 🔹 Import du CSS externe

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref<string | null>(null)

const router = useRouter()

// Validation email
const emailValid = computed(() =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
)

// Autorisation du bouton
const canSubmit = computed(() =>
    !loading.value && email.value.trim() !== '' && password.value !== '' && emailValid.value
)

async function submitLogin() {
  errorMsg.value = null
  if (!canSubmit.value) {
    errorMsg.value = 'Veuillez entrer un email valide et un mot de passe.'
    return
  }

  loading.value = true
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.message || `Erreur ${res.status}`)
    }

    const data = await res.json()
    if (data.token) {
      localStorage.setItem('auth_token', data.token)
    }

    await router.push({ name: 'Dashboard' })
  } catch (err: any) {
    errorMsg.value = err?.message || 'Erreur lors de la connexion'
  } finally {
    loading.value = false
  }
}

function onSubmitForm(e: Event) {
  e.preventDefault()
  submitLogin()
}
</script>

<template>
  <main class="login-page">
    <form class="login-card" @submit="onSubmitForm" novalidate>
      <h1>Connexion</h1>

      <label class="field">
        <span>Email</span>
        <input
            v-model="email"
            type="email"
            autocomplete="username"
            placeholder="vous@exemple.com"
            :class="{ invalid: email !== '' && !emailValid }"
            required
        />
        <small v-if="email !== '' && !emailValid" class="hint">Email invalide</small>
      </label>

      <label class="field">
        <span>Mot de passe</span>
        <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="Votre mot de passe"
            required
        />
      </label>

      <div v-if="errorMsg" class="error">{{ errorMsg }}</div>

      <button type="submit" :disabled="!canSubmit" class="btn">
        <span v-if="!loading">Se connecter</span>
        <span v-else>Connexion…</span>
      </button>

      <p class="small">
        Pas encore de compte ?
        <router-link to="/signup">S'inscrire</router-link>
      </p>
    </form>
  </main>
</template>
