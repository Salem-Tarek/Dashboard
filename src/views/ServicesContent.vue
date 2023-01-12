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
    <h1 class="mb-4">محتوى صفحات الخدمات</h1>

    <!-- If There is Services -->
    <template v-if="getServices.length">
      <template v-for="(service, index) in getServices">
        <Service @servicePropChanged="serviceBtn = false" @imgDeleted="getServicesPage" :serviceData="service" @serviceDataChanged="getServicesData()" ref="serviceComponent" :serviceNum="index+1" :key="`getService${service.id}`" />
        <div class="deleteService d-flex align-center justify-space-between makeGap" :key="service.id">
          <div class="divider"></div>
          <v-btn depressed color="error" class="noLetterSpace" @click="deleteService(service.id)">حذف الخدمة</v-btn>
        </div>
      </template>
    </template>

    <!-- If There is No Services -->
    <template>
      <template v-for="n in servicesCount">
        <Service :serviceData="null" @serviceDataChanged="getServicesData()" ref="serviceComponent" :serviceNum="n + getServices.length" :key="`service-${n}`" />
        <div class="divider w-100" :key="n"></div>
      </template>
    </template>

    
    <div class="mt-3 d-flex makeGap">
      <v-btn depressed class="AddService" @click="servicesCount++">أضف خدمة</v-btn>
      <v-btn color="success" @click="submitServices()" :disabled="serviceBtn">حفظ الخدمات</v-btn>
    </div>
  </v-container>
</template>

<script>
import Service from '../components/Service.vue'
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  name: "ServicesContent",
  components: {
    Service,
  },
  data(){
    return {
      services: [],
      servicesCount: 1,
      uploadedImgs: [],
      getServices: [],
      serviceBtn: true,
      overlay: false,
    }
  },
  methods:{
    getServicesData(){
      // this.services = this.$refs.serviceComponent.map((comp) => !comp._props.serviceData ? comp.$data.servicesData : comp._props.serviceData);
      this.services = this.$refs.serviceComponent.map((comp) => !comp._props.serviceData ? false : comp._props.serviceData).filter(service => service !== false);

      this.services = [...this.services, this.$refs.serviceComponent.map((comp) => !comp._props.serviceData ? comp.$data.servicesData : false).filter(service => service !== false)[0]];
      
      let lastServiceData = Object.values(this.services[this.services.length - 1]);

      let isEmpty = lastServiceData.every(val => val === '' || val === 0 || val === null);
      
      if(isEmpty){
        this.services.pop()
      }
      
      this.serviceBtn = false;
    },
    async submitServices(){
      this.overlay = true;
      this.getServicesData();

      for(let service of this.services){
        for(let key in service){
          if(service[key] === "" || service[key] === null){
            // alert('يجب ملئ كل حقول الادخال')
            this.alertMaker('يجب ملئ كل حقول الادخال', 'warning');
            return;
          }
        }
      }

      let fd = new FormData();
      for(let i = 0; i < this.services.length; i++){
        for(let key in this.services[i]){
          if(key === 'images' || key === 'media'){
            if(key.length){
              for(let j = 0; j < this.services[i][key].length; j++){
                fd.append(`Items[${i}][Images][${j}][image]`, this.services[i][key][j].image || this.services[i][key][j]);
              }
            }
          }else{
            fd.append( `Items[${i}][${key}]`, this.services[i][key]);
          }
        }
      }

      const res = await axios.post('/dashboard/servicesPage/Items/save', fd)
      ;
      if(res.status === 200){
        this.overlay = false;
        // alert('تم إرسال الخدمات بنجاح')
        this.alertMaker('تم إرسال الخدمات بنجاح');
      }
    },
    async getServicesPage(){
      this.overlay = true;
      const res = await axios.get('/dashboard/servicesPage');
      if(res.status === 200){
        this.overlay = false;
        this.getServices = res.data.data.sort((a, b) => a.id - b.id);
      }
    },
    async deleteService(id){
      this.overlay = true;
      const res = await axios.post('/dashboard/servicesPage/Items/delete', {id: id});
      if(res.status === 200){
        this.overlay = false;
        // alert('تم حذف الخدمة بنجاح');
        this.alertMaker('تم حذف الخدمة بنجاح');
        this.getServicesPage();
      }
    },
    alertMaker(titleAr, icon = 'success'){
      Swal.fire({
        position: 'center',
        icon: icon,
        title: titleAr,
        showConfirmButton: false,
        timer: 3000,
        didDestroy: () => {
          location.reload();
        }
      })
    }
  },
  mounted(){
    this.overlay = true;
    this.getServicesPage();
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
.AddService{
  background-color: #0057a8 !important;
  color: #FFF !important;
  letter-spacing: 0 !important;
  font-weight: bold;
}
</style>