<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({ roles: ['coach'] })

const menuItems = ['Membres', 'Coach', 'Joueuses']
const selectedMenu = ref('Membres')
const search = ref('')
const showModal = ref(false)
const members = ref<any[]>([])
const tableColumns = ref<string[]>(['Nom', 'Prénom', 'Adresse e-mail', 'Type de compte'])
const deletingPlayerEmail = ref<string | null>(null)
const resettingPlayerEmail = ref<string | null>(null)

// Dropdown players helper (affiche la liste des joueuses pour une ligne)
const playersDropdownForEmail = ref<string | null>(null)
function togglePlayersDropdown(email: string | null) {
  playersDropdownForEmail.value = playersDropdownForEmail.value === email ? null : email
}
function closePlayersDropdown() {
  playersDropdownForEmail.value = null
}
function selectPlayerFromDropdown(targetMember: any, playerEmail: string) {
  const p = members.value.find((m: any) => m.email === playerEmail)
  if (!p) return
  // remplacer les champs de la ligne cible par ceux de la joueuse sélectionnée (localement)
  targetMember.firstName = p.firstName
  targetMember.lastName = p.lastName
  targetMember.teamName = p.teamName
  targetMember.email = p.email
  targetMember.jerseyNumber = p.jerseyNumber
  targetMember.birthDate = p.birthDate
  targetMember.heightCm = p.heightCm
  targetMember.isActive = p.isActive
  closePlayersDropdown()
}

// --- Édition inline (joueuse) ---
const editingPlayerEmail = ref<string | null>(null)
const editingFirstName = ref('')
function startEditFirstName(member: any) {
  editingPlayerEmail.value = member.email
  editingFirstName.value = member.firstName || ''
}
async function saveFirstName(member: any) {
  if (!editingFirstName.value.trim()) { editingPlayerEmail.value = null; return }
  await fetch('http://localhost:8080/auth/update_information', {

    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ coach: 'false', type: 'first_name', newValue: editingFirstName.value, email: member.email })
  })
  member.firstName = editingFirstName.value
  editingPlayerEmail.value = null
  editingFirstName.value = ''
}

// Nom joueuse
const editingLastName = ref<string | null>(null)
const editingLastNameValue = ref('')
function startEditLastName(member: any) {
  editingLastName.value = member.email
  editingLastNameValue.value = member.lastName || ''
}
async function saveLastName(member: any) {
  if (!editingLastNameValue.value.trim()) { editingLastName.value = null; return }
  await fetch('http://localhost:8080/auth/update_information', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ coach: 'false', type: 'last_name', newValue: editingLastNameValue.value, email: member.email })
  })
  member.lastName = editingLastNameValue.value
  editingLastName.value = null
  editingLastNameValue.value = ''
}

// Numéro
const editingJerseyNumber = ref<string | null>(null)
const editingJerseyNumberValue = ref<number | string>('')
function startEditJerseyNumber(member: any) {
  editingJerseyNumber.value = member.email
  editingJerseyNumberValue.value = member.jerseyNumber ?? ''
}
async function saveJerseyNumber(member: any) {
  if (editingJerseyNumberValue.value === '' || editingJerseyNumberValue.value === null) { editingJerseyNumber.value = null; return }
  await fetch('http://localhost:8080/auth/update_information', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ coach: 'false', type: 'jersey_number', newValue: editingJerseyNumberValue.value.toString(), email: member.email })
  })
  member.jerseyNumber = editingJerseyNumberValue.value
  editingJerseyNumber.value = null
  editingJerseyNumberValue.value = ''
}

// Taille
const editingHeightEmail = ref<string | null>(null)
const editingHeightValue = ref<number | string>('')
function startEditHeight(member: any) {
  editingHeightEmail.value = member.email
  editingHeightValue.value = member.heightCm ?? ''
}
async function saveHeight(member: any) {
  if (editingHeightValue.value === '' || editingHeightValue.value === null) { editingHeightEmail.value = null; return }
  await fetch('http://localhost:8080/auth/update_information', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ coach: 'false', type: 'height_cm', newValue: editingHeightValue.value.toString(), email: member.email })
  })
  member.heightCm = editingHeightValue.value
  editingHeightEmail.value = null
  editingHeightValue.value = ''
}

