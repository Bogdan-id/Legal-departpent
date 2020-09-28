<template>
  <v-simple-table>
    <template #default>
      <thead>
        <tr class="custom-header-row">
          <th class="custom-header">
            {{ `${item.full_name.toUpperCase()}` }}
          </th>
          <th class="black--text text-right custom-header">
            <v-tooltip bottom :open-delay="0">
              <template #activator="{ on }">
              <v-btn 
                :href="item.url" 
                v-on="on" 
                target="_blank" 
                icon dark color="#e85d56">
                <v-icon>{{ searchIcon }}</v-icon>
              </v-btn>
              </template>
              <span>Переглянути в реєстрi</span>
            </v-tooltip>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>ПУБЛIЧНА ДIЯЛЬНIСТЬ</td>
          <td>{{ item.type_of_official }}</td>
        <tr>
        <tr>
          <td>ОСТАННЄ МIСЦЕ ПРАЦI</td>
          <td class="text-left">{{ item.last_workplace }}</td>
        </tr>
        <tr>
          <td>ПОСАДА</td>
          <td class="text-left">{{ item.last_job_title }}</td>
        </tr>
        <tr>
          <td>ДАТА НАРОДЖЕННЯ</td>
          <td class="text-left">
            {{ item.date_of_birth + 'p.' }}
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  props: [
    'item',
    'searchIcon'
  ]
}
</script>