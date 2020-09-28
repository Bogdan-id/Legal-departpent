<template>
  <v-simple-table>
    <template #default>
      <thead>
        <tr class="custom-header-row">
          <th class="custom-header">
            {{ `${item.infocard.initials.toUpperCase()}` }}
          </th>
          <th class="black--text text-right custom-header">
            <v-tooltip bottom :open-delay="0">
              <template #activator="{ on }">
              <v-btn 
                :href="item.infocard.url" 
                v-on="on" 
                target="_blank" 
                icon dark color="#e85d56">
                <v-icon v-text="'mdi-account-search'"></v-icon>
              </v-btn>
              </template>
              <span>Переглянути в реєстрi</span>
            </v-tooltip>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>ТИП/РIК</td>
          <td class="text-left">
            {{ `${item.infocard.declaration_year}, ${item.infocard.document_type}` }}
          </td>
        </tr>
        <tr>
          <td>МIСЦЕ ПРАЦI</td>
          <td class="text-left">{{ item.infocard.office }}</td>
        </tr>
        <tr>
          <td>ПОСАДА</td>
          <td class="text-left">{{ item.infocard.position }}</td>
        </tr>
        <tr>
          <td>ПОДАНА</td>
          <td class="text-left">
            {{ 
              formatDate(item.infocard.created_date).date 
              + ' ' + 
              formatDate(item.infocard.created_date).time 
            }}
          </td>
        </tr>
        
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  props: ['item'],

  methods: {
    formatDate(date) {
        return {
          date: `${date.substring(0, 10).split('-').join('.')} р.`,
          time: `${date.substring(11, 16)}`
        }
      },
  }
}
</script>