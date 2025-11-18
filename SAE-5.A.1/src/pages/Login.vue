<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import './CSS/Login.css'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref<string | null>(null)

const router = useRouter()
const route = useRoute()

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
    const res = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email: email.value, password: password.value }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.message || `Erreur ${res.status}`)
    }

    const mockToken = 'mock-token-' + Math.random().toString(36).substring(2) + '-' + Date.now()
    localStorage.setItem('auth_token', mockToken)

    getAllInformations()
  } catch (err: any) {
    errorMsg.value = err?.message || 'Erreur lors de la connexion'
  } finally {
    loading.value = false
  }
}

async function getAllInformations() {
    errorMsg.value = null
    loading.value = true

    try {
      const url = 'http://localhost:8080/auth/userbymail?' + new URLSearchParams({ email: email.value }).toString()
      const res = await fetch(url, {
        method: 'GET',
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || `Erreur ${res.status}`)
      }

      const userData = await res.json()
      localStorage.setItem('account_type', userData.account_type)
      localStorage.setItem('last_name', userData.last_name)
      localStorage.setItem('first_name', userData.first_name)
      localStorage.setItem('email', userData.email)

      const redirect = (route.query.redirect as string) || '/'
      await router.push(redirect)
    } catch (err: any) {
      errorMsg.value = err?.message || 'Erreur lors de la récupération des informations'
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
    </form>
  </main>
</template>