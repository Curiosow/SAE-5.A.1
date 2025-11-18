      <template>
        <div>
          <pre>{{ selectedMatch?.rencontres_id }}</pre>
        </div>
        <main class="min-h-screen bg-[#F7F7FB]">
          <div class="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8 pt-24 pb-16">
            <h1 class="section-title">Matchs de l’Équipe Avesnois</h1>

            <div class="mt-8 space-y-6">
              <div v-for="(match, i) in matches_sambre" :key="i" class="card p-6 sm:p-8">
                <!-- En-tête -->
                <div class="flex items-center justify-between">
                  <p class="text-[13px] text-gray-500">
                    {{ (match.rencontre_conclusion_info_date_match && match.rencontre_conclusion_info_heure_match) ?
                      match.rencontre_conclusion_info_date_match + ' • ' + match.rencontre_conclusion_info_heure_match.slice(0,5) : 'Pas encore de date prévue' }}
                  </p>
                  <span
                      class="px-2 py-1 rounded-full text-[11px] font-medium"
                      :class="match.rencontres_info_equipe1_score === 0
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-100 text-blue-700'"
                  >
                    {{ (match.rencontres_info_equipe1_score ?? 0) !== 0 ? 'Terminé' : 'À venir' }}
                  </span>
                </div>

                <!-- Détails du match -->
                <div class="mt-4 flex items-center justify-between flex-wrap gap-3">
                  <div class="flex items-center gap-2 min-w-0 flex-1">              <img :src="match.logo_1" class="h-10 w-10 rounded-xl object-contain bg-white p-1 flex-shrink-0" />
                    <span class="font-semibold text-gray-900 whitespace-normal break-words max-w-[160px]">
                      {{ match.competition_engagement_equipe_libelle_1 }}
                    </span>
                  </div>

                  <div class="mt-4 flex items-center justify-between flex-wrap gap-3">
                    {{ (match.rencontres_info_equipe1_score ?? '') + '-' + (match.rencontres_info_equipe2_score ?? '') }}
                  </div>

                  <div class="flex items-center gap-2 min-w-0 flex-1 justify-end">              <span class="font-semibold text-gray-900 whitespace-normal break-words text-right max-w-[160px]">
                      {{ match.competition_engagement_equipe_libelle_2 }}
                    </span>
                    <img :src="match.logo_2" class="h-10 w-10 rounded-xl object-contain bg-white p-1 flex-shrink-0" />
                  </div>
                </div>

                <div class="mt-4 text-[13px] text-gray-500">
                  Lieu : <span class="font-medium text-gray-900">{{ String(match.ville_code_postal) === '59600' ? 'Domicile' : 'Extérieur' }}</span>
                </div>

                <button class="mt-6 btn-gradient w-full text-sm" @click="openDetails(match)">Détails du match</button>
              </div>
            </div>
          </div>
        </main>

        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black/50" @click="closeDetails"></div>
          <div class="relative bg-white rounded-lg shadow-lg max-w-lg w-full p-6 z-10">
            <div class="flex justify-between items-start">
              <h2 class="text-lg font-semibold">Détails du match</h2>
              <button @click="closeDetails" class="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div class="mt-4 space-y-3 text-sm text-gray-700">

              <div>
                <div class="text-xs text-gray-500">Date</div>
                <div class="font-medium">{{ selectedMatch?.rencontre_conclusion_info_date_match ?? 'N/A' }} {{ selectedMatch?.rencontre_conclusion_info_heure_match ? selectedMatch.rencontre_conclusion_info_heure_match.slice(0,5) : '' }}</div>
              </div>

              <div>
                <div class="text-xs text-gray-500">Lieu</div>
                <div class="font-medium">{{ String(selectedMatch?.ville_code_postal) === '59600' ? 'Domicile' : 'Extérieur'   +',Salle: ' +selectedMatch?.equipement_nom_salle }}</div>
              </div>

              <div v-if="selectedMatch?.rencontre_description" class="text-sm">
                <div class="text-xs text-gray-500">Description</div>
                <div>{{ selectedMatch.rencontre_description }}</div>
              </div>

              <!-- Affichage du CSV importé -->
              <div v-if="selectedMatch?.importedData && selectedMatch.importedData.length" class="mt-3">
                <div class="font-semibold mb-2">Données importées</div>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm border-collapse">
                    <thead>
                      <tr class="bg-gray-100 text-left">
                        <th v-for="(h, idx) in Object.keys(selectedMatch.importedData[0])" :key="idx" class="p-2 border">{{ h }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, rIdx) in selectedMatch.importedData" :key="rIdx" class="border-t">
                        <td v-for="(h, cIdx) in Object.keys(selectedMatch.importedData[0])" :key="cIdx" class="p-2 align-top border">
                          {{ row[h] }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>


            </div>

          <div class="mt-6 flex justify-end items-center gap-3">
            <input type="file" accept=".csv,text/csv" ref="fileInput" @change="handleFile" style="display:none" />
            <button v-if="selectedMatch && (selectedMatch.rencontres_id == null || !matches_sambre_already_play.includes(String(selectedMatch.rencontres_id)))" class="btn-gradient px-4 py-2 text-sm" @click="importData">Importer les données</button>
            <button v-if="!(selectedMatch && (selectedMatch.rencontres_id == null || !matches_sambre_already_play.includes(String(selectedMatch.rencontres_id))))" class="px-4 py-2 text-sm border rounded" @click="clearImported">Effacer import</button>
          </div>

          </div>
        </div>
      </template>
      <script setup lang="ts">
      import { ref } from 'vue';

      const teamlogo = await getLogo();
      const data = await fetchRencontres();
      const events = await fetchEvents();
      const matches_sambre_already_play = (() => {
        const set = new Set<string>();
        (events.docs as any[]).forEach((ev: any) => {
          // essayer plusieurs clés possibles pour l'identifiant de rencontre
          const matchId = ev.rencontre_id ?? ev.matchId ?? ev.rencontre?._id ?? null;
          if (matchId && !set.has(String(matchId))) {
            set.add(String(matchId));
          }
        });
        return Array.from(set);
      })();
      const matches_sambre = (data.docs as any[]).filter((val: any) =>
          val.competition_engagement_equipe_libelle_1 === "SAMBRE AVESNOIS HANDBALL" || val.competition_engagement_equipe_libelle_2 === "SAMBRE AVESNOIS HANDBALL"
      ).map((val: any) => ({
        ...val,
        logo_1: teamlogo.docs.find((t: any) => t.name === val.competition_engagement_equipe_libelle_1)?.logo || null,
        logo_2: teamlogo.docs.find((t: any) => t.name === val.competition_engagement_equipe_libelle_2)?.logo || null,
      })).sort((a: any, b: any) => {
        const parseOrInf = (s?: string) => {
          if (!s) return Number.POSITIVE_INFINITY;
          const d = Date.parse(s);
          return isNaN(d) ? Number.POSITIVE_INFINITY : d;
        };
        const da = parseOrInf(a.rencontre_conclusion_info_date_match);
        const db = parseOrInf(b.rencontre_conclusion_info_date_match);
        return da - db;
      });

      const showModal = ref(false);
      const selectedMatch = ref<any>(null);

      // --- refs / fonctions pour l'import CSV ---
      const fileInput = ref<HTMLInputElement | null>(null);
      const parsedCsv = ref<any[] | null>(null);

      function importData() {
        // n'ouvre que depuis la modale
        if (!showModal.value || !selectedMatch.value) return;
        fileInput.value?.click();
      }



      async function handleFile(e: Event) {
        const input = e.target as HTMLInputElement;
        const file = input?.files?.[0];
        if (!file || !selectedMatch.value) return;
        try {
          const text = await readFileAsText(file);
          const rows = parseCSV(text);
          parsedCsv.value = rows;

          // associer les données importées au match sélectionné
          selectedMatch.value.importedData = rows;

          // reset input pour pouvoir re-sélectionner le même fichier si besoin
          input.value = '';
          console.log('CSV parsé pour le match', selectedMatch.value, rows);
        } catch (err) {
          console.error('Erreur lecture CSV', err);
        }
      }

      function clearImported() {
        if (!selectedMatch.value) return;
        const id =
            selectedMatch.value.rencontres_id ??
            selectedMatch.value.rencontresId ??
            selectedMatch.value._id ??
            'inconnu';
        alert(`Match ID: ${id}`);
        selectedMatch.value.importedData = null;
        parsedCsv.value = null;
      }

      // lecture fichier
      function readFileAsText(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = () => reject(reader.error);
          reader.onload = () => resolve(String(reader.result ?? ''));
          reader.readAsText(file, 'utf-8');
        });
      }

      // parser CSV simple (supporte en-tête et champs entre guillemets)
      function parseCSV(text: string): any[] {
        const lines = text.replace(/\r\n/g, '\n').split('\n').filter(l => l.trim() !== '');
        if (lines.length === 0) return [];
        const headers = splitCsvLine(lines[0]).map(h => h.trim());
        const rows = lines.slice(1).map(line => {
          const values = splitCsvLine(line);
          const obj: any = {};
          for (let i = 0; i < headers.length; i++) {
            obj[headers[i]] = values[i] ?? '';
          }
          return obj;
        });
        return rows;
      }

      function splitCsvLine(line: string): string[] {
        const res: string[] = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const ch = line[i];
          if (ch === '"' ) {
            if (inQuotes && line[i + 1] === '"') { // double quote -> escaped quote
              cur += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (ch === ',' && !inQuotes) {
            res.push(cur);
            cur = '';
          } else {
            cur += ch;
          }
        }
        res.push(cur);
        return res;
      }
      // --- Fin import CSV ---

      function openDetails(match: any) {
        selectedMatch.value = match;
        showModal.value = true;
      }

      function closeDetails() {
        showModal.value = false;
        selectedMatch.value = null;
      }

      async function fetchRencontres(){
          const res = await fetch('http://localhost:8080/rencontre')
          const data = await res.json()
          return data
      }

      async function fetchEvents(){
        const res = await fetch('http://localhost:8080/evenement')
        const events = await res.json()
        return events
      }

      async function getLogo(){
        const res = await fetch('http://localhost:8080/teamlogo')
        const data = await res.json()
        return data
      }
      </script>
      <style scoped>
      .card {
        background: #fff;
        border: 1px solid #F1F1F4;
        border-radius: 18px;
        box-shadow: 0 16px 36px -14px rgba(16, 24, 40, 0.10);
      }

      .btn-gradient {
        border-radius: 9999px;
        padding: 8px 14px;
        color: #fff;
        font-weight: 600;
        background: linear-gradient(90deg, #F472B6 0%, #A78BFA 100%);
        box-shadow: 0 8px 22px rgba(244, 114, 182, 0.25);
      }

      .section-title {
        color: #6B21A8;
        font-weight: 600;
        font-size: 15px;
        position: relative;
        padding-bottom: .35rem;
      }
      .section-title::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 210px;
        height: 3px;
        border-radius: 6px;
        background: linear-gradient(90deg, #60A5FA 0%, #A78BFA 50%, #F472B6 100%);
        opacity: .75;
      }
      </style>