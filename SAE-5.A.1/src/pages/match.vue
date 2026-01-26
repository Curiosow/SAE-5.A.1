<template>
  <main class="min-h-screen bg-[#F7F7FB]">
    <div class="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8 pt-24 pb-16">

      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 animate-fade-in-down">
        <h1 class="section-title">Matchs de l’Équipe Avesnois</h1>

        <button
            @click="openCustomMatch"
            class="group relative overflow-hidden rounded-2xl bg-white p-[2px] transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 w-full sm:w-auto"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-100 transition-opacity"></div>

          <div class="relative flex items-center justify-center gap-3 rounded-xl bg-white px-5 py-2.5 transition-colors group-hover:bg-opacity-90">
            <div class="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-3.5 h-3.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>

            <span class="font-bold text-gray-800 text-sm group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 transition-all">
              Ajouter un match hors-liste
            </span>
          </div>
        </button>
      </header>

      <TransitionGroup
          tag="div"
          name="list"
          class="space-y-6"
          appear
      >
        <div
            v-for="(match, i) in matches_sambre"
            :key="match.id || i"
            class="card p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
            :style="{ transitionDelay: `${i * 50}ms` }"
        >
          <div class="flex items-center justify-between">
            <p class="text-[13px] text-gray-500 font-medium">
              {{ (match.rencontre_conclusion_info_date_match && match.rencontre_conclusion_info_heure_match) ?
                match.rencontre_conclusion_info_date_match + ' • ' + match.rencontre_conclusion_info_heure_match.slice(0,5) : 'Pas encore de date prévue' }}
            </p>
            <span
                class="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-colors duration-300"
                :class="(match.rencontres_info_equipe1_score ?? 0) !== 0
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-500 group-hover:bg-pink-100 group-hover:text-pink-600'"
            >
              {{ (match.rencontres_info_equipe1_score ?? 0) !== 0 ? 'Terminé' : 'À venir' }}
            </span>
          </div>

          <div class="mt-5 flex items-center justify-between flex-wrap gap-3">
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <div class="h-12 w-12 rounded-2xl bg-gray-50 p-2 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <img :src="match.logo_1" class="max-h-full max-w-full object-contain" />
              </div>
              <span class="font-bold text-gray-900 truncate transition-colors group-hover:text-purple-600">
                {{ match.competition_engagement_equipe_libelle_1 }}
              </span>
            </div>

            <div class="font-black text-2xl px-4 text-gray-800 tabular-nums tracking-tight">
              {{ (match.rencontres_info_equipe1_score ?? '') }} - {{ (match.rencontres_info_equipe2_score ?? '') }}
            </div>

            <div class="flex items-center gap-3 min-w-0 flex-1 justify-end">
              <span class="font-bold text-gray-900 text-right truncate transition-colors group-hover:text-purple-600">
                {{ match.competition_engagement_equipe_libelle_2 }}
              </span>
              <div class="h-12 w-12 rounded-2xl bg-gray-50 p-2 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <img :src="match.logo_2" class="max-h-full max-w-full object-contain" />
              </div>
            </div>
          </div>

          <button
              class="mt-6 w-full py-3 rounded-full text-sm font-semibold border-2 border-transparent bg-clip-padding transition-all duration-300 relative overflow-hidden"
              :class="(match.rencontres_info_equipe1_score ?? 0) !== 0 ? 'bg-gray-50 text-gray-600 hover:bg-gray-100' : 'btn-gradient text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50'"
              @click="openDetails(match)"
          >
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
          <div>
            <h2 class="text-2xl font-bold text-gray-900">
              {{ isCustomMode ? 'Nouveau Match' : 'Gestion du Match' }}
            </h2>
            <p v-if="!isCustomMode" class="text-sm text-gray-500 mt-1 font-medium">
              Vs {{ opponentNameDisplay }}
            </p>
          </div>
          <button @click="closeDetails" class="bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-red-500 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 transform hover:rotate-90">
            <span class="text-xl">✕</span>
          </button>
        </div>

        <div class="space-y-6">

          <Transition name="slide-fade">
            <div v-if="isCustomMode" class="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Adversaire</label>
                <input v-model="customForm.adversaire" type="text" placeholder="Nom de l'équipe adverse" class="w-full bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date</label>
                  <input v-model="customForm.date" type="date" class="w-full bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Lieu</label>
                  <select v-model="customForm.lieu" class="w-full bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="Domicile">Domicile</option>
                    <option value="Extérieur">Extérieur</option>
                  </select>
                </div>
              </div>
            </div>
          </Transition>

          <div>
            <label class="block text-sm font-bold text-gray-900 mb-3">Importer pour :</label>
            <div class="relative bg-gray-100 p-1.5 rounded-full flex cursor-pointer select-none h-12">
              <div
                  class="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-full shadow-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  :class="importTarget === 'sambre' ? 'left-1.5' : 'left-[calc(50%+3px)]'"
              ></div>

              <div class="z-10 w-1/2 flex items-center justify-center" @click="importTarget = 'sambre'">
                <span class="text-sm font-bold transition-colors duration-200" :class="importTarget === 'sambre' ? 'text-gray-900' : 'text-gray-500'">Sambre</span>
              </div>
              <div class="z-10 w-1/2 flex items-center justify-center" @click="importTarget = 'adversaire'">
                <span class="text-sm font-bold truncate px-2 transition-colors duration-200" :class="importTarget === 'adversaire' ? 'text-gray-900' : 'text-gray-500'">
                  {{ opponentNameDisplay }}
                </span>
              </div>
            </div>
          </div>

          <div class="pt-2">
            <div v-if="uploadStatus" class="mb-3 animate-fade-in text-center p-2 rounded-lg text-xs font-bold" :class="uploadStatus.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'">
              {{ uploadStatus.message }}
            </div>

            <input type="file" accept=".csv" ref="fileInput" @change="handleFile" class="hidden" />
            <button
                class="btn-gradient w-full py-4 rounded-2xl text-white font-bold text-sm shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transform active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2"
                @click="triggerFileInput"
                :disabled="isUploading || (isCustomMode && !isCustomFormValid)"
                :class="{ 'opacity-50 cursor-not-allowed': isCustomMode && !isCustomFormValid }"
            >
              <span v-if="isUploading" class="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
              <span v-else>Sélectionner le CSV</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// --- (La logique Script reste 100% identique à ma réponse précédente pour garantir le fonctionnement) ---
