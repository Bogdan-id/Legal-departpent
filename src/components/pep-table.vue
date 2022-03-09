<template>
  <!-- PEP table component -->
  <v-fab-transition>
    <v-card v-show="state" elevation="5" class="ml-2 mr-2 mb-3">
      <v-card-text>
        <v-data-table
          color="black"
          :headers="tableHeaders"
          :items="tableData"
          :items-per-page="10"
          dense>
          <template #item.is_pep="{ item }">
            <span v-if="personHandler">
              {{ item.is_pep ? 'Так' : 'Нi' }}
            </span>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-fab-transition>
</template>

<script>
export default {
  props: [
    'state',
    'tableHeaders',
    'tableData',
    'callback',
    'personHandler'
  ],
}
</script>