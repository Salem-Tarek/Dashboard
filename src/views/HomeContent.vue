<template>
    <v-container>
      <v-overlay :value="overlay">
        <v-progress-circular
          :size="70"
          :width="7"
          color="blue"
          indeterminate
        ></v-progress-circular>
      </v-overlay>
        <h1 class="mb-4">محتوى الصفحة الرئيسية</h1>
        <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-medium">
                <h4>السلايدر</h4>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-form ref="sliderRef">
                    <v-row>
                      <v-col cols="12">
                        <v-file-input v-model="slider.sliderImages" label="صور السلايدر" show-size outlined multiple append-icon="mdi-camera"></v-file-input>
                        <template v-if="slider.uploadedSliderImages.length">
                          <div class="mb-2 d-flex justify-space-between" v-for="(img, index) in slider.uploadedSliderImages" :key="img.lastModified">
                            <div class="imgPreview" :style="{ 'background-image': `url(${img.image})` }"></div>
                            <div class="actions">
                              <v-icon class="red--text" @click="deleteSliderImg(img, index)">mdi-delete</v-icon>
                            </div>
                          </div>
                        </template>
                        <v-btn depressed color="success" @click="submitSliderImgsFunc()" class="noLetterSpace mt-3">حفظ صور السلايدر</v-btn>
                      </v-col>
                    </v-row>
                </v-form>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header class="font-weight-medium">
                  <h4>المزايا</h4>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  
                  <!-- If There is Features -->
                  <template v-if="getFeatures.length">
                    <template v-for="(feat, index) in getFeatures">
                      <Fearure @featDataPropChanged="featBtn = false" :featData="feat" @featuresDataChanged="getFeatureData()" ref="FeatureComponent" :featNum="index+1" :key="`getFeat${feat.id}`" />
                      <div class="deleteFeat d-flex align-center justify-space-between makeGap" :key="feat.id">
                        <div class="divider"></div>
                        <v-btn depressed color="error" class="noLetterSpace" @click="deleteFeat(feat.id)">حذف الميزة</v-btn>
                      </div>
                    </template>
                  </template>

                  <!-- The New Features -->
                  <template>
                    <template v-for="n in featsCount">
                      <Fearure :featData="null" @featuresDataChanged="getFeatureData()" ref="FeatureComponent" :featNum="n + getFeatures.length" :key="`feat${n}`" />
                      <div class="divider w-100" :key="n"></div>
                    </template>
                  </template>

                  <div class="mt-3 d-flex makeGap">
                    <v-btn depressed class="AddFeat noLetterSpace" @click="featsCount++">أضف ميزة</v-btn>
                    <v-btn color="success" class="AddFeat noLetterSpace" @click="submitFeatures()" :disabled="featBtn">حفظ المميزات</v-btn>
                  </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header class="font-weight-medium">
                  <h4>عننا</h4>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-form>
                      <v-row>
                        <v-col cols="12" md="6" class="pb-0">
                          <v-textarea
                            v-model="aboutData.descriptionEn"
                            :rules="title_content.content"
                            outlined
                            no-resize
                            name="input-7-4"
                            label="عننا الانجليزى"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                          <v-textarea
                            v-model="aboutData.descriptionAr"
                            :rules="title_content.content"
                            outlined
                            no-resize
                            name="input-7-4"
                            label="عننا العربى"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                          <v-textarea
                            v-model="mission.descriptionEn"
                            :rules="title_content.content"
                            outlined
                            no-resize
                            name="input-7-4"
                            label="المهمة الانجليزى"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                          <v-textarea
                            v-model="mission.descriptionAr"
                            :rules="title_content.content"
                            outlined
                            no-resize
                            name="input-7-4"
                            label="المهمة العربى"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12">
                          <v-btn color="success" @click="submitWords()">حفظ البيانات</v-btn>
                        </v-col>
                      </v-row>
                  </v-form>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header class="font-weight-medium">
                  <h4>شركات تم التعامل معها</h4>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-form>
                    <v-row>
                      <v-col cols="12">
                        <v-file-input v-model="companies.currentCompanies" label="صور الشركات" show-size outlined multiple append-icon="mdi-camera"></v-file-input>
                        <template v-if="companies.uploadedCompaniesImages.length">
                          <div class="mb-2 d-flex justify-space-between" v-for="(img, index) in companies.uploadedCompaniesImages" :key="img.lastModified">
                            <div class="imgPreview" :style="{ 'background-image': `url(${img.image})` }"></div>
                            <div class="actions">
                              <v-icon class="red--text" @click="deleteCompanyImg(img, index)">mdi-delete</v-icon>
                            </div>
                          </div>
                        </template>
                        <v-btn color="success" @click="submitCompaniesFunc()" class="mt-3 noLetterSpace">حفظ صور الشركات</v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header class="font-weight-medium">
                  <h4>محتوى الفيديو</h4>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-form>
                      <v-row>
                        <v-col cols="12" class="pb-0" md="6">
                          <v-textarea
                            v-model="demoData.descriptionEn"
                            :rules="title_content.content"
                            outlined
                            no-resize
                            name="input-7-4"
                            label="المحتوى الانجليزى"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12" class="pb-0" md="6">
                          <v-textarea
                            v-model="demoData.descriptionAr"
                            :rules="title_content.content"
                            outlined
                            no-resize
                            name="input-7-4"
                            label="المحتوى العربى"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                          <v-text-field
                          v-model="demoData.link"
                          outlined
                          label="لينك الفيديو"
                          required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-btn color="success" @click="submitDemoData()" class="noLetterSpace">حفظ محتوى الفيديو</v-btn>
                        </v-col>
                      </v-row>
                  </v-form>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-container>
