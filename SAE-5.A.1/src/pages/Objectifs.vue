<template>
  <main class="min-h-screen bg-[#F7F7FB]">
    <div class="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8 pt-24 pb-16">

      <div class="fixed top-20 right-4 z-50 flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm text-xs border border-gray-100 cursor-pointer select-none">
        <span :class="!isCoach ? 'font-bold text-pink-600' : 'text-gray-400'">Joueuse</span>
        <div
            @click="isCoach = !isCoach"
            class="w-9 h-5 bg-gray-200 rounded-full relative transition-colors duration-300"
            :class="{ 'bg-gradient-to-r from-pink-500 to-purple-600': isCoach }"
        >
          <div class="absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm" :class="{ 'translate-x-4': isCoach }"></div>
        </div>
        <span :class="isCoach ? 'font-bold text-purple-600' : 'text-gray-400'">Coach</span>
      </div>

      <header class="mb-8 animate-fade-in-down">
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">
          Objectifs
          <span class="inline-block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Performance
          </span>
        </h1>
        <p class="text-sm text-gray-500 mt-1 font-medium">Suivi des indicateurs clés et progression.</p>
      </header>

      <div class="flex gap-6 mb-6 border-b border-gray-200">
        <button
            @click="currentTab = 'matchs'"
            class="pb-3 text-sm font-bold transition-all relative"
            :class="currentTab === 'matchs' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'"
        >
          Matchs
          <span v-if="currentTab === 'matchs'" class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></span>
        </button>
        <button
            @click="currentTab = 'season'"
            class="pb-3 text-sm font-bold transition-all relative"
            :class="currentTab === 'season' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'"
        >
          Objectifs Saison
          <span v-if="currentTab === 'season'" class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></span>
        </button>
      </div>

      <div v-if="currentTab === 'matchs'" class="space-y-5">

        <div class="flex justify-center mb-6">
          <div class="bg-gray-100 p-1 rounded-xl inline-flex">
            <button
                @click="matchFilter = 'upcoming'"
                class="px-4 py-1.5 text-xs font-bold rounded-lg transition-all"
                :class="matchFilter === 'upcoming' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
            >
              À venir
            </button>
            <button
                @click="matchFilter = 'past'"
                class="px-4 py-1.5 text-xs font-bold rounded-lg transition-all"
                :class="matchFilter === 'past' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
            >
              Terminés
            </button>
          </div>
        </div>

        <TransitionGroup tag="div" name="list" class="relative space-y-5" appear>
          <div
              v-for="(match, i) in filteredMatches"
              :key="match.id || i"
              class="bg-white rounded-[18px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-50 overflow-hidden transition-all duration-300 hover:shadow-lg w-full"
              :class="{ 'ring-1 ring-purple-100': expandedMatchId === match.id }"
              :style="{ transitionDelay: `${i * 50}ms` }"
          >
            <div
                @click="toggleMatch(match.id)"
                class="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group select-none"
            >
              <div class="flex items-center gap-4">
                <div class="h-14 w-14 rounded-2xl bg-gray-50 p-2 flex-shrink-0 flex items-center justify-center border border-gray-100 relative">
                  <img v-if="match.adversaire_logo" :src="match.adversaire_logo" class="max-h-full max-w-full object-contain" />
                  <span v-else class="text-xs text-gray-300">VS</span>
                  <div v-if="matchFilter === 'past'" class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                <div>
                  <h3 class="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {{ match.adversaire_nom }}
                  </h3>
                  <div class="flex items-center gap-2 mt-1">
                    <p class="text-xs text-gray-500 font-medium">
                      {{ match.rencontre_conclusion_info_date_match ? formatDate(match.rencontre_conclusion_info_date_match) : 'Date à définir' }}
                    </p>
                    <span v-if="match.lieu === 'Domicile'" class="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold">DOM</span>
                    <span v-else class="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">EXT</span>

                    <span v-if="matchFilter === 'past'" class="ml-2 text-xs font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                        {{ match.rencontres_info_equipe1_score }} - {{ match.rencontres_info_equipe2_score }}
                     </span>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                <div class="text-right">
                  <span class="text-xs font-bold text-gray-400 block">Objectifs</span>
                  <span class="text-sm font-bold text-gray-800">{{ getMatchObjectives(match.id).length }} définis</span>
                </div>
                <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-all duration-300">
                  <svg :class="{'rotate-180': expandedMatchId === match.id}" class="w-5 h-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div v-show="expandedMatchId === match.id" class="border-t border-gray-100 bg-[#FAFAFC] p-5 sm:p-6 animate-fade-in">

              <div v-if="getMatchObjectives(match.id).length > 0" class="grid gap-3 sm:grid-cols-2">
                <div
                    v-for="obj in getMatchObjectives(match.id)"
                    :key="obj.id"
                    class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start relative overflow-hidden group/obj"
                >
                  <div class="absolute left-0 top-0 bottom-0 w-1" :class="getStatusColor(obj.status)"></div>
                  <div class="pl-2">
                    <h4 class="font-bold text-gray-800 text-sm">{{ obj.title }}</h4>
                    <div class="flex items-center gap-2 mt-1.5">
                      <span class="text-xs font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        {{ obj.operator }} {{ obj.target_value }}
                      </span>
                      <span v-if="obj.current_value !== null" class="text-xs font-bold" :class="obj.status === 'success' ? 'text-green-600' : 'text-red-500'">
                        (Fait: {{ obj.current_value }})
                      </span>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-1">
                     <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide" :class="getStatusBadge(obj.status)">
                        {{ getStatusLabel(obj.status) }}
                     </span>
                    <button v-if="isCoach" @click.stop="deleteObjective(obj.id)" class="mt-1 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover/obj:opacity-100">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-4 text-gray-400 text-sm italic">
                Aucun objectif défini pour ce match.
              </div>

              <button
                  v-if="isCoach && matchFilter === 'upcoming'"
                  @click="openAddModal(match.id, match.adversaire_nom)"
                  class="mt-4 w-full group relative overflow-hidden rounded-xl bg-white p-[1px] transition-all hover:shadow-md"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-pink-500/50 to-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="relative bg-white rounded-[11px] border border-dashed border-gray-300 group-hover:border-transparent py-3 flex items-center justify-center gap-2 transition-all">
                  <span class="text-gray-400 group-hover:text-purple-600 font-bold text-lg leading-none">+</span>
                  <span class="text-sm font-bold text-gray-500 group-hover:text-purple-700">Ajouter un objectif</span>
                </div>
              </button>
            </div>
          </div>
        </TransitionGroup>

        <div v-if="filteredMatches.length === 0" class="text-center py-10">
          <p class="text-4xl mb-2">📅</p>
          <p class="text-gray-400 font-medium">Aucun match trouvé.</p>
          <p v-if="matchFilter === 'upcoming'" class="text-sm text-purple-600 mt-2 cursor-pointer hover:underline font-bold" @click="matchFilter = 'past'">
            Voir les matchs terminés ?
          </p>
        </div>
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2">
        <div v-for="obj in seasonObjectives" :key="obj.id" class="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 flex justify-between items-start relative overflow-hidden group">
          <div class="absolute left-0 top-0 bottom-0 w-1" :class="getStatusColor(obj.status)"></div>
          <div class="pl-2">
            <h3 class="font-bold text-gray-800">{{ obj.title }}</h3>
            <div class="mt-2 text-sm text-gray-500 font-mono bg-gray-50 inline-block px-2 py-1 rounded">
              Cible : {{ obj.operator }} {{ obj.target_value }}
            </div>
            <div v-if="obj.current_value !== null" class="mt-1 text-xs font-bold text-gray-600">
              Actuel : {{ obj.current_value }}
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <span class="text-[10px] bg-purple-50 text-purple-700 px-2 py-1 rounded-full font-bold uppercase">Saison</span>
            <button v-if="isCoach" @click="deleteObjective(obj.id)" class="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">Supprimer</button>
          </div>
        </div>

        <button
            v-if="isCoach"
            @click="openAddModal(null, 'Saison')"
            class="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[20px] flex flex-col items-center justify-center p-8 text-gray-400 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50/20 transition-all cursor-pointer"
        >
          <span class="text-2xl mb-1">+</span>
          <span class="text-sm font-bold">Nouvel objectif saison</span>
        </button>
      </div>

    </div>
  </main>

  <Transition name="modal">
    <div v-if="showModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

      <div class="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 z-10 transform transition-all duration-300">
        <h3 class="text-xl font-extrabold text-gray-900 mb-1">Nouvel Objectif</h3>
        <p class="text-sm text-gray-500 mb-6">Pour : <span class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">{{ form.targetName }}</span></p>

        <div class="space-y-4">
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Intitulé</label>
            <input v-model="form.title" type="text" placeholder="Ex: Pertes de balles" class="w-full bg-gray-50 border border-gray-200 rounded-xl text-sm px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all">
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="col-span-1">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Opérateur</label>
              <select v-model="form.operator" class="w-full bg-gray-50 border border-gray-200 rounded-xl text-sm px-2 py-3 focus:ring-2 focus:ring-purple-500 outline-none">
                <option value="<"> < (Moins)</option>
                <option value=">"> > (Plus)</option>
                <option value="="> = (Égal)</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Valeur Cible</label>
              <input v-model="form.targetValue" type="number" placeholder="Ex: 10" class="w-full bg-gray-50 border border-gray-200 rounded-xl text-sm px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none">
            </div>
          </div>
        </div>

        <div class="mt-8 flex gap-3">
          <button @click="closeModal" class="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 text-sm transition-colors">Annuler</button>
          <button @click="saveObjective" class="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transform active:scale-95 transition-all text-sm">
            Valider
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

definePageMeta({ ssr: false });

const apiUrl = "http://localhost:8080";

// --- STATE ---
const isCoach = ref(true);
const currentTab = ref('matchs');
const matchFilter = ref<'upcoming' | 'past'>('upcoming');
const expandedMatchId = ref<any>(null);
const matches_sambre = ref<any[]>([]);
const allObjectives = ref<any[]>([]);
const showModal = ref(false);
const form = ref({ matchId: null as any, targetName: '', title: '', operator: '<', targetValue: '' });

// --- CHARGEMENT ---
onMounted(async () => {
  await loadData();
});

async function loadData() {
  console.log("Chargement...");

  // 1. MATCHS
  try {
    const resLogo = await fetch(`${apiUrl}/teamlogo`);
    const teamlogo = await resLogo.json();
    const resMatchs = await fetch(`${apiUrl}/rencontre`);
    const dataMatchs = await resMatchs.json();

    if(dataMatchs && dataMatchs.docs) {
      matches_sambre.value = dataMatchs.docs
          .filter((m: any) => m.competition_engagement_equipe_libelle_1 === "SAMBRE AVESNOIS HANDBALL" || m.competition_engagement_equipe_libelle_2 === "SAMBRE AVESNOIS HANDBALL")
          .map((m: any) => {
            const isHome = m.competition_engagement_equipe_libelle_1 === "SAMBRE AVESNOIS HANDBALL";
            const advName = isHome ? m.competition_engagement_equipe_libelle_2 : m.competition_engagement_equipe_libelle_1;
            const advLogo = teamlogo.docs.find((t: any) => t.name === advName)?.logo || null;

            return {
              ...m,
              adversaire_nom: advName,
              adversaire_logo: advLogo,
              lieu: (String(m.ville_code_postal) === '59600') ? 'Domicile' : 'Extérieur'
            };
          });
    }
  } catch(e) { console.error(e); }

  // 2. OBJECTIFS
  try { await fetchObjectives(); } catch(e) { console.error(e); }
}

async function fetchObjectives() {
  const res = await fetch(`${apiUrl}/objective`);
  if(res.ok) {
    const data = await res.json();
    // On lit data.docs pour la liste
    allObjectives.value = data.docs || [];
  }
}

async function saveObjective() {
  if(!form.value.title || !form.value.targetValue) return;

  const payload = {
    match_id: form.value.matchId || 0, // Java attend un int
    type: form.value.matchId ? 'match' : 'season',
    title: form.value.title,
    operator: form.value.operator,
    target_value: Number(form.value.targetValue),
    status: 'pending'
  };

  try {
    const res = await fetch(`${apiUrl}/objective`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });

    if(res.ok) {
      await fetchObjectives();
      closeModal();
    } else {
      alert("Erreur serveur lors de l'ajout.");
    }
  } catch(e) { console.error(e); }
}

