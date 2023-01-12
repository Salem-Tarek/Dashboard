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
            <v-col cols="12" sm="6">
              <v-select
                :disabled="!icons.length"
                @change="setSelectedIcon"
                :items="icons"
                item-text="name"
                item-value="name"
                label="إختار الأيقونة"
                outlined
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="10">
              <v-text-field :disabled="true" v-model="featIcon" label="أيقونة الميزة" outlined></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-icon color="primary" x-large class="mt-1">{{ featIcon }}</v-icon>
            </v-col>
            <!-- <v-col cols="12">
              <div class="icons_wrapper">
                <v-btn depressed v-for="icon in icons.iconsArr" :key="icon.id">
                  <v-icon>{{ "mdi-" + icon.name }}</v-icon>
                </v-btn>
              </div>
            </v-col> -->
          </v-row>
      </v-form>
    </div>
</template>

<script>
import axios from 'axios'
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
      featuresData:{
        titleEn: '',
        titleAr: '',
        descriptionEn: '',
        descriptionAr: '',
        icon: '',
      },
      tags: [
        "user",
        "agriculture",
        "alert",
        "alpha-numeric",
        "animal",
        "arrange",
        "arrow",
        "audio",
        "automotive",
        "banking",
        "battery",
        "brand",
        "phone",
        "clothing",
        "cloud",
        "color",
        "currency",
        "database",
        "date-time",
        "developer-languages",
        "device-tech",
        "drawing-art",
        "edit-modify",
        "emoji",
        "file-folder",
        "food-drink",
        "form",
        "gaming",
        "geographic-information-system",
        "hardware-tools",
        "health-beauty",
        "holiday",
        "home-automation",
        "lock",
        "math",
        "medical",
        "music",
        "nature",
        "navigation",
        "notification",
        "people-family",
        "photography",
        "places",
        "printer",
        "religion",
        "science",
        "settings",
        "shape",
        "shopping",
        "social-media",
        "sport",
        "formatting",
        "tooltip",
        "transportation-flying",
        "transportation-other",
        "transportation-road",
        "transportation-water",
        "vector",
        "video",
        "view",
        "weather",
      ],
      title_content: {
        title:[
          v => !!v || 'العنوان مطلوب',
          v => v.length <= 10 || 'Title must contain only characters',
        ],
        content:[
          v => !!v || 'المحتوى مطلوب',
          v => v.length <= 10 || 'Content must contain only characters',
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
      async getTag(e){
        this.overlay = true;
        const res = await axios.get(`https://materialdesignicons.com/api/package/38EF63D0-4744-11E4-B3CF-842B2B6CFE1B?tag=${e}`);
        if(res.status === 200){
          this.icons = res.data.icons;
          this.overlay = false;
        }
      },
      setSelectedIcon(e){
        this.isFeatDataExist.icon = `mdi-${e}`;
      }
    }
  }
</script>

<style>
.icons_wrapper {
  max-height: 400px; 
}
</style>