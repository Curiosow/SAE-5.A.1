<template>
  <main class="min-h-screen bg-[#F7F7FB]">
    <div class="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8 pt-24 pb-16">

      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 animate-fade-in-down">
        <h1 class="section-title">Matchs de l’Équipe Avesnois</h1>
        <button @click="openCustomMatch" class="group relative overflow-hidden rounded-2xl bg-white p-[2px] transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 w-full sm:w-auto">
          <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-100 transition-opacity"></div>
          <div class="relative flex items-center justify-center gap-3 rounded-xl bg-white px-5 py-2.5 transition-colors group-hover:bg-opacity-90">
            <span class="font-bold text-gray-800 text-sm group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 transition-all">+ Match hors-liste</span>
          </div>
        </button>
      </header>

      <TransitionGroup tag="div" name="list" class="space-y-6" appear>
        <div v-for="(match, i) in matches_sambre" :key="match.id || i" class="card p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group" :style="{ transitionDelay: `${i * 50}ms` }">
          <div class="flex items-center justify-between">
            <p class="text-[13px] text-gray-500 font-medium">{{ (match.rencontre_conclusion_info_date_match) ? formatDate(match.rencontre_conclusion_info_date_match) : 'Date inconnue' }}</p>
            <span class="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-colors duration-300" :class="hasScore(match) ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'">{{ hasScore(match) ? 'Terminé' : 'À venir' }}</span>
          </div>
          <div class="mt-5 flex items-center justify-between flex-wrap gap-3">
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <img v-if="match.logo_1" :src="match.logo_1" class="h-10 w-10 object-contain" />
              <span class="font-bold text-gray-900 truncate">{{ match.competition_engagement_equipe_libelle_1 }}</span>
            </div>
            <div class="font-black text-2xl px-4 text-gray-800 tabular-nums tracking-tight">{{ (match.rencontres_info_equipe1_score ?? '') }} - {{ (match.rencontres_info_equipe2_score ?? '') }}</div>
            <div class="flex items-center gap-3 min-w-0 flex-1 justify-end">
              <span class="font-bold text-gray-900 text-right truncate">{{ match.competition_engagement_equipe_libelle_2 }}</span>
              <img v-if="match.logo_2" :src="match.logo_2" class="h-10 w-10 object-contain" />
            </div>
          </div>
          <button class="mt-6 w-full py-3 rounded-full text-sm font-semibold border-2 border-transparent bg-clip-padding transition-all duration-300 relative overflow-hidden" :class="hasScore(match) ? 'bg-gray-50 text-gray-600 hover:bg-gray-100' : 'btn-gradient text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50'" @click="openDetails(match)">
            Gérer & Importer CSV
          </button>
        </div>
      </TransitionGroup>
    </div>
  </main>

  <Transition name="modal">
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" @click="closeDetails"></div>
      <div class="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 z-10 transform transition-all duration-300 overflow-hidden">

        <div class="flex justify-between items-start mb-6">
          <h2 class="text-2xl font-bold text-gray-900">{{ isCustomMode ? 'Nouveau Match' : 'Importation Données' }}</h2>
          <button @click="closeDetails" class="text-gray-400 hover:text-red-500 text-xl">✕</button>
        </div>

        <div class="space-y-6">

          <div>
            <label class="block text-sm font-bold text-gray-900 mb-3">Importer pour quelle équipe ?</label>
            <div class="relative bg-gray-100 p-1.5 rounded-full flex cursor-pointer select-none h-12 mb-4">
              <div class="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-full shadow-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]" :class="importTarget === 'sambre' ? 'left-1.5' : 'left-[calc(50%+3px)]'"></div>

              <div class="z-10 w-1/2 flex items-center justify-center font-bold text-sm transition-colors" :class="importTarget === 'sambre' ? 'text-gray-900' : 'text-gray-500'" @click="changeTarget('sambre')">
                Sambre
              </div>
              <div class="z-10 w-1/2 flex items-center justify-center font-bold text-sm transition-colors" :class="importTarget === 'adversaire' ? 'text-gray-900' : 'text-gray-500'" @click="changeTarget('adversaire')">
                Adversaire
              </div>
            </div>

            <div v-if="targetTeamId" class="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold">✓</div>
              <div>
                <p class="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Équipe identifiée</p>
                <p class="text-sm font-bold text-emerald-900">{{ getTeamName(targetTeamId) }}</p>
              </div>
            </div>

            <div v-else class="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold">!</div>
              <div>
                <p class="text-[10px] uppercase font-bold text-red-500 tracking-wider">Erreur d'identification</p>
                <p class="text-xs font-medium text-red-800">
                  Impossible de trouver l'équipe "{{ importTarget === 'sambre' ? SAMBRE_NAME : opponentNameDisplay }}" dans la base de données.
                </p>
              </div>
            </div>
          </div>

          <div class="pt-2">
            <div v-if="uploadStatus" class="mb-3 animate-fade-in text-center p-2 rounded-lg text-xs font-bold" :class="uploadStatus.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'">
              {{ uploadStatus.message }}
            </div>

            <input type="file" accept=".csv" ref="fileInput" @change="handleFile" class="hidden" />
            <button
                class="btn-gradient w-full py-4 rounded-2xl text-white font-bold text-sm shadow-xl flex justify-center items-center gap-2 transition-all hover:shadow-purple-500/40 active:scale-[0.98]"
                @click="triggerFileInput"
                :disabled="isUploading || !targetTeamId"
                :class="{ 'opacity-50 cursor-not-allowed': isUploading || !targetTeamId }"
            >
              <span v-if="isUploading" class="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
              <span v-else>Importer le CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

definePageMeta({ ssr: false });
const { $papaparse } = useNuxtApp();
const apiUrl = useApiUrl();

const teamsList = ref<any[]>([]);
const matches_sambre = ref<any[]>([]);
const SAMBRE_NAME = "SAMBRE AVESNOIS HANDBALL";

// UI States
const showModal = ref(false);
const isCustomMode = ref(false);
const selectedMatch = ref<any>(null);
const importTarget = ref<'sambre' | 'adversaire'>('sambre');
const fileInput = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);
const uploadStatus = ref<{type: string, message: string} | null>(null);
const customForm = ref({ adversaire: '', date: '', lieu: 'Domicile' });

// ID calculé automatiquement
const targetTeamId = ref<string | null>(null);

const opponentNameDisplay = computed(() => {
  if (isCustomMode.value) return customForm.value.adversaire || 'Adversaire';
  if (!selectedMatch.value) return 'Adversaire';
  const m = selectedMatch.value;
  return (m.competition_engagement_equipe_libelle_1 === SAMBRE_NAME) ? m.competition_engagement_equipe_libelle_2 : m.competition_engagement_equipe_libelle_1;
});

const cleanStr = (s: string) => s ? s.toLowerCase().replace(/\s+/g, ' ').trim() : "";

// --- INIT ---
onMounted(async () => {
  try {
    const [teamData, matchData] = await Promise.all([
      fetch(`${apiUrl}/teamlogo`).then(r => r.json()),
      fetch(`${apiUrl}/rencontre`).then(r => r.json())
    ]);
    teamsList.value = teamData.docs || [];

    matches_sambre.value = (matchData.docs as any[])
        .filter((val: any) => val.competition_engagement_equipe_libelle_1 === SAMBRE_NAME || val.competition_engagement_equipe_libelle_2 === SAMBRE_NAME)
        .map((val: any) => ({
          ...val,
          logo_1: teamsList.value.find((t: any) => cleanStr(t.name) === cleanStr(val.competition_engagement_equipe_libelle_1))?.logo,
          logo_2: teamsList.value.find((t: any) => cleanStr(t.name) === cleanStr(val.competition_engagement_equipe_libelle_2))?.logo,
        }));
  } catch (e) { console.error("Erreur init", e); }
});

// --- ACTIONS ---
function openDetails(match: any) {
  isCustomMode.value = false;
  selectedMatch.value = match;
  uploadStatus.value = null;
  changeTarget('sambre'); // On initialise sur Sambre
  showModal.value = true;
}

function openCustomMatch() {
  isCustomMode.value = true;
  selectedMatch.value = null;
  changeTarget('sambre');
  showModal.value = true;
}

// Nouvelle fonction de sélection auto
function changeTarget(target: 'sambre' | 'adversaire') {
  importTarget.value = target;
  let nameToFind = SAMBRE_NAME;

  if (target === 'adversaire') {
    // Si c'est un match custom, on ne peut pas deviner l'ID
    if (isCustomMode.value) {
      targetTeamId.value = null;
      return;
    }
    nameToFind = opponentNameDisplay.value;
  }

  // Recherche intelligente
  const found = teamsList.value.find(t => cleanStr(t.name) === cleanStr(nameToFind));
  targetTeamId.value = found ? found.id : null;
}

function getTeamName(id: string) {
  const t = teamsList.value.find(x => x.id === id);
  return t ? t.name : 'Inconnu';
}

function closeDetails() { showModal.value = false; }
function triggerFileInput() { fileInput.value?.click(); }
function hasScore(m: any) { return (m.rencontres_info_equipe1_score !== null && m.rencontres_info_equipe1_score !== undefined); }
function formatDate(d: string) { if(!d) return ''; return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }); }

// --- IMPORT ---
function handleFile(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input?.files?.[0];
  if (!file) return;

  if (!targetTeamId.value) {
    alert("Impossible d'importer : L'équipe n'est pas reconnue.");
    return;
  }

  isUploading.value = true;
  uploadStatus.value = null;

  $papaparse.parse(file, {
    header: true, skipEmptyLines: true, encoding: "UTF-8",
    complete: async (results) => {
      try {
        const events = results.data.map((row: any) => ({
          // Mapping standard
          nom: row['Nom']?.trim(),
          position: parseFloat((row['Position'] || "0").replace(',', '.')),
          duree: parseFloat((row['Durée:'] || "0").replace(',', '.')),
          defense: row['Défenses']?.trim(),
          resultat: row['Résultats']?.trim(),
          defense_plus: row['Déf +']?.trim(),
          joueuse: row['Joueuses']?.trim(),
          secteur: row['Secteurs']?.trim(),
          attaque_placees: row['Attaques placées']?.trim(),
          enclenchements_06: row['Enclenchements 06']?.trim(),
          lieu_pb: row['Lieu PB']?.trim(),
          passed: row['Passes D']?.trim(),
          repli: row['Repli']?.trim(),
          defense_moins: row['Déf -']?.trim(),
          enclenchements_transier: row['Enclenchements transition ER']?.trim(),
          grand_espace: row['Grand Espace']?.trim(),
          jets_7m: row['Jets de 7m']?.trim(),
          enclenchements_6c5: row['Enclenchements 6 c 5']?.trim(),

          // Mapping enrichi
          temps_format: row['Temps_Format'],
          mi_temps: parseInt(row['Mi_temps']) || 1,
          money_time: (row['Money_Time'] === 'True' || row['Money_Time'] === 'TRUE' || row['Money_Time'] === true),
          phase_jeu: row['Phase_Jeu'],
          score_sambre: parseInt(row['Score_Sambre']) || 0,
          score_adversaire: parseInt(row['Score_Adversaire']) || 0
        })).filter((e: any) => e.nom);

        let payload: any = {
          events: events,
          teamId: targetTeamId.value // Utilisation de l'ID auto-détecté
        };

        if (isCustomMode.value) {
          payload.rencontreId = null;
          payload.adversaire = customForm.value.adversaire;
          payload.dateMatch = customForm.value.date;
          payload.lieu = customForm.value.lieu;
        } else {
          const m = selectedMatch.value;
          payload.rencontreId = String(m.id);
          payload.adversaire = opponentNameDisplay.value;
          payload.dateMatch = m.rencontre_conclusion_info_date_match;
          payload.lieu = (String(m.ville_code_postal) === '59600') ? 'Domicile' : 'Extérieur';
        }

        const res = await fetch(`${apiUrl}/api/import/match-events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          uploadStatus.value = { type: 'success', message: 'Import réussi !' };
          setTimeout(closeDetails, 1500);
        } else {
          throw new Error(await res.text());
        }
      } catch (err: any) {
        console.error(err);
        uploadStatus.value = { type: 'error', message: err.message };
      } finally {
        isUploading.value = false;
        input.value = '';
      }
    }
  });
}
</script>

<style scoped>
.section-title { font-size: 1.875rem; font-weight: 800; color: #1F2937; letter-spacing: -0.025em; }
.card { background: #fff; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.01); }
.btn-gradient { background: linear-gradient(90deg, #F472B6 0%, #A78BFA 100%); }
.animate-fade-in-down { animation: fadeInDown 0.6s ease-out forwards; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
.list-enter-active, .list-leave-active { transition: all 0.5s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(20px); }
.modal-enter-active, .modal-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95) translateY(10px); }
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>