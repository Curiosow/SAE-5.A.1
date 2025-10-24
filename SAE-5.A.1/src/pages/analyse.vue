<template>
  <main class="min-h-screen bg-[#f7f7fb]">
    <div class="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 pt-6 pb-12">

      <!-- Back button -->
      <div class="mb-4">
        <button @click="$router.back()"
                class="inline-flex items-center gap-2 text-sm text-gray-700 bg-white/60 backdrop-blur rounded-full px-3 py-2 shadow-sm border border-gray-100">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18L9 12l6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Retour aux Joueuses
        </button>
      </div>

      <!-- Large header card -->
      <header class="relative card-large p-6 sm:p-8 mb-6">
        <div class="grid grid-cols-[140px_1fr] gap--1 items-start">
          <div class="relative">
            <div
                class="h-28 w-28 rounded-full shadow-avatar bg-gradient-to-br from-rose-400 to-violet-500 grid place-items-center text-3xl font-bold text-white">
              Upload
            </div>
            <div
                class="absolute -right--1 -bottom-1 h-7 w-7 rounded-full bg-white border border-gray-100 flex items-center justify-center text-sm font-semibold shadow-sm">
              CSV
            </div>
          </div>

          <div class="flex flex-col gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-[#6B21A8] leading-tight">Importer un match (CSV)</h1>
              <p class="text-sm text-gray-600 mt-1">Déposez le fichier CSV envoyé — un fichier = un match.</p>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-xs bg-white border border-gray-100 px-2 py-1 rounded-full text-gray-600 flex items-center gap-2">
                <svg class="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none"><path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" stroke-width="1.2"/></svg>
                Format : CSV
              </span>

              <span class="text-xs bg-white border border-gray-100 px-2 py-1 rounded-full text-gray-600">Standardisé</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Upload card -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Importer un fichier CSV</h2>

        <form @submit.prevent="submit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label class="text-sm text-gray-700 block mb-1">Fichier CSV</label>
              <label
                  class="block cursor-pointer rounded-lg border border-dashed border-gray-200 bg-white/50 p-4 text-sm text-gray-600 hover:bg-white"
              >
                <input ref="fileInput" type="file" accept=".csv,text/csv" @change="onFileChange" class="hidden">
                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none">
                      <path d="M7 7h10v10H7z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M9 3h6v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <div>
                      <div class="font-medium text-gray-800" v-if="selectedFileName">{{ selectedFileName }}</div>
                      <div class="text-xs text-gray-500" v-else>Choisir ou glisser-déposer un fichier .csv</div>
                    </div>
                  </div>
                  <div>
                    <button type="button" @click="triggerFile" class="text-sm px-3 py-1 rounded-full border border-gray-100 bg-white">Choisir</button>
                  </div>
                </div>
              </label>
            </div>

            <div>
              <label class="text-sm text-gray-700 block mb-1">Date du match</label>
              <input v-model="form.date_match" type="date" class="w-full rounded-lg border border-gray-200 p-2 bg-white text-sm" />
            </div>

            <div>
              <label class="text-sm text-gray-700 block mb-1">Adversaire</label>
              <input v-model="form.adversaire" type="text" placeholder="Nom de l'équipe adverse" class="w-full rounded-lg border border-gray-200 p-2 bg-white text-sm" />
            </div>
          </div>

          <div class="flex items-center gap-4">
            <button :disabled="uploading" type="submit" class="btn-gradient inline-flex items-center gap-2">
              <svg v-if="!uploading" class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <svg v-else class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              <span v-if="!uploading">Importer</span>
              <span v-else>Import en cours...</span>
            </button>

            <button type="button" @click="reset" class="text-sm px-3 py-2 rounded-full border border-gray-100 bg-white">Réinitialiser</button>

            <div class="text-sm text-gray-500" v-if="lastMessage">{{ lastMessage }}</div>
          </div>

          <!-- progress -->
          <div v-if="uploading" class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div class="h-full rounded-full bg-gradient-to-r from-rose-400 to-violet-500 transition-all" :style="{width: uploadProgress + '%'}"></div>
          </div>

          <!-- preview / errors -->
          <div v-if="errors.length" class="mt-2 text-sm text-red-600">
            <ul class="list-disc pl-5">
              <li v-for="(e, idx) in errors" :key="idx">{{ e }}</li>
            </ul>
          </div>

          <div v-if="previewRows.length" class="mt-4">
            <h3 class="text-sm font-semibold text-gray-800 mb-2">Aperçu (premières lignes)</h3>
            <div class="overflow-auto border border-gray-100 rounded-lg bg-white p-2">
              <table class="min-w-full text-sm">
                <thead>
                <tr>
                  <th v-for="(c,i) in previewCols" :key="i" class="text-left px-2 py-1 text-xs text-gray-500">{{ c }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(r, i) in previewRows" :key="i" class="odd:bg-gray-50">
                  <td v-for="(c, j) in previewCols" :key="j" class="px-2 py-1">{{ r[j] }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>

      <div class="mt-8"></div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const tabs = ['Performance', 'Précision', 'Avancés', 'Heat Map']
const activeTab = ref('Performance')

// form state
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const selectedFileName = ref('')
const form = reactive({ date_match: '', adversaire: '' })
const uploading = ref(false)
const uploadProgress = ref(0)
const lastMessage = ref('')
const errors = ref<string[]>([])
const previewCols = ref<string[]>([])
const previewRows = ref<any[]>([])
const lastImport = ref<any>(null)

function triggerFile() {
  fileInput.value?.click()
}

function onFileChange(e: Event) {
  errors.value = []
  previewCols.value = []
  previewRows.value = []
  const input = e.target as HTMLInputElement
  if (!input.files || !input.files.length) return
  const f = input.files[0]
  if (!f.name.toLowerCase().endsWith('.csv')) {
    errors.value.push('Le fichier doit être un .csv')
    selectedFile.value = null
    selectedFileName.value = ''
    return
  }
  selectedFile.value = f
  selectedFileName.value = f.name

  // read first lines for preview
  const reader = new FileReader()
  reader.onload = (ev) => {
    const text = String(ev.target?.result || '')
    parsePreviewCSV(text)
  }
  reader.readAsText(f)
}

function parsePreviewCSV(text: string) {
  // naive parser: split lines, split by ; or ,
  const sep = (text.indexOf(';') !== -1 && text.indexOf(',') !== -1)
      ? (text.indexOf(';') > text.indexOf(',') ? ',' : ';')
      : (text.indexOf(';') !== -1 ? ';' : ',')
  const lines = text.split(/\r\n|\n/).filter(l => l.trim() !== '')
  if (!lines.length) return
  const headerLine = lines[0].replace(/^\uFEFF/, '') // remove BOM
  const headers = headerLine.split(sep).map(h => h.trim())
  previewCols.value = headers
  const rows = lines.slice(1, 6).map(line => line.split(sep).map(cell => cell.trim()))
  previewRows.value = rows
}

function reset() {
  selectedFile.value = null
  selectedFileName.value = ''
  uploadProgress.value = 0
  uploading.value = false
  lastMessage.value = ''
  errors.value = []
  previewCols.value = []
  previewRows.value = []
  lastImport.value = null
  if (fileInput.value) fileInput.value.value = ''
}

function submit() {
  errors.value = []
  lastMessage.value = ''
  if (!selectedFile.value) {
    errors.value.push('Veuillez choisir un fichier .csv')
    return
  }

  // prepare FormData
  const fd = new FormData()
  fd.append('csvfile', selectedFile.value)
  if (form.date_match) fd.append('date_match', form.date_match)
  if (form.adversaire) fd.append('adversaire', form.adversaire)
  fd.append('type_match', 'amical')

  // use XHR for progress
  const xhr = new XMLHttpRequest()
  xhr.open('POST', '/upload_csv_match.php', true)

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      uploadProgress.value = Math.round((e.loaded / e.total) * 100)
    }
  }

  xhr.onloadstart = () => {
    uploading.value = true
    uploadProgress.value = 0
  }

  xhr.onreadystatechange = () => {
    if (xhr.readyState !== 4) return
    uploading.value = false
    try {
      const res = JSON.parse(xhr.responseText)
      if (xhr.status >= 200 && xhr.status < 300 && res.success) {
        lastMessage.value = 'Import réussi'
        lastImport.value = res
        // show returned id if any
        if (res.id_match) lastMessage.value += ` — id_match ${res.id_match}`
        // optionally reset form but keep lastImport
        selectedFile.value = null
        selectedFileName.value = ''
        if (fileInput.value) fileInput.value.value = ''
        previewCols.value = []
        previewRows.value = []
      } else {
        const err = res?.error || res?.message || 'Erreur inconnue'
        errors.value.push(String(err))
        if (res?.details) errors.value.push(String(res.details))
      }
    } catch (err) {
      errors.value.push('Réponse serveur invalide')
    }
  }

  xhr.onerror = () => {
    uploading.value = false
    errors.value.push('Erreur réseau lors de l upload')
  }

  xhr.send(fd)
}
</script>

<style scoped>
/* Card styles */
.card-large {
  background: #fff;
  border-radius: 18px;
  border: 1px solid #f1f1f4;
  box-shadow: 0 18px 40px -20px rgba(16,24,40,0.12);
  display: flex;
  align-items: flex-start;
}

.card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #f1f1f4;
  box-shadow: 0 10px 30px -18px rgba(16,24,40,0.08);
}

/* Avatar shadow */
.shadow-avatar {
  box-shadow: 0 18px 40px -26px rgba(168,85,247,0.35);
}

/* mini KPI */
.mini-kpi {
  width: 200px;
  background: #fff;
  border: 1px solid #f3f3f6;
  border-radius: 12px;
  padding: 10px 12px;
  box-shadow: 0 8px 26px -20px rgba(16,24,40,0.06);
}

/* tabs */
.tabs .tab {
  padding: 10px 18px;
  border-radius: 9999px;
  font-weight: 600;
  color: #6b7280;
  background: transparent;
  border: none;
}
.tabs .tab.active {
  background: linear-gradient(90deg,#f472b6,#a78bfa);
  color: white;
  box-shadow: 0 6px 20px -12px rgba(167,139,250,0.4);
}

/* button gradient */
.btn-gradient {
  border-radius: 9999px;
  padding: 8px 14px;
  color: #fff;
  font-weight: 600;
  background: linear-gradient(90deg, #F472B6 0%, #A78BFA 100%);
  box-shadow: 0 8px 22px rgba(244,114,182,0.25);
}

/* small typography tweaks */
.text-white\/85 { color: rgba(255,255,255,0.85); }

/* upload area specifics */
label[for="file"] {
  cursor: pointer;
}

/* responsive tweaks */
@media (min-width: 1024px) {
  .mini-kpi { width: 220px; }
}
</style>