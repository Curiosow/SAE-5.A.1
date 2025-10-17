<script setup lang="ts">
  import { ref, computed } from 'vue'

  const menuItems = ['Membres', 'Coach', 'Joueuses', 'Ailière', 'Gardienne', 'Pivot']
  const search = ref('')
  const showModal = ref(false)

  const members = ref([
    {
      fullName: 'Oscar Bouttier',
      displayName: 'curiosow',
      email: 'bouttieroscar@gmail.com',
      role: 'Coach',
      auth: 'Email',
      joined: '20 janvier 2025',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
      fullName: 'Apo_Tek',
      displayName: 'Apo_Tek',
      email: 'apotek.babouche@gmail.com',
      role: 'Joueuse',
      auth: 'Email',
      joined: '4 juin 2025',
      avatar: 'https://i.pravatar.cc/150?img=5',
      birthday: '2000-05-12',
      height: '170',
      jersey: '10',
    },
  ])

  const filteredMembers = computed(() =>
    members.value.filter(
      (m) =>
        m.fullName.toLowerCase().includes(search.value.toLowerCase()) ||
        m.email.toLowerCase().includes(search.value.toLowerCase())
    )
  )

  const hasJoueuseFields = computed(() =>
    members.value.some(m => m.role === 'Joueuse')
  )

  const newMember = ref({
    fullName: '',
    displayName: '',
    email: '',
    role: '',
    auth: '',
    birthday: '',
    height: '',
    jersey: '',
    password: '',
  })

  async function addMember() {
    const [firstName, ...lastNameParts] = newMember.value.fullName.split(' ')
    const lastName = newMember.value.displayName
    if (newMember.value.role === 'Coach') {
      const params = {
        email: newMember.value.email || '',
        password: newMember.value.password || '',
        first_name: firstName || '',
        last_name: lastName || ''
      }
      const response = await fetch('http://localhost:8080/auth/register_coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          email: params.email,
          password: params.password,
          firstName: params.first_name,
          lastName: params.last_name
        })
      })
      if (!response.ok) {
        alert(
            "Erreur lors de la création du coach\n\nParamètres envoyés :\n" +
            Object.entries(params).map(([k, v]) => `${k}: ${v}`).join('\n')
        )
        return
      }
    }else if (newMember.value.role === 'Joueuse') {
      const birthday =  newMember.value.birthday || ''
      const params = {
        email: newMember.value.email || '',
        password: newMember.value.password || '',
        firstName: firstName || '',
        lastName: lastName || '',
        jersey_number: newMember.value.jersey?.toString() || '',
        birth_date: birthday,
        height_cm: newMember.value.height?.toString() || ''
      }
      const response = await fetch('http://localhost:8080/auth/register_player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(params)
      })

      if (!response.ok) {
        alert(
          "Erreur lors de la création de la joueuse\n\nParamètres envoyés :\n" +
          Object.entries(params).map(([k, v]) => `${k}: ${v}`).join('\n')
        )
        return
      }
    }
    members.value.push({
      ...newMember.value,
      joined: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      avatar: 'https://i.pravatar.cc/150?u=' + encodeURIComponent(newMember.value.email),
    })
    newMember.value = {
      fullName: '',
      displayName: '',
      email: '',
      role: '',
      auth: '',
      birthday: '',
      height: '',
      jersey: '',
      password: ''
    }
    showModal.value = false
  }
  </script>

  <template>
    <div class="min-h-screen bg-[#F7F7FB] flex">
      <!-- Sidebar -->
      <aside
        class="bg-white border border-[#F1F1F4] rounded-[18px] shadow-[0_16px_36px_-14px_rgba(16,24,40,0.10)] w-44 min-w-[11rem] mr-6 mt-8 ml-4 p-5 flex flex-col"
      >
        <h2 class="text-lg font-bold mb-6 text-[#5B21B6]">Paramètres</h2>
        <nav class="space-y-2">
          <button
            v-for="item in menuItems"
            :key="item"
            class="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            :class="item === 'Membres' ? 'bg-gray-100 font-semibold text-[#5B21B6]' : 'text-gray-700'"
          >
            {{ item }}
          </button>
        </nav>
      </aside>

      <!-- Contenu principal -->
      <main class="flex-1 pb-16 px-4 sm:px-6 lg:px-8 mt-24">
        <div class="max-w-full mx-auto">
          <section
            class="bg-white border border-[#F1F1F4] rounded-[18px] shadow-[0_16px_36px_-14px_rgba(16,24,40,0.10)] p-6 sm:p-8"
          >
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
            >
              <div>
                <h1 class="text-2xl font-bold text-[#5B21B6]">Membres</h1>
                <p class="text-gray-500 text-sm">
                  Liste de tous les utilisateurs du workspace
                </p>
              </div>
              <button
                class="rounded-full px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-400 to-violet-400 shadow-[0_8px_22px_rgba(244,114,182,0.25)]"
                @click="showModal = true"
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
                class="border border-gray-200 rounded-lg px-4 py-2 w-full sm:w-1/3 focus:outline-none focus:ring focus:ring-blue-200 text-sm"
              />
            </div>

            <!-- Tableau -->
            <div class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="bg-gray-50 text-gray-500">
                    <th class="py-3 px-4 text-left">Nom complet</th>
                    <th class="py-3 px-4 text-left">Nom d'affichage</th>
                    <th class="py-3 px-4 text-left">Adresse e-mail</th>
                    <th class="py-3 px-4 text-left">Type de compte</th>
                    <th class="py-3 px-4 text-left">Authentification</th>
                    <th class="py-3 px-4 text-left">Date d’adhésion</th>
                    <th class="py-3 px-4 text-left" v-if="hasJoueuseFields">Date d'anniv.</th>
                    <th class="py-3 px-4 text-left" v-if="hasJoueuseFields">Taille</th>
                    <th class="py-3 px-4 text-left" v-if="hasJoueuseFields">N° maillot</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="member in filteredMembers"
                    :key="member.email"
                    class="border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td class="py-3 px-4 flex items-center gap-3">
                      <img
                        :src="member.avatar"
                        alt="avatar"
                        class="w-8 h-8 rounded-full object-cover"
                      />
                      <span class="font-medium text-gray-900">{{ member.fullName }}</span>
                    </td>
                    <td class="py-3 px-4">{{ member.displayName }}</td>
                    <td class="py-3 px-4">{{ member.email }}</td>
                    <td class="py-3 px-4">{{ member.role }}</td>
                    <td class="py-3 px-4">{{ member.auth }}</td>
                    <td class="py-3 px-4">{{ member.joined }}</td>
                    <td class="py-3 px-4" v-if="member.role === 'Joueuse'">{{ member.birthday }}</td>
                    <td class="py-3 px-4" v-if="member.role === 'Joueuse'">{{ member.height }}</td>
                    <td class="py-3 px-4" v-if="member.role === 'Joueuse'">{{ member.jersey }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <!-- Modal Ajouter un membre -->
      <div
        v-if="showModal"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
      >
        <div class="bg-white rounded-lg p-8 shadow-lg min-w-[300px]">
          <h2 class="text-lg font-bold mb-4">Ajouter un membre</h2>
          <form @submit.prevent="addMember">
            <input
              v-model="newMember.fullName"
              type="text"
              placeholder="Nom complet"
              class="border border-gray-200 rounded-lg px-3 py-2 w-full mb-2"
              required
            />
            <input
              v-model="newMember.displayName"
              type="text"
              placeholder="Nom d'affichage"
              class="border border-gray-200 rounded-lg px-3 py-2 w-full mb-2"
              required
            />
            <input
              v-model="newMember.email"
              type="email"
              placeholder="Adresse e-mail"
              class="border border-gray-200 rounded-lg px-3 py-2 w-full mb-2"
              required
            />
            <input
              v-model="newMember.password"
              type="password"
              placeholder="Mot de passe"
              class="border border-gray-200 rounded-lg px-3 py-2 w-full mb-2"
              required
            />
            <select
              v-model="newMember.role"
              class="border border-gray-200 rounded-lg px-3 py-2 w-full mb-2"
              required
            >
              <option value="" disabled>Type de compte</option>
              <option>Coach</option>
              <option>Joueuse</option>
            </select>

            <!-- Champs spécifiques à Joueuse -->
            <div v-if="newMember.role === 'Joueuse'">
              <input
                v-model="newMember.birthday"
                type="date"
                placeholder="Date d'anniversaire"
                class="border border-gray-200 rounded-lg px-3 py-2 w-full mb-2"
                required
              />
              <input
                v-model="newMember.height"
                type="number"
                min="100"
                max="250"
                placeholder="Taille (cm)"
                class="border border-gray-200 rounded-lg px-3 py-2 w-full mb-2"
                required
              />
              <input
                v-model="newMember.jersey"
                type="number"
                min="1"
                max="99"
                placeholder="Numéro de maillot"
                class="border border-gray-200 rounded-lg px-3 py-2 w-full mb-2"
                required
              />
            </div>

            <button
              type="submit"
              class="w-full mt-2 px-4 py-2 bg-gradient-to-r from-pink-400 to-violet-400 text-white rounded font-semibold"
            >
              Ajouter
            </button>
          </form>
          <button
            class="mt-4 px-4 py-2 bg-gray-200 rounded w-full"
            @click="showModal = false"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </template>