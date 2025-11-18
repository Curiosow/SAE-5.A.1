<template>
  <main class="min-h-screen bg-[#F7F7FB]">
    <div class="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <h1 class="section-title">Matchs de l’Équipe Avesnois</h1>

      <div class="mt-8 space-y-6">
        <div v-for="(match, i) in matches_sambre" :key="i" class="card p-6 sm:p-8">
          <div class="flex items-center justify-between">
            <p class="text-[13px] text-gray-500">
              {{ (match.rencontre_conclusion_info_date_match && match.rencontre_conclusion_info_heure_match) ?
                match.rencontre_conclusion_info_date_match + ' • ' + match.rencontre_conclusion_info_heure_match.slice(0,5) : 'Pas encore de date prévue' }}
            </p>
            <span class="px-2 py-1 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">
              {{ (match.rencontres_info_equipe1_score ?? 0) !== 0 ? 'Terminé' : 'À venir' }}
            </span>
          </div>

          <div class="mt-4 flex items-center justify-between flex-wrap gap-3">
            <div class="flex items-center gap-2 min-w-0 flex-1">
              <img :src="match.logo_1" class="h-10 w-10 rounded-xl object-contain bg-white p-1 flex-shrink-0" />
              <span class="font-semibold text-gray-900">{{ match.competition_engagement_equipe_libelle_1 }}</span>
            </div>
            <div class="font-bold text-lg">
              {{ (match.rencontres_info_equipe1_score ?? '') + '-' + (match.rencontres_info_equipe2_score ?? '') }}
            </div>
            <div class="flex items-center gap-2 min-w-0 flex-1 justify-end">
              <span class="font-semibold text-gray-900 text-right">{{ match.competition_engagement_equipe_libelle_2 }}</span>
              <img :src="match.logo_2" class="h-10 w-10 rounded-xl object-contain bg-white p-1 flex-shrink-0" />
            </div>
          </div>

          <button class="mt-6 btn-gradient w-full text-sm" @click="openDetails(match)">Détails & Import CSV</button>
        </div>
      </div>
    </div>
  </main>

  <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50" @click="closeDetails"></div>
    <div class="relative bg-white rounded-lg shadow-lg max-w-lg w-full p-6 z-10">
      <div class="flex justify-between items-start mb-4">
        <h2 class="text-lg font-semibold">Gestion du Match</h2>
        <button @click="closeDetails" class="text-gray-500 text-xl">✕</button>
      </div>

      <div class="space-y-4">
        <div class="border-t pt-4">
          <h3 class="text-sm font-bold mb-2">Importer les statistiques (CSV)</h3>
          <p v-if="uploadStatus" :class="uploadStatus.type === 'error' ? 'text-red-600' : 'text-green-600'" class="text-xs mb-2">
            {{ uploadStatus.message }}
          </p>

          <div class="flex justify-end">
            <input type="file" accept=".csv" ref="fileInput" @change="handleFile" style="display:none" />
            <button class="btn-gradient px-4 py-2 text-sm" @click="triggerFileInput" :disabled="isUploading">
              {{ isUploading ? 'Importation...' : 'Sélectionner un fichier CSV' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Papa from 'papaparse';

// --- Data Loading (simulé ici, garde tes fetch existants) ---
const teamlogo = await getLogo();
const data = await fetchRencontres();
const matches_sambre = (data.docs as any[]).filter((val: any) =>
    val.competition_engagement_equipe_libelle_1 === "SAMBRE AVESNOIS HANDBALL" || val.competition_engagement_equipe_libelle_2 === "SAMBRE AVESNOIS HANDBALL"
).map((val: any) => ({
  ...val,
  logo_1: teamlogo.docs.find((t: any) => t.name === val.competition_engagement_equipe_libelle_1)?.logo || null,
  logo_2: teamlogo.docs.find((t: any) => t.name === val.competition_engagement_equipe_libelle_2)?.logo || null,
}));

// --- Modal & Import ---
const showModal = ref(false);
const selectedMatch = ref<any>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);
const uploadStatus = ref<{type: string, message: string} | null>(null);

function openDetails(match: any) {
  selectedMatch.value = match;
  showModal.value = true;
  uploadStatus.value = null;
}
function closeDetails() { showModal.value = false; }
function triggerFileInput() { fileInput.value?.click(); }

function handleFile(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input?.files?.[0];

  if (!file || !selectedMatch.value) return;

  isUploading.value = true;
  uploadStatus.value = null;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    encoding: "UTF-8",
    complete: async (results) => {
      try {
        // 1. Nettoyage CSV (inchangé)
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

        // 2. CALCUL DES INFOS MANQUANTES
        const m = selectedMatch.value;

        // Trouver l'adversaire (celui qui n'est pas Sambre)
        let adversaireName = "";
        const myTeamName = "SAMBRE AVESNOIS HANDBALL";
        if (m.competition_engagement_equipe_libelle_1 === myTeamName) {
          adversaireName = m.competition_engagement_equipe_libelle_2;
        } else {
          adversaireName = m.competition_engagement_equipe_libelle_1;
        }

        // Définir le lieu (Ville + Salle ou Domicile/Ext)
        const lieuInfo = (String(m.ville_code_postal) === '59600') ? 'Domicile' : 'Extérieur';

        // 3. Construction du Payload complet
        const payload = {
          rencontreId: String(m.id), // ID technique API
          adversaire: adversaireName,
          lieu: lieuInfo,
          dateMatch: m.rencontre_conclusion_info_date_match, // On envoie aussi la date
          events: events
        };

        console.log("Envoi du match contre", adversaireName, "à", lieuInfo);

        const res = await fetch('http://localhost:8080/api/import/match-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const text = await res.text();
          uploadStatus.value = { type: 'success', message: text };
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

// --- API Helpers ---
async function fetchRencontres(){
  const res = await fetch('http://localhost:8080/rencontre')
  return await res.json()
}
async function getLogo(){
  const res = await fetch('http://localhost:8080/teamlogo')
  return await res.json()
}
</script>

<style scoped>
.card { background: #fff; border-radius: 18px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
.btn-gradient { background: linear-gradient(90deg, #F472B6, #A78BFA); color: white; border-radius: 99px; }
.btn-gradient:disabled { opacity: 0.7; }
</style>