// Juste rappel : ssr: false, papaparse, API calls...
definePageMeta({ ssr: false });
const { $papaparse } = useNuxtApp();
const apiUrl = useApiUrl();

const teamlogo = await getLogo();
const data = await fetchRencontres();
const matches_sambre = (data.docs as any[]).filter((val: any) =>
    val.competition_engagement_equipe_libelle_1 === "SAMBRE AVESNOIS HANDBALL" || val.competition_engagement_equipe_libelle_2 === "SAMBRE AVESNOIS HANDBALL"
).map((val: any) => ({
  ...val,
  logo_1: teamlogo.docs.find((t: any) => t.name === val.competition_engagement_equipe_libelle_1)?.logo || null,
  logo_2: teamlogo.docs.find((t: any) => t.name === val.competition_engagement_equipe_libelle_2)?.logo || null,
}));

const showModal = ref(false);
const isCustomMode = ref(false);
const selectedMatch = ref<any>(null);
const importTarget = ref<'sambre' | 'adversaire'>('sambre');
const fileInput = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);
const uploadStatus = ref<{type: string, message: string} | null>(null);
const customForm = ref({ adversaire: '', date: new Date().toISOString().split('T')[0], lieu: 'Domicile' });

const opponentNameDisplay = computed(() => {
  if (isCustomMode.value) return customForm.value.adversaire.trim() !== '' ? customForm.value.adversaire : 'Adversaire';
  if (selectedMatch.value) {
    const m = selectedMatch.value;
    return (m.competition_engagement_equipe_libelle_1 === "SAMBRE AVESNOIS HANDBALL")
        ? m.competition_engagement_equipe_libelle_2
        : m.competition_engagement_equipe_libelle_1;
  }
  return 'Adversaire';
});

const isCustomFormValid = computed(() => customForm.value.adversaire.trim() !== '' && customForm.value.date !== '');

function openDetails(match: any) {
  isCustomMode.value = false;
  selectedMatch.value = match;
  importTarget.value = 'sambre';
  uploadStatus.value = null;
  showModal.value = true;
}

function openCustomMatch() {
  isCustomMode.value = true;
  selectedMatch.value = null;
  importTarget.value = 'sambre';
  customForm.value = { adversaire: '', date: new Date().toISOString().split('T')[0], lieu: 'Domicile' };
  uploadStatus.value = null;
  showModal.value = true;
}

function closeDetails() { showModal.value = false; }
function triggerFileInput() { fileInput.value?.click(); }

