<template>
    <div>
      <h5 class="my-3">الميزة {{ `#${featNum}` }}</h5>
      <v-overlay :value="overlay">
        <v-progress-circular
          :size="70"
          :width="7"
          color="blue"
          indeterminate
        ></v-progress-circular>
      </v-overlay>
      <v-form>
          <v-row>
            <v-col cols="12" md="6" class="pb-0">
              <v-text-field
              v-model="isFeatDataExist.titleEn"
              :rules="title_content.title"
              outlined
              label="العنوان الانجليزى"
              required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-text-field
              v-model="isFeatDataExist.titleAr"
              :rules="title_content.title"
              outlined
              label="العنوان العربى"
              required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-textarea
                v-model="isFeatDataExist.descriptionEn"
                :rules="title_content.content"
                outlined
                no-resize
                name="input-7-4"
                label="المحتوى الانجليزى"
              ></v-textarea>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-textarea
                v-model="isFeatDataExist.descriptionAr"
                :rules="title_content.content"
                outlined
                no-resize
                name="input-7-4"
                label="المحتوى العربى"
              ></v-textarea>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                @change="getTag"
                :items="tags"
                label="إختار تصنيف الأيقونة"
                outlined
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="6" sm="3">
              <v-text-field :disabled="true" v-model="featIcon" label="أيقونة الميزة" outlined></v-text-field>
            </v-col>
            <v-col cols="6" sm="3">
              <v-icon color="primary" x-large class="mt-1">{{ featIcon }}</v-icon>
            </v-col>

            <v-overlay :value="iconsOverlay">
              <v-container>
                <div class="iconsWrapper">
                  <v-btn @click="selectIcon(icon)" depressed v-for="(icon, index) in icons" :key="index">
                    <v-icon>
                      {{ icon }}
                    </v-icon>
                  </v-btn>
                </div>
              </v-container>
            </v-overlay>
          </v-row>
      </v-form>
    </div>
</template>

<script>
import materialIconsList from '@/assets/materialIconsList.js'

  export default {
    name:"Fearure",
    props:{
      featNum: {
        type: Number,
      },
      featData: {
        type: Object,
        required: false
      }
    },
    data: () => ({
      icons: [],
      valid: false,
      overlay: false,
      iconsOverlay: false,
      featuresData:{
        titleEn: '',
        titleAr: '',
        descriptionEn: '',
        descriptionAr: '',
        icon: '',
      },
      tags: [
          "animals", 
          "weather", 
          "view", 
          "movie", 
          "vectors", 
          "transportation", 
          "tooltip", 
          "text formate", 
          "sport", 
          "social media", 
          "shopping", 
          "shape", 
          "settings", 
          "science", 
          "religion", 
          "printer", 
          "places", 
          "photography", 
          "people", 
          "notification", 
          "navigation", 
          "nature", 
          "medical", 
          "maths", 
          "lock", 
          "home automation", 
          "holiday", 
          "health", 
          "tools", 
          "geographic information", 
          "form", 
          "emoji", 
          "edit", 
          "drawing", 
          "devices", 
          "developers", 
          "database", 
          "currency", 
          "color", 
          "cloud", 
          "clothes", 
          "users", 
          "agriculture", 
          "alert", 
          "aphabatic numeric", 
          "arrange", 
          "arrow", 
          "automative", 
          "banking", 
          "battery", 
          "brand", 
          "phone", 
          "date time", 
          "files-folders", 
          "food", 
          "games"
      ],
      title_content: {
        title:[
          v => !!v || 'العنوان مطلوب',
        ],
        content:[
          v => !!v || 'المحتوى مطلوب',
        ],
      },
    }),
    watch:{
      featuresData:{
        handler(){
            this.$emit('featuresDataChanged')
        },
        deep: true
      },
      featData:{
        handler(){
          this.$emit('featDataPropChanged')
        },
        deep: true
      },

    },
    computed: {
      isFeatDataExist(){
        return this.featData ? this.featData : this.featuresData
      },
      featIcon(){
        return this.isFeatDataExist.icon;
      }
    },
    methods: {
      getTag(e){
        this.iconsOverlay = true;
        this.icons = materialIconsList[e];
      },
      selectIcon(icon){
        this.isFeatDataExist.icon = icon;
        this.iconsOverlay = false;
      }
    },
  }
</script>

<style lang="scss">
.v-overlay {
  .v-overlay__content {
    width: 700px;
  }
}
.iconsWrapper {
  max-height: 70vh;
  overflow-y: scroll;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  & {
    overflow-y: scroll;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
  }
  &::-webkit-scrollbar { /* WebKit */
      width: 0;
      height: 0;
  }
}
</style>