// Date de naissance
const editingBirthDateEmail = ref<string | null>(null)
const editingBirthDateValue = ref('')
function startEditBirthDate(member: any) {
  editingBirthDateEmail.value = member.email
  editingBirthDateValue.value = member.birthDate ?? ''
}
async function saveBirthDate(member: any) {
  if (!editingBirthDateValue.value.trim()) { editingBirthDateEmail.value = null; return }
  await fetch('http://localhost:8080/auth/update_information', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ coach: 'false', type: 'birth_date', newValue: editingBirthDateValue.value, email: member.email })
  })
  member.birthDate = editingBirthDateValue.value
  editingBirthDateEmail.value = null
  editingBirthDateValue.value = ''
}

// Email joueur
const editingEmail = ref<string | null>(null)
const editingEmailValue = ref('')
function startEditEmail(member: any) {
  editingEmail.value = member.email
  editingEmailValue.value = member.email || ''
}
async function saveEmail(member: any) {
  if (!editingEmailValue.value.trim()) { editingEmail.value = null; return }
  await fetch('http://localhost:8080/auth/update_information', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ coach: 'false', type: 'email', newValue: editingEmailValue.value, email: member.email })
  })
  member.email = editingEmailValue.value
  editingEmail.value = null
  editingEmailValue.value = ''
}

// Actif joueur
async function toggleActive(member: any) {
  const newActive = member.isActive === 'Oui' ? false : true
  await fetch('http://localhost:8080/auth/update_information', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ coach: 'false', type: 'is_active', newValue: newActive.toString(), email: member.email })

  })
  member.isActive = newActive ? 'Oui' : 'Non'
}

function buildDefaultPlayerPassword(member: any) {
  const lastName = (member.lastName || '').toString().trim().toUpperCase()
  const firstName = (member.firstName || '').toString().trim().toUpperCase()
  return `${lastName}-${firstName}`
}

async function resetPlayerPassword(member: any) {
  const newPassword = buildDefaultPlayerPassword(member)
  if (!newPassword || newPassword === '-') {
    alert('Impossible de générer le mot de passe par défaut (nom/prénom manquants).')
    return
  }
  resettingPlayerEmail.value = member.email
  try {
    const response = await fetch('http://localhost:8080/auth/update_information', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        coach: 'false',
        type: 'password',
        newValue: newPassword,
        email: member.email
      })
    })
    if (!response.ok) {
      const errorText = await response.text()
      alert('Erreur lors de la réinitialisation du mot de passe :\n' + errorText)
      return
    }
    alert(`Mot de passe réinitialisé : ${newPassword}`)
  } finally {
    resettingPlayerEmail.value = null
  }
}

async function deletePlayer(member: any) {
  const confirmation = confirm(`Supprimer le compte de ${member.firstName || ''} ${member.lastName || ''} ?`)
  if (!confirmation) return
  deletingPlayerEmail.value = member.email
  try {
    const response = await fetch('http://localhost:8080/auth/delete_player', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email: member.email })
    })
    if (!response.ok) {
      const errorText = await response.text()
      alert('Erreur lors de la suppression de la joueuse :\n' + errorText)
      return
    }
    members.value = members.value.filter((m) => m.email !== member.email)
  } finally {
    deletingPlayerEmail.value = null
  }
}

// --- Édition inline (coach) ---
const editingCoachFirstNameEmail = ref<string | null>(null)
const editingCoachFirstNameValue = ref('')
function startEditCoachFirstName(member: any) {
  editingCoachFirstNameEmail.value = member.email
  editingCoachFirstNameValue.value = member.firstName || ''
}
async function saveCoachFirstName(member: any) {
  if (!editingCoachFirstNameValue.value.trim()) { editingCoachFirstNameEmail.value = null; return }
  await fetch('http://localhost:8080/auth/update_information', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ coach: 'true', type: 'first_name', newValue: editingCoachFirstNameValue.value, email: member.email })

  })
  member.firstName = editingCoachFirstNameValue.value
  editingCoachFirstNameEmail.value = null
  editingCoachFirstNameValue.value = ''
}

