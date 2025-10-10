<template>
  <main class="min-h-screen flex items-center justify-center bg-[#F7F7FB]">
    <section class="w-full max-w-xl bg-white border border-[#F1F1F4] rounded-[18px] shadow-[0_16px_36px_-14px_rgba(16,24,40,0.10)] p-12">
      <h1 class="text-[28px] font-semibold text-[#5B21B6] mb-10 pb-[.35rem] relative text-center">
        Connexion
        <span
            class="absolute left-1/2 -translate-x-1/2 bottom-0 w-[260px] h-[3px] rounded-[6px] opacity-75"
            style="background:linear-gradient(90deg, #60A5FA 0%, #A78BFA 50%, #F472B6 100%);"
        ></span>
      </h1>
      <form @submit.prevent="login" class="flex flex-col gap-8">
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
          Se connecter
        </button>
      </form>
      <p v-if="errorMessage" class="mt-6 text-center text-red-500 font-semibold">{{ errorMessage }}</p>
      <router-link
          to="/inscription"
          class="block mt-8 text-center text-[#A78BFA] font-semibold hover:underline transition"
      >
        Première connexion ? Créer un compte
      </router-link>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";

const user = ref({ email: "", password: "" });
const errorMessage = ref("");

const login = async () => {
  errorMessage.value = "";
  try {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email: user.value.email,
        password: user.value.password,
      }),
    });

    const data = await response.text();

    if (!response.ok) {
      errorMessage.value = data;
      return;
    }

    console.log("Réponse API :", data);
    // Gère ici la connexion (stockage token, redirection, etc.)
  } catch (error) {
    errorMessage.value = "Erreur réseau ou serveur.";
    console.error(error);
  }
};
</script>