</template>

<script>
import Fearure from '../components/Fearure.vue'
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
    name: "HomeContent",
    components:{
      Fearure,
    },
    data(){
      return {
        slider:{
          sliderImages:[],
          uploadedSliderImages:[],
          existImgs: [],
        },
        
        featsCount: 1,
        features: [],
        getFeatures: [],
        featBtn: true,

        aboutData:{
          descriptionEn: '',
          descriptionAr: '',
        },
        mission:{
          descriptionEn: '',
          descriptionAr: '',
        },

        companies:{
          currentCompanies:[],
          uploadedCompaniesImages:[],
          existImgs: [],
        },

        demoData:{
          descriptionEn: '',
          descriptionAr: '',
          link: '',
        },

        title_content: {
          title:[
            v => !!v || 'العنوان مطلوب',
          ],
          content:[
            v => !!v || 'المحتوى مطلوب',
          ],

        },
        overlay: false,
      }
    },
    methods:{
      // Slider Functions
      async submitSliderImgsFunc(){
        this.overlay = true;
        let fd = new FormData();
        let uploadedImgs = [];
        uploadedImgs = this.slider.existImgs.length ? [...this.slider.existImgs, ...this.slider.sliderImages] : [...this.slider.sliderImages];

        for(let i = 0; i < uploadedImgs.length; i++){
          fd.append(`Images[${i}][image]`, uploadedImgs[i].image || uploadedImgs[i])
        }

        if(this.slider.uploadedSliderImages.length > this.slider.existImgs.length){
          const res = await axios.post('/dashboard/homePage/slider/save', fd);
          ;
          if(res.status === 200){
            this.overlay = false;
            // alert('Done')
            this.alertMaker('تم إرسال صور السليدر بنجاح')
          }
        }else{
          // alert('No Changes')
          this.alertMaker('لا يوجد تغيرات فى صور السليدر', 'info', false);
        }
      },
      async deleteSliderImg(img, index){
        this.overlay = true;
        if(img.id){
          const res = await axios.post('/dashboard/homePage/slider/delete', {id: img.id});
          if(res.status === 200){
            this.overlay = false;
            // alert('Done') 
            this.alertMaker('تم حذف صورة السليدر بنجاح');
            this.getHomePageData();
          }
        }else{
          this.slider.uploadedSliderImages.splice(index, 1);
          this.slider.sliderImages.splice(index - this.slider.existImgs.length, 1);
        }
      },

      // Features functions
      getFeatureData(){
        this.features = this.$refs.FeatureComponent.map((comp) => !comp._props.featData ? comp.$data.featuresData : comp._props.featData);
        this.featBtn = false;

        let lastItem = this.features[this.features.length - 1];
        if(lastItem.titleEn.trim() === '' && lastItem.titleAr.trim() === '' && lastItem.descriptionEn.trim() === '' && lastItem.descriptionAr.trim() === '' && lastItem.icon.trim() === ''){
          this.features.pop();
        }
      },
      async submitFeatures(){
        this.overlay = true;
        this.getFeatureData();
        // // Remove the Last Element Which is the current Feat Component
        // this.features.pop();

        for(let feat of this.features){
          for(let key in feat){
            if(feat[key] === "" || feat[key] === null){
              // alert('يجب ملئ كل حقول الادخال')
              this.alertMaker('يجب ملئ كل حقول الادخال', 'warning');
              return;
            }
          }
        }
        const res = await axios.post('/dashboard/homePage/services/save', {Services: this.features});
        if(res.status === 200){
          this.overlay = false;
          // alert('تم حفظ المميزات بنجاح')
            this.alertMaker('تم إرسال الميزات بنجاح');
          this.getHomePageData();
          document.location.reload();
          // alert('Get The Data')
        }
      },
      async deleteFeat(id){
        const res = await axios.post('/dashboard/homePage/services/delete', {id: id});
        if(res.status === 200){
          // alert('تم حذف الميزة بنجاح')
          this.alertMaker('تم حذف الميزة بنجاح');
          this.getHomePageData();
        }
      },

      // Aboutus Words Functions
      async submitWords(){
        this.overlay = true;
        const res = await axios.post('/dashboard/homePage/aboutSomeWords/save', this.aboutData);
        const res2 = await axios.post('/dashboard/homePage/mission/save', this.mission);
        
        if(res.status === 200 && res2.status === 200){
          // alert('تم إرسال البيانات بنجاح');
          this.alertMaker('تم إرسال بيانات عننا بنجاح');
          this.overlay = false;
        }
      },
      
      // Companies functions
      async submitCompaniesFunc(){
        this.overlay = true;
        let fd = new FormData();
        
        this.uploadedImgs = this.companies.existImgs.length ? [...this.companies.existImgs, ...this.companies.currentCompanies] : [...this.companies.currentCompanies];

        for(let i = 0; i < this.uploadedImgs.length; i++){
          fd.append(`Images[${i}][image]`, this.uploadedImgs[i].image || this.uploadedImgs[i])
        }

        if(this.companies.uploadedCompaniesImages.length > this.companies.existImgs.length){
          const res = await axios.post('/dashboard/aboutPage/companie/save', fd);
          ;
          if(res.status === 200){
            this.overlay = false;
            // alert('تم حفظ صور الشركات بنجاح')
            this.alertMaker('تم إرسال صور الشركات بنجاح')
            this.getHomePageData();
          }
        }else{
          // alert('No Changes')
          this.alertMaker('لا يوجد تغيرات فى صور الشركات', 'info', false);
        }
      },
      async deleteCompanyImg(img, index){
        this.overlay = true;
        if(img.id){
          const res = await axios.post('/dashboard/aboutPage/companie/delete', {id: img.id});
          if(res.status === 200){
            this.overlay = false;
            // alert('تم حذف صورة الشركه')
            this.alertMaker('تم حذف صورة الشركة بنجاح');
            this.getHomePageData();
          }
        }else{
          this.companies.uploadedCompaniesImages.splice(index, 1);
          this.companies.currentCompanies.splice(index - this.companies.existImgs.length, 1);
        }
      },

      // Video Functions
      async submitDemoData(){
        this.overlay = true;
        const res = await axios.post('/dashboard/homePage/video/save', this.demoData);
        if(res.status === 200){
          this.alertMaker('تم إرسال بيانات الفيديو بنجاح');
          this.overlay = false;
        }
      },

      // General Functions
      async getHomePageData(){
        const res = await axios.get('/dashboard/homePage');
        if(res.status === 200){
          this.overlay = false;

          this.demoData = res.data.data.video;
          this.aboutData = res.data.data.aboutSomeWords;
          this.mission = res.data.data.mission;
          this.getFeatures = res.data.data.services.sort((a, b) => a.id - b.id);
          
          this.slider.uploadedSliderImages = res.data.data.slider;
          this.slider.existImgs = res.data.data.slider.length ? [...res.data.data.slider] : [];
          
          this.companies.uploadedCompaniesImages = res.data.data.workedCompanies;
          this.companies.existImgs = res.data.data.workedCompanies.length ? [...res.data.data.workedCompanies] : [];

        }else{
          this.alertMaker('عفوا يوجد شئ خاطئ', 'error');
        }
      },
      trackImgs(bindingArr, outputArr, nameInLocaleStorage){
        for(let img of bindingArr){
          let myPromise = new Promise(function(myResolve, myReject) {
            const reader = new FileReader();

            reader.onload = () => {
              if (reader.result) {
                if(!outputArr.some(img => img.image === reader.result)){
                  myResolve({isNotExist: true, val: reader.result});
                }
              } else {
                myReject("Error");
              }
            }
            reader.readAsDataURL(img)
          });

          myPromise.then((vals) => {
            if(vals.isNotExist){
              outputArr.push({image: vals.val});
            }
            localStorage.setItem(nameInLocaleStorage, JSON.stringify(outputArr))
          }, (error) => {
            console.log(error);
          })
        }
      },
      alertMaker(titleAr, icon = 'success', requireReload = true){
        Swal.fire({
          position: 'center',
          icon: icon,
          title: titleAr,
          showConfirmButton: false,
          timer: 3000,
          didDestroy: () => {
            this.overlay = false;
            if(requireReload){
              location.reload();
            }
          }
        })
      }
    },
    watch:{
      'slider.sliderImages': {
        handler(newVal){
          if(newVal.length){
            this.trackImgs(this.slider.sliderImages, this.slider.uploadedSliderImages, 'imgSlider')
          }
        },
        deep: true,
      },
      'companies.currentCompanies': {
        handler(newVal){
          if(newVal.length){
            this.trackImgs(this.companies.currentCompanies, this.companies.uploadedCompaniesImages, 'companiesSlider')
          }
        },
        deep: true,
      },
    },
     mounted(){
      this.overlay = true;
      this.getHomePageData();
    }
}
</script>

<style lang="scss">
.divider {
  height:2px;
  width:90%;
  background-color: #333;
  &.w-100 {
    width: 100% !important;
  }
}
.makeGap {
  gap :20px
}
.v-text-field input {
  padding:0
}

.imgPreview {
  width: 50px;
  height: 50px;
  background-size: contain;
}

.noLetterSpace {
  letter-spacing: 0 !important;
}

.AddFeat{
  background-color: #0057a8 !important;
  color: #FFF !important;
  font-weight: bold;
}
</style>