const editingCoachLastNameEmail = ref<string | null>(null)
const editingCoachLastNameValue = ref('')
function startEditCoachLastName(member: any) {
  editingCoachLastNameEmail.value = member.email
  editingCoachLastNameValue.value = member.lastName || ''
}
async function saveCoachLastName(member: any) {
  if (!editingCoachLastNameValue.value.trim()) { editingCoachLastNameEmail.value = null; return }
  await fetch('http://localhost:8080/auth/update_information', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ coach: 'true', type: 'last_name', newValue: editingCoachLastNameValue.value, email: member.email })

  })
  member.lastName = editingCoachLastNameValue.value
  editingCoachLastNameEmail.value = null
  editingCoachLastNameValue.value = ''
}

const editingCoachEmail = ref<string | null>(null)
const editingCoachEmailValue = ref('')
function startEditCoachEmail(member: any) {
  editingCoachEmail.value = member.email
  editingCoachEmailValue.value = member.email || ''
}
async function saveCoachEmail(member: any) {
  if (!editingCoachEmailValue.value.trim()) { editingCoachEmail.value = null; return }
  await fetch('http://localhost:8080/auth/update_information', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ coach: 'true', type: 'email', newValue: editingCoachEmailValue.value, email: member.email })

  })
  member.email = editingCoachEmailValue.value
  editingCoachEmail.value = null
  editingCoachEmailValue.value = ''
}

async function toggleCoachActive(member: any) {
  const newActive = member.isActive === 'Oui' ? false : true
  await fetch('http://localhost:8080/auth/update_information', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ coach: 'true', type: 'is_active', newValue: newActive.toString(), email: member.email })

  })
  member.isActive = newActive ? 'Oui' : 'Non'
}

// Colonnes selon onglet
function setTableColumns() {
  if (selectedMenu.value === 'Coach') {
    tableColumns.value = ['Nom', 'Prénom', 'Adresse e-mail', 'Actif']
  } else if (selectedMenu.value === 'Joueuses') {
    tableColumns.value = ['Nom', 'Prénom', 'Équipe', 'Adresse e-mail', 'Numéro de maillot', 'Date de naissance', 'Taille (cm)', 'Active', 'Actions']
  } else {
    tableColumns.value = ['Nom', 'Prénom', 'Adresse e-mail', 'Type de compte']
  }
}

// Récupération des membres depuis l'API
async function fetchMembers() {
  let url = 'http://localhost:8080/auth/members'
  if (selectedMenu.value === 'Coach') url = 'http://localhost:8080/auth/coaches'
  else if (selectedMenu.value === 'Joueuses') url = 'http://localhost:8080/auth/players'

  const response = await fetch(url)
  const data = await response.json()
  if (selectedMenu.value === 'Coach') {
    members.value = data.map((m: any) => ({
      lastName: m.last_name || '',
      firstName: m.first_name || '',
      email: m.email,
      isActive: m.is_active ? 'Oui' : 'Non'
    }))
  } else if (selectedMenu.value === 'Joueuses') {
    members.value = data.map((m: any) => ({
      lastName: m.last_name || '',
      firstName: m.first_name || '',
      teamName: m.team_name || '',
      email: m.email,
      jerseyNumber: m.jersey_number ?? '',
      birthDate: m.birth_date || '',
      heightCm: m.height_cm ?? '',
      isActive: m.is_active ? 'Oui' : 'Non'
    }))
  } else {
    members.value = data.map((m: any) => ({
      lastName: m.last_name || m.lastName || '',
      firstName: m.first_name || m.firstName || '',
      email: m.email,
      role: m.account_type || selectedMenu.value
    }))
  }
  setTableColumns()
}

// Filtrage
const filteredMembers = computed(() =>
  members.value.filter((m) =>
    (m.firstName || '').toLowerCase().includes(search.value.toLowerCase()) ||
    (m.lastName || '').toLowerCase().includes(search.value.toLowerCase()) ||
    (m.email || '').toLowerCase().includes(search.value.toLowerCase())
  )
)

// Formulaire ajout membre (inclut champs joueuse)
const newMember = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  password: '',
  teamName: '',
  jerseyNumber: '',
  birthDate: '',
  heightCm: ''
})

async function addMember() {
  if (!newMember.value.role) return
  if (newMember.value.role === 'Coach') {
    const params = {
      email: newMember.value.email || '',
      password: newMember.value.password || '',
      firstName: newMember.value.firstName || '',
      lastName: newMember.value.lastName || ''
    }
    const response = await fetch('http://localhost:8080/auth/register_coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params)
    })
    if (!response.ok) {
      const errorText = await response.text()
      alert('Erreur lors de la création du coach :\n' + errorText)
      return
    }
    members.value.push({
      firstName: newMember.value.firstName,
      lastName: newMember.value.lastName,
      email: newMember.value.email,
      isActive: 'Oui',
      team_id: ''
    })
  } else if (newMember.value.role === 'Joueuse') {
    const params: any = {
      email: newMember.value.email || '',
      password: newMember.value.password || '',
      firstName: newMember.value.firstName || '',
      lastName: newMember.value.lastName || '',
      team_name: newMember.value.teamName || '',
      jersey_number: (newMember.value.jerseyNumber || '').toString(),
      birth_date: newMember.value.birthDate || '',
      height_cm: (newMember.value.heightCm || '').toString()
    }
    const response = await fetch('http://localhost:8080/auth/register_player', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params)
    })
    if (!response.ok) {
      const errorText = await response.text()
      alert('Erreur lors de la création de la joueuse :\n' + errorText)
      return
    }
    members.value.push({
      firstName: newMember.value.firstName,
      lastName: newMember.value.lastName,
      teamName: newMember.value.teamName,
      email: newMember.value.email,
      jerseyNumber: newMember.value.jerseyNumber,
      birthDate: newMember.value.birthDate,
      heightCm: newMember.value.heightCm,
      isActive: 'Oui'
    })
  }
  // reset
  newMember.value = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
    teamName: '',
    jerseyNumber: '',
    birthDate: '',
    heightCm: ''
  }
  showModal.value = false
  // optionnel : recharger depuis l'API
  await fetchMembers()
}

// initialisation
onMounted(fetchMembers)
watch(selectedMenu, fetchMembers)
</script>
<template>
  <div class="min-h-screen bg-[#F7F7FB] flex">
    <aside class="bg-white border border-[#F1F1F4] rounded-[18px] shadow-[0_16px_36px_-14px_rgba(16,24,40,0.10)] w-48 min-w-[8rem] mr-6 mt-8 ml-4 p-5 flex flex-col">
      <h2 class="text-lg font-bold mb-6 text-[#5B21B6]">Paramètres</h2>
      <nav class="space-y-2">
        <button
            v-for="item in menuItems"
            :key="item"
            class="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            :class="item === selectedMenu ? 'bg-gray-100 font-semibold text-[#5B21B6]' : 'text-gray-700'"
            @click="selectedMenu = item"
        >
          {{ item }}
        </button>
      </nav>
    </aside>

    <main class="flex-1 pb-16 px-4 sm:px-6 lg:px-8 mt-24">
      <div class="max-w-full mx-auto">
        <section class="bg-white border border-[#F1F1F4] rounded-[18px] shadow-[0_16px_36px_-14px_rgba(16,24,40,0.10)] p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 class="text-2xl font-bold text-[#5B21B6]">Membres</h1>
              <p class="text-gray-500 text-sm">
                Visualisez et gérez les membres de votre club.
              </p>
            </div>
            <button
                class="rounded-full px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-400 to-violet-400 shadow-[0_8px_22px_rgba(244,114,182,0.25)]"
                @click="showModal = true"
            >
              + Ajouter un membre
            </button>
          </div>

          <div class="mb-4">
            <input
                v-model="search"
                type="text"
                placeholder="Rechercher un membre..."
                class="border border-gray-200 rounded-lg px-4 py-2 w-full sm:w-1/3 focus:outline-none focus:ring focus:ring-blue-200 text-sm"
            />
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
              <tr class="bg-gray-50 text-gray-500">
                <th v-for="col in tableColumns" :key="col" class="py-3 px-4 text-left">{{ col }}</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="member in filteredMembers"
                  :key="member.email"
                  class="border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <!-- Coach -->
                <template v-if="selectedMenu === 'Coach'">
                  <!-- Nom éditable -->
                  <td class="py-3 px-4">
                    <template v-if="editingCoachLastNameEmail === member.email">
                      <input
                        v-model="editingCoachLastNameValue"
                        class="border rounded px-2 py-1 w-24"
                        @keyup.enter="saveCoachLastName(member)"
                        @blur="saveCoachLastName(member)"
                        autofocus
                      />
                    </template>
                    <template v-else>
                      <span
                        class="cursor-pointer text-blue-600 hover:underline"
                        @click="startEditCoachLastName(member)"
                      >
                        {{ member.lastName }}
                      </span>
                    </template>
                  </td>
                  <!-- Prénom éditable -->
                  <td class="py-3 px-4">
                    <template v-if="editingCoachFirstNameEmail === member.email">
                      <input
                        v-model="editingCoachFirstNameValue"
                        class="border rounded px-2 py-1 w-24"
                        @keyup.enter="saveCoachFirstName(member)"
                        @blur="saveCoachFirstName(member)"
                        autofocus
                      />
                    </template>
                    <template v-else>
                      <span
                        class="cursor-pointer text-blue-600 hover:underline"
                        @click="startEditCoachFirstName(member)"
                      >
                        {{ member.firstName }}
                      </span>
                    </template>
                  </td>
                  <!-- Email éditable -->
                  <td class="py-3 px-4">
                    <template v-if="editingCoachEmail === member.email">
                      <input
                        v-model="editingCoachEmailValue"
                        class="border rounded px-2 py-1 w-44"
                        @keyup.enter="saveCoachEmail(member)"
                        @blur="saveCoachEmail(member)"
                        type="email"
                        autofocus
                      />
                    </template>
                    <template v-else>
                      <span
                        class="cursor-pointer text-blue-600 hover:underline"
                        @click="startEditCoachEmail(member)"
                      >
                        {{ member.email }}
                      </span>
                    </template>
                  </td>
                  <!-- Actif éditable -->
                  <td class="py-3 px-4">
                    <span
                      class="cursor-pointer text-blue-600 hover:underline"
                      @click="toggleCoachActive(member)"
                    >
                      {{ member.isActive }}
                    </span>
                  </td>
                </template>

                <!-- Joueuses -->
                <template v-else-if="selectedMenu === 'Joueuses'">
                  <!-- Nom éditable -->
                  <td class="py-3 px-4">
                    <template v-if="editingLastName === member.email">
                      <input
                          v-model="editingLastNameValue"
                          class="border rounded px-2 py-1 w-24"
                          @keyup.enter="saveLastName(member)"
                          @blur="saveLastName(member)"
                          autofocus
                      />
                    </template>
                    <template v-else>
          <span
              class="cursor-pointer text-blue-600 hover:underline"
              @click="startEditLastName(member)"
          >
            {{ member.lastName }}
          </span>
                    </template>
                  </td>
                  <!-- Prénom éditable -->
                  <td class="py-3 px-4">
                    <template v-if="editingPlayerEmail === member.email">
                      <input
                          v-model="editingFirstName"
                          class="border rounded px-2 py-1 w-24"
                          @keyup.enter="saveFirstName(member)"
                          @blur="saveFirstName(member)"
                          autofocus
                      />
                    </template>
                    <template v-else>
          <span
              class="cursor-pointer text-blue-600 hover:underline"
              @click="startEditFirstName(member)"
          >
            {{ member.firstName }}
          </span>
                    </template>
                  </td>
                  <td class="py-3 px-4">{{ member.teamName }}</td>
                  <!-- Email éditable -->
                  <td class="py-3 px-4">
                    <template v-if="editingEmail === member.email">
                      <input
                          v-model="editingEmailValue"
                          class="border rounded px-2 py-1 w-44"
                          @keyup.enter="saveEmail(member)"
                          @blur="saveEmail(member)"
                          type="email"
                          autofocus
                      />
                    </template>
                    <template v-else>
          <span
              class="cursor-pointer text-blue-600 hover:underline"
              @click="startEditEmail(member)"
          >
            {{ member.email }}
          </span>
                    </template>
                  </td>
                  <!-- Numéro de maillot éditable -->
                  <td class="py-3 px-4">
                    <template v-if="editingJerseyNumber === member.email">
                      <input
                          v-model="editingJerseyNumberValue"
                          class="border rounded px-2 py-1 w-20"
                          @keyup.enter="saveJerseyNumber(member)"
                          @blur="saveJerseyNumber(member)"
                          type="number"
                          min="0"
                          autofocus
                      />
                    </template>
                    <template v-else>
          <span
              class="cursor-pointer text-blue-600 hover:underline"
              @click="startEditJerseyNumber(member)"
          >
            {{ member.jerseyNumber }}
          </span>
                    </template>
                  </td>
<td class="py-3 px-4">
                    <template v-if="editingBirthDateEmail === member.email">
                      <input
                        v-model="editingBirthDateValue"
                        class="border rounded px-2 py-1 w-32"
                        @keyup.enter="saveBirthDate(member)"
                        @blur="saveBirthDate(member)"
                        type="date"
                        autofocus
                      />
                    </template>
                    <template v-else>
                      <span
                        class="cursor-pointer text-blue-600 hover:underline"
                        @click="startEditBirthDate(member)"
                      >
                        {{ member.birthDate }}
                      </span>
                    </template>
                  </td>                  <!-- Taille éditable -->
                  <td class="py-3 px-4">
                    <template v-if="editingHeightEmail === member.email">
                      <input
                          v-model="editingHeightValue"
                          class="border rounded px-2 py-1 w-20"
                          @keyup.enter="saveHeight(member)"
                          @blur="saveHeight(member)"
                          type="number"
                          min="0"
                          autofocus
                      />
                    </template>
                    <template v-else>
          <span
              class="cursor-pointer text-blue-600 hover:underline"
              @click="startEditHeight(member)"
          >
            {{ member.heightCm }}
          </span>
                    </template>
                  </td>
                  <!-- Actif éditable -->
                  <td class="py-3 px-4">
        <span
            class="cursor-pointer text-blue-600 hover:underline"
            @click="toggleActive(member)"
        >
          {{ member.isActive }}
        </span>
                  </td>
                  <td class="py-3 px-4 space-x-2">
                    <button
                        class="px-3 py-1 text-xs rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="resetPlayerPassword(member)"
                        :disabled="resettingPlayerEmail === member.email || deletingPlayerEmail === member.email"
                    >
                      Réinitialiser MDP
                    </button>
                    <button
                        class="px-3 py-1 text-xs rounded-full border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="deletePlayer(member)"
                        :disabled="deletingPlayerEmail === member.email || resettingPlayerEmail === member.email"
                    >
                      Supprimer
                    </button>
                  </td>
                </template>

                <!-- Membres (autres) -->
                <template v-else>
                  <td class="py-3 px-4">{{ member.lastName }}</td>
                  <td class="py-3 px-4">{{ member.firstName }}</td>
                  <td class="py-3 px-4">{{ member.email }}</td>
                  <td class="py-3 px-4">{{ member.role }}</td>
                </template>
              </tr>
              </tbody>



            </table>
          </div>
        </section>
      </div>
    </main>

    <div
        v-if="showModal"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
    >
      <div class="bg-white rounded-lg p-8 shadow-lg min-w-[300px]">
        <h2 class="text-lg font-bold mb-4">Ajouter un membre</h2>
        <form @submit.prevent="addMember">
          <input
              v-model="newMember.lastName"
              type="text"
              placeholder="Nom"
              class="border border-gray-200 rounded-lg px-3 py-2 w-full mb-2"
              required
          />
          <input
              v-model="newMember.firstName"
              type="text"
              placeholder="Prénom"
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
            <div v-if="newMember.role === 'Joueuse'" class="space-y-2 mb-2">
              <input
                  v-model="newMember.jerseyNumber"
                  type="number"
                  placeholder="Numéro de maillot"
                  min="0"
                  class="border border-gray-200 rounded-lg px-3 py-2 w-full"
              />
              <input
                  v-model="newMember.birthDate"
                  type="date"
                  placeholder="Date de naissance"
                  class="border border-gray-200 rounded-lg px-3 py-2 w-full"
              />
              <input
                  v-model="newMember.heightCm"
                  type="number"
                  placeholder="Taille (cm)"
                  min="0"
                  class="border border-gray-200 rounded-lg px-3 py-2 w-full"
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