async function deleteObjective(id: number) {
  if(!confirm("Supprimer ?")) return;
  try {
    const res = await fetch(`${apiUrl}/objective/${id}`, { method: 'DELETE' });
    if(res.ok) {
      allObjectives.value = allObjectives.value.filter(o => o.id !== id);
    }
  } catch(e) { console.error(e); }
}

// --- LOGIQUE UI ---

const filteredMatches = computed(() => {
  const today = new Date();
  today.setHours(0,0,0,0);

  const list = matches_sambre.value.filter(m => {
    if(!m.rencontre_conclusion_info_date_match) return false;
    const mDate = new Date(m.rencontre_conclusion_info_date_match);
    return matchFilter.value === 'upcoming' ? mDate >= today : mDate < today;
  });

  return list.sort((a, b) => {
    const dA = new Date(a.rencontre_conclusion_info_date_match).getTime();
    const dB = new Date(b.rencontre_conclusion_info_date_match).getTime();
    return matchFilter.value === 'upcoming' ? dA - dB : dB - dA;
  });
});

const seasonObjectives = computed(() => allObjectives.value.filter(o => o.type === 'season'));

function getMatchObjectives(matchId: number) {
  return allObjectives.value.filter(o => o.match_id == matchId && o.type === 'match');
}

function toggleMatch(id: any) {
  expandedMatchId.value = expandedMatchId.value === id ? null : id;
}

function openAddModal(matchId: any, name: string) {
  form.value = { matchId, targetName: name, title: '', operator: '<', targetValue: '' };
  showModal.value = true;
}
function closeModal() { showModal.value = false; }

function formatDate(d: string) {
  if(!d) return '';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Helpers status
function getStatusColor(s: string) { return s === 'success' ? 'bg-green-500' : (s === 'failed' ? 'bg-red-500' : 'bg-blue-400'); }
function getStatusBadge(s: string) { return s === 'success' ? 'bg-green-100 text-green-700' : (s === 'failed' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-600'); }
function getStatusLabel(s: string) { return s === 'success' ? 'Atteint' : (s === 'failed' ? 'Manqué' : 'En cours'); }

</script>

<style scoped>
/* Animations */
.animate-fade-in-down { animation: fadeInDown 0.6s ease-out forwards; }
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(10px); }

.modal-enter-active, .modal-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }

/* ANIMATIONS DE LISTE FLUIDES */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-active {
  position: absolute;
  width: 100%;
  z-index: -1;
  left: 0;
  top: 0;
}
</style>