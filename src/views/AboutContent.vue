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
      <h1 class="mb-4">محتوى صفحة عننا</h1>
      <v-expansion-panels>
          <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-medium">
                <h4>محتوى العنوان</h4>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-form>
                  <v-row>
                    <v-col cols="12" md="6" class="pb-0">
                      <v-textarea
                        v-model="aboutData.titleEn"
                        :rules="title_content.content"
                        outlined
                        no-resize
                        name="input-7-4"
                        label="المحتوى الانجليزى"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0">
                      <v-textarea
                        v-model="aboutData.titleAr"
                        :rules="title_content.content"
                        outlined
                        no-resize
                        name="input-7-4"
                        label="المحتوى العربى"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <v-btn color="success" @click="submitAbout()" class="noLetterSpace">حفظ محتوى العنوان</v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-medium">
                <h4>الشهادات</h4>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-form>
                  <v-row>
                    <v-col cols="12">
                      <v-file-input v-model="certificates.currentCertificates" label="صور الشهادات" show-size outlined multiple append-icon="mdi-camera"></v-file-input>
                      <template v-if="certificates.uploadedCertificatesImages.length">
                        <div class="mb-2 d-flex justify-space-between" v-for="(img, index) in certificates.uploadedCertificatesImages" :key="img.lastModified">
                          <div class="imgPreview" :style="{ 'background-image': `url(${img.image})` }"></div>
                          <div class="actions">
                            <v-icon class="red--text" @click="deleteCertificateImg(img, index)">mdi-delete</v-icon>
                          </div>
                        </div>
                      </template>
                      <v-btn color="success" @click="submitCertificatesFunc()" class="mt-3 noLetterSpace">حفظ صور الشهادات</v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-medium">
                <h4>شركات تم العمل معها</h4>
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
      </v-expansion-panels>
    </v-container>
</template>

<script>
import Swal from 'sweetalert2'
import axios from 'axios'
export default {
    name: "AboutContent",
    data(){
      return {
        aboutData:{
          titleEn: '',
          titleAr: '',
        },
        certificates:{
          currentCertificates:[],
          uploadedCertificatesImages:[],
          existImgs: [],
        },
        companies:{
          currentCompanies:[],
          uploadedCompaniesImages:[],
          existImgs: [],
        },
        title_content: {
          title:[
            v => !!v || 'العنوان مطلوب',
            // v => v.length >= 10 || 'Title must contain only characters',
          ],
          content:[
            v => !!v || 'المحتوى مطلوب',
            // v => v.length >= 10 || 'Content must contain only characters',
          ],

        },
        overlay: false,
      }
    },
    methods:{
      async getAboutPageData(){
        this.overlay = true;
        const res = await axios.get('/dashboard/aboutPage');
        if(res.status === 200){
          this.overlay = false;
          this.aboutData = res.data.data.setting;

          this.certificates.uploadedCertificatesImages = res.data.data.certificates;
          this.certificates.existImgs = res.data.data.certificates.length ? [...res.data.data.certificates] : [];

          this.companies.uploadedCompaniesImages = res.data.data.workedCompanies;
          this.companies.existImgs = res.data.data.workedCompanies.length ? [...res.data.data.workedCompanies] : [];
        }else{
          alert('There is SomeThing Wrong')
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
      async submitCertificatesFunc(){
        this.overlay = true;
        let fd = new FormData();
        let uploadedImgs = [];
        uploadedImgs = this.certificates.existImgs.length ? [...this.certificates.existImgs, ...this.certificates.currentCertificates] : [...this.certificates.currentCertificates];

        for(let i = 0; i < uploadedImgs.length; i++){
          fd.append(`Images[${i}][image]`, uploadedImgs[i].image || uploadedImgs[i])
        }

        if(this.certificates.uploadedCertificatesImages.length > this.certificates.existImgs.length){
          const res = await axios.post('/dashboard/aboutPage/certificates/save', fd);
          ;
          if(res.status === 200){
            this.overlay = false;
            // alert('تم حفظ صور الشهادات')
            this.alertMaker('تم إرسال صور الشهادات بنجاح');
          }
        }else{
          this.alertMaker('لا يوجد تغيرات فى صور الشهادات', 'info', false);
          // alert('No Changes')
        }
      },
      async deleteCertificateImg(img, index){
        this.overlay = true;
        if(img.id){
          const res = await axios.post('/dashboard/aboutPage/certificates/delete', {id: img.id});
          if(res.status === 200){
            this.overlay = false;
            // alert('تم حذف صورة الشهادة')
            this.getAboutPageData();
            this.alertMaker('تم حذف صورة الشهادة بنجاح');
          }
        }else{
          this.certificates.uploadedCertificatesImages.splice(index, 1);
          this.certificates.currentCertificates.splice(index - this.certificates.existImgs.length, 1);
        }
      },
      async submitCompaniesFunc(){
        this.overlay = true;
        let fd = new FormData();
        let uploadedImgs = [];
        uploadedImgs = this.companies.existImgs.length ? [...this.companies.existImgs, ...this.companies.currentCompanies] : [...this.companies.currentCompanies];

        for(let i = 0; i < uploadedImgs.length; i++){
          fd.append(`Images[${i}][image]`, uploadedImgs[i].image || uploadedImgs[i])
        }

        if(this.companies.uploadedCompaniesImages.length > this.companies.existImgs.length){
          const res = await axios.post('/dashboard/aboutPage/companie/save', fd);
          ;
          if(res.status === 200){
            this.overlay = false;
            // alert('تم حفظ صور الشركات')
            this.alertMaker('تم إرسال صور الشركات بنجاح');
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
      async submitAbout(){
        this.overlay = true;
        const res = await axios.post('/dashboard/aboutPage/setting/save', this.aboutData);
        ;
        if(res.status === 200){
          this.overlay = false;
          // alert('تم حفظ كلمات عننا بنجاح')
          this.alertMaker('تم إرسال محتوى عننا بنجاح');
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
            if(requireReload){
              location.reload();
            }
          }
        })
      }
    },
    watch:{
      'certificates.currentCertificates': {
        handler(newVal){
          if(newVal.length){
            this.trackImgs(this.certificates.currentCertificates, this.certificates.uploadedCertificatesImages, 'certificatesSlider')
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
    async mounted(){
      this.getAboutPageData();
    }
}
</script>

<style>
.noLetterSpace {
  letter-spacing: 0 !important;
}
</style>