function handleFile(e: Event) {
  // ... (Code logique identique à la réponse précédente pour le parsing CSV) ...
  // Je ne le répète pas pour ne pas surcharger, mais copie-colle la fonction handleFile précédente ici.
  const input = e.target as HTMLInputElement;
  const file = input?.files?.[0];

  if (!file) return;
  if (isCustomMode.value && !isCustomFormValid.value) return;

  isUploading.value = true;
  uploadStatus.value = null;

  $papaparse.parse(file, {
    header: true,
    skipEmptyLines: true,
    encoding: "UTF-8",
    complete: async (results) => {
      try {
        const events = results.data.map((row: any) => ({
          nom: row['Nom']?.trim(),
          position: parseFloat((row['Position'] || "0").replace(',', '.')),
          duree: parseFloat((row['Durée:'] || "0").replace(',', '.')),
          defense: row['Défenses']?.trim(),
          resultat: row['Résultats']?.trim(),
          defenseplus: row['Déf +']?.trim(),
          joueuse: row['Joueuses']?.trim(),
          secteur: row['Secteurs']?.trim(),
          attaqueplacees: row['Attaques placées']?.trim(),
          enclenchements06: row['Enclenchements 06']?.trim(),
          lieupb: row['Lieu PB']?.trim(),
          passed: row['Passes D']?.trim(),
          repli: row['Repli']?.trim(),
          defensemoins: row['Déf -']?.trim(),
          enclenchementstransier: row['Enclenchements transition ER']?.trim(),
          grandespace: row['Grand Espace']?.trim(),
          jets7m: row['Jets de 7m']?.trim(),
          enclenchements6c5: row['Enclenchements 6 c 5']?.trim()
        })).filter((e: any) => e.nom);

        let payload: any = {
          events: events,
          isOpponent: importTarget.value === 'adversaire'
        };

        if (isCustomMode.value) {
          payload = {
            ...payload,
            rencontreId: null,
            adversaire: customForm.value.adversaire,
            dateMatch: customForm.value.date,
            lieu: customForm.value.lieu,
          };
        } else {
          const m = selectedMatch.value;
          // Utilisation de la computed logic ou refaire ici pour être sûr
          const myTeamName = "SAMBRE AVESNOIS HANDBALL";
          let adversaireName = (m.competition_engagement_equipe_libelle_1 === myTeamName)
              ? m.competition_engagement_equipe_libelle_2
              : m.competition_engagement_equipe_libelle_1;

          const lieuInfo = (String(m.ville_code_postal) === '59600') ? 'Domicile' : 'Extérieur';

          payload = {
            ...payload,
            rencontreId: String(m.id),
            adversaire: adversaireName,
            dateMatch: m.rencontre_conclusion_info_date_match,
            lieu: lieuInfo,
          };
        }

        const res = await fetch(`${apiUrl}/api/import/match-events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const text = await res.text();
          uploadStatus.value = { type: 'success', message: 'Import réussi !' };
          if (isCustomMode.value) setTimeout(closeDetails, 1500);
        } else {
          throw new Error("Erreur serveur");
        }

      } catch (err) {
        console.error(err);
        uploadStatus.value = { type: 'error', message: "Echec de l'import." };
      } finally {
        isUploading.value = false;
        input.value = '';
      }
    }
  });
}

async function fetchRencontres(){
  const res = await fetch(`${apiUrl}/rencontre`)
  return await res.json()
}
async function getLogo(){
  const res = await fetch(`${apiUrl}/teamlogo`)
  return await res.json()
}
</script>

<style scoped>
/* Identité visuelle préservée */
.section-title { font-size: 1.875rem; font-weight: 800; color: #1F2937; letter-spacing: -0.025em; }
.card { background: #fff; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.01); }
.btn-gradient { background: linear-gradient(90deg, #F472B6 0%, #A78BFA 100%); }

/* ANIMATIONS CSS */

/* 1. Fade In Down pour le header */
.animate-fade-in-down { animation: fadeInDown 0.6s ease-out forwards; }
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 2. Transition de liste (Cascade) */
.list-enter-active,
.list-leave-active { transition: all 0.5s ease; }
.list-enter-from,
.list-leave-to { opacity: 0; transform: translateY(20px); }

/* 3. Transition Modale (Pop / Scale) */
.modal-enter-active, .modal-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); } /* Courbe easing "Apple-like" */
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95) translateY(10px); }
.modal-enter-to, .modal-leave-from { opacity: 1; transform: scale(1) translateY(0); }

/* 4. Slide Fade pour le formulaire Custom */
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateX(20px); opacity: 0; }

.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>