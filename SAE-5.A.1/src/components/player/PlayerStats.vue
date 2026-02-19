<template>
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
    <div class="space-y-6">
      <div class="bg-white p-6 rounded-xl border">
        <h3 class="text-lg font-semibold mb-4">
          {{ player?.stats?.is_gb ? 'Performance Gardienne' : 'Statistiques Offensives' }}
        </h3>
        <ul class="space-y-3 text-sm">
          <template v-if="player?.stats?.is_gb">
            <li class="flex justify-between border-b pb-2"><span>Arrêts Totaux</span><strong class="text-teal-600">{{ player.stats.arrets_total }}</strong></li>
            <li class="flex justify-between border-b pb-2"><span>% Arrêt Global</span><strong class="text-teal-600">{{ Math.round(player.stats.pct_arret_global) }}%</strong></li>
            <li class="flex justify-between"><span>Relances (Passes D)</span><strong>{{ player.stats.total_passes_decisives }}</strong></li>
          </template>
          <template v-else>
            <li class="flex justify-between border-b pb-2"><span>Buts marqués</span><strong class="text-violet-600">{{ player.stats.total_buts }}</strong></li>
            <li class="flex justify-between border-b pb-2"><span>Passes décisives</span><strong>{{ player.stats.total_passes_decisives }}</strong></li>
            <li class="flex justify-between"><span>Efficacité au tir</span><strong>{{ Math.round(player.stats.efficacite_tir_pct) }}%</strong></li>
          </template>
        </ul>
      </div>

      <div class="bg-white p-6 rounded-xl border">
        <h3 class="text-lg font-semibold mb-4">
          {{ player?.stats?.is_gb ? 'Points Encaissés' : 'Économie de Balle' }}
        </h3>
        <ul class="space-y-3 text-sm">
          <template v-if="player?.stats?.is_gb">
            <li class="flex justify-between border-b pb-2"><span>Buts encaissés</span><strong class="text-red-500">{{ player.stats.buts_encaisse }}</strong></li>
            <li class="flex justify-between"><span>Tirs non cadrés reçus</span><strong>{{ player.stats.tirs_non_cadres_recus || 0 }}</strong></li>
          </template>
          <template v-else>
            <li class="flex justify-between border-b pb-2"><span>Balles Perdues (PDB)</span><strong class="text-red-500">{{ player.stats.total_balles_perdues }}</strong></li>
            <li class="flex justify-between border-b pb-2"><span>Tirs manqués / Arrêtés</span><strong>{{ player.stats.tirs_rates }}</strong></li>
            <li class="flex justify-between"><span>Sanctions 2min</span><strong class="text-orange-500">{{ player.stats.def_sanctions_2min }}</strong></li>
          </template>
        </ul>
      </div>

      <div v-if="!player?.stats?.is_gb" class="bg-white p-6 rounded-xl border">
        <h3 class="text-lg font-semibold mb-4">Activité Défensive</h3>
        <ul class="space-y-3 text-sm">
          <li class="flex justify-between border-b pb-2"><span>Ballons récupérés (Recup +)</span><strong class="text-green-600">{{ player.stats.def_recuperations }}</strong></li>
          <li class="flex justify-between border-b pb-2"><span>Contres effectués</span><strong class="text-green-600">{{ player.stats.def_contres }}</strong></li>
          <li class="flex justify-between border-b pb-2"><span>Duels gagnés</span><strong>{{ player.stats.def_duels_gagnes }}</strong></li>
          <li class="flex justify-between"><span>Duels perdus</span><strong class="text-red-400">{{ player.stats.def_duels_perdus }}</strong></li>
        </ul>
      </div>
    </div>

    <aside class="bg-white p-6 rounded-xl border sticky top-24 shadow-sm">
      <h4 class="text-xs font-bold uppercase text-gray-400 mb-4">Profil Athlétique</h4>
      <div class="space-y-4 text-sm">
        <div class="flex justify-between border-b pb-2"><span>Club</span><span class="font-semibold text-right truncate">{{ player?.team_name }}</span></div>
        <div class="flex justify-between border-b pb-2"><span>Âge</span><span class="font-bold bg-gray-100 px-2 rounded">{{ getAge(player?.birth_date) }}</span></div>
        <div class="flex justify-between border-b pb-2"><span>Taille</span><span class="font-bold bg-gray-100 px-2 rounded">{{ player?.height_cm ?? '-' }} cm</span></div>
        <div class="flex justify-between">
          <span>Poste</span>
          <span :class="[
            'font-bold px-2 rounded',
            player?.stats?.is_gb ? 'bg-teal-100 text-teal-700' : 'bg-violet-100 text-violet-700'
          ]">
            {{ player?.position }}
          </span>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  player: Object
})

function getAge(birthDate?: string) {
  if (!birthDate) return '-';
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return `${age} ans`;
}
</script>