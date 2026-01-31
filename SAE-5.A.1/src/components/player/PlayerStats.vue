<template>
  <pre> </pre>
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
    <div class="space-y-6">
      <div class="bg-white p-6 rounded-xl border">
        <h3 class="text-lg font-semibold mb-4">{{ player?.stats?.is_gb ? 'Performance Gardienne' : 'Statistiques positives' }}</h3>
        <ul class="space-y-3 text-sm">
          <template v-if="player?.stats?.is_gb">
            <li class="flex justify-between border-b pb-2"><span>Arrêts Totaux</span><strong>{{ player.stats.arrets_total }}</strong></li>
            <li class="flex justify-between border-b pb-2"><span>% Arrêt Global</span><strong>{{ Math.round(player.stats.pct_arret_global) }}%</strong></li>
            <li class="flex justify-between"><span>Relances (Passes D)</span><strong>{{ player.stats.total_passes_decisives }}</strong></li>
          </template>
          <template v-else>
            <li class="flex justify-between border-b pb-2"><span>Buts totaux</span><strong>{{ player.stats.total_buts }}</strong></li>
            <li class="flex justify-between border-b pb-2"><span>Assistances</span><strong>{{ player.stats.total_passes_decisives }}</strong></li>
            <li class="flex justify-between"><span>Ratio buts/tirs</span><strong>{{ player.stats.buts_sur_tirs_ratio_brut }}</strong></li>
          </template>
        </ul>
      </div>

      <div class="bg-white p-6 rounded-xl border">
        <h3 class="text-lg font-semibold mb-4">{{ player?.stats?.is_gb ? 'Points Encaissés' : 'Statistiques négatives' }}</h3>
        <ul class="space-y-3 text-sm">
          <li v-if="!player?.stats?.is_gb" class="flex justify-between border-b pb-2"><span>Tirs Arrêtés (par GB adv)</span><strong>{{ player.stats.tirs_arretes }}</strong></li>
          <li class="flex justify-between border-b pb-2"><span>Balles Perdues</span><strong>{{ player.stats.total_balles_perdues }}</strong></li>
          <li class="flex justify-between"><span>Sanctions 2min</span><strong>{{ player.stats.def_sanctions_2min }}</strong></li>
        </ul>
      </div>

      <div v-if="!player?.stats?.is_gb" class="bg-white p-6 rounded-xl border">
        <h3 class="text-lg font-semibold mb-4">Discipline & Défense</h3>
        <ul class="space-y-3 text-sm">
          <li class="flex justify-between border-b pb-2"><span>Fautes défensives</span><strong>{{ player.stats.def_fautes }}</strong></li>
          <li class="flex justify-between border-b pb-2"><span>Duels gagnés</span><strong>{{ player.stats.def_duels_gagnes }}</strong></li>
          <li class="flex justify-between"><span>Duels perdus</span><strong>{{ player.stats.def_duels_perdus }}</strong></li>
        </ul>
      </div>
    </div>

    <aside class="bg-white p-6 rounded-xl border sticky top-24 shadow-sm">
      <h4 class="text-xs font-bold uppercase text-gray-400 mb-4">Profil Athlétique</h4>
      <div class="space-y-4 text-sm">
        <div class="flex justify-between border-b pb-2"><span>Club</span><span class="font-semibold text-right truncate">{{ player?.team_name }}</span></div>
        <div class="flex justify-between border-b pb-2"><span>Âge</span><span class="font-bold bg-gray-100 px-2 rounded">{{ getAge(player?.birth_date) }}</span></div>
        <div class="flex justify-between border-b pb-2"><span>Taille</span><span class="font-bold bg-gray-100 px-2 rounded">{{ player?.height_cm ?? '-' }} cm</span></div>
        <div class="flex justify-between"><span>Poste</span><span class="font-bold bg-violet-100 text-violet-700 px-2 rounded">{{ player?.position }}</span></div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
defineProps({ player: Object })
function getAge(d?: string) { if (!d) return '-'; const b = new Date(d); return `${new Date().getFullYear() - b.getFullYear()} ans`; }
</script>