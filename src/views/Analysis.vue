<template>
  <div class="analysis grey lighten-3">
    <v-container>
      <h2 class="display-2 mb-3">إحصائيات</h2>
      <div class="my-2 cards-wrapper">
        <div v-for="(card, key, index) in cards" :key="`card-${index}`">
          <v-card color="primary white--text">
            <div class="py-5 px-3 card-content">
              <v-card-title class="d-flex align-center justify-space-between">
                <span class="font-weight-black white--text">{{ card.name }}</span>
                <span class="display-1">{{ card.number }}</span>
              </v-card-title>
            </div>
          </v-card>
        </div>
      </div>
      <!-- <v-card> -->
        <h2 class="display-1 mt-2 mb-4">
          إحصائيات البلاد
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="بحث"
            single-line
            hide-details
          ></v-text-field>
        </h2>
        <v-data-table
          hide-default-footer
          :headers="headers"
          :items="countriesTable"
          :search="search"
        >
        <template v-slot:item.pages="{ item }">
          <v-chip
          v-for="page in item.pages"
          :key="page"
          color="primary"
          class="ma-1 text-center"
          >
            {{ page }}
          </v-chip>
         </template>
        </v-data-table>
      <!-- </v-card> -->
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Analysis",
  data(){
    return {
      cards: {},
      countriesTable: [],
      headers: [
        { text: 'اسم البلد', value: 'nameAr' },
        { text: 'العدد الكلى', value: 'allCount' },
        { text: 'العدد اليومى', value: 'todayCount' },
        { text: 'الصفحات', value: 'pages', width: '700px' },
      ],
      search: "",
    }
  },
  mounted(){
    this.getAnalysis();
  },
  methods: {
    async getAnalysis(){
      const res = await axios.get('/dashboard/analysis');
      let data = res.data.data;
      for(let key in data){
        if(key !== "Countries"){
          this.cards[key] = data[key];
        }else{
          this.countriesTable = data[key];
        }
      }
    }
  }
};
</script>
<style scoped lang="scss">
.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}
.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:last-child, .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  max-width: 700px !important;
}
</style>
