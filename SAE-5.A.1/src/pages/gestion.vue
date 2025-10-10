<template>
  <div class="flex h-screen bg-gray-50">

    <!-- Barre latérale -->
    <aside class="w-64 bg-white border-r p-4 flex flex-col">
      <h2 class="text-xl font-bold mb-6">Paramètres</h2>
      <nav class="space-y-2">
        <button
            v-for="item in menuItems"
            :key="item"
            class="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
            :class="item === 'Membres' ? 'bg-gray-100 font-semibold' : ''"
        >
          {{ item }}
        </button>
      </nav>
    </aside>

    <!-- Contenu principal -->
    <main class="flex-1 p-8 overflow-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold">Membres</h1>
          <p class="text-gray-500 text-sm">Liste de tous les utilisateurs du workspace</p>
        </div>

        <button
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          + Ajouter un membre
        </button>
      </div>

      <!-- Barre de recherche -->
      <div class="mb-4">
        <input
            v-model="search"
            type="text"
            placeholder="Rechercher un membre..."
            class="border border-gray-300 rounded-lg px-4 py-2 w-1/3 focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <!-- Tableau des membres -->
      <div class="bg-white shadow rounded-2xl overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-100 text-left text-sm text-gray-600">
          <tr>
            <th class="px-6 py-3">Nom complet</th>
            <th class="px-6 py-3">Nom d'affichage</th>
            <th class="px-6 py-3">Adresse e-mail</th>
            <th class="px-6 py-3">Type de compte</th>
            <th class="px-6 py-3">Authentification</th>
            <th class="px-6 py-3">Date d’adhésion</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="member in filteredMembers"
              :key="member.email"
              class="border-t hover:bg-gray-50"
          >
            <td class="px-6 py-3 flex items-center space-x-3">
              <img
                  :src="member.avatar"
                  alt="avatar"
                  class="w-8 h-8 rounded-full object-cover"
              />
              <span>{{ member.fullName }}</span>
            </td>
            <td class="px-6 py-3">{{ member.displayName }}</td>
            <td class="px-6 py-3">{{ member.email }}</td>
            <td class="px-6 py-3">{{ member.role }}</td>
            <td class="px-6 py-3">{{ member.auth }}</td>
            <td class="px-6 py-3">{{ member.joined }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const menuItems = ['Coach', 'Joueuses', 'Ailier', 'Gardien', 'Pivot', '']

const search = ref('')

const members = ref([
  {
    fullName: 'Oscar Bouttier',
    displayName: 'curiosow',
    email: 'bouttieroscar@gmail.com',
    role: 'Admin',
    auth: 'Email',
    joined: '20 janvier 2025',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    fullName: 'Apo_Tek',
    displayName: 'Apo_Tek',
    email: 'apotek.babouche@gmail.com',
    role: 'Member',
    auth: 'Email',
    joined: '4 juin 2025',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  // ...ajoute d’autres membres ici
])

const filteredMembers = computed(() =>
    members.value.filter(
        (m) =>
            m.fullName.toLowerCase().includes(search.value.toLowerCase()) ||
            m.email.toLowerCase().includes(search.value.toLowerCase())
    )
)
</script>
