<template>
  <v-app dir="rtl">
    <Navbar :activeTabs="activeTabs"/>
    <v-main>
      <router-view :access="userAccess" @getActiveTabs="getActiveTabs" />
    </v-main>
    <TheFooter />
  </v-app>
</template>

<script>
import Navbar from './components/layout/Navbar.vue';
import TheFooter from './components/layout/TheFooter.vue';
import axios from 'axios';
export default {
  name: "App",
  components :{
    Navbar,
    TheFooter
  },
  data(){
    return {
      activeTabs: {
        pages: [
          { title: "الرئيسية", icon: "mdi-home", link: "/home-content" },
          { title: "عننا", icon: "mdi-information", link: "/about-content" },
          { title: "الخدمات", icon: "mdi-format-list-bulleted-type", link: "/services-content" },
        ],
        ordersList: [
          { title: "طلب سعر", icon: "mdi-currency-usd", link: "/Order/price" },
          { title: "طلب صيانة", icon: "mdi-tools", link: "/Order/service" },
          {
            title: "طلب معاينة",
            icon: "mdi-account-hard-hat",
            link: "/Order/survey",
          },
        ],
      },
      userAccess: {},
    }
  },
  methods: {
    getActiveTabs(val){
      for(let page of this.activeTabs.pages){
        if(page.link === '/home-content'){
          page.isShown = val.home.index;
        }else if(page.link === '/about-content') {
          page.isShown = val.about.index;
        }else {
          page.isShown = val.services.index;
        }
      }
      
      for(let orderPage of this.activeTabs.ordersList){
        if(orderPage.link === '/Order/price'){
          orderPage.isShown = val.orderPrice.index;
        }else if(orderPage.link === '/Order/service') {
          orderPage.isShown = val.orderServices.index;
        }else {
          orderPage.isShown = val.order.index;
        }
      }
      this.activeTabs.setting = val.setting;
      this.activeTabs.users = val.users;
      this.activeTabs.contactUs = val.contactUs;

      localStorage.setItem('activeTabs', JSON.stringify(this.activeTabs))
    }
  },
  async mounted(){
    if(this.$store.getters.isLogged){
      const res = await axios.get('/dashboard/setting');
      if(res.status === 200){
        const favIcon = document.getElementById('favIconId');
        favIcon.href = res.data.data.favicon;
        // location.reload();
      }
    }
  },
  created(){
    if(this.$store.getters.isLogged){
      if(localStorage.getItem('activeTabs')){
        this.userAccess = JSON.parse(localStorage.getItem('activeTabs'));
        this.activeTabs = JSON.parse(localStorage.getItem('activeTabs'));
      }
    }
  }
};
</script>
<style>
  body, body *, .v-application .subtitle-1, .v-application .display-2, .v-application .display-1 {
    font-family: 'Cairo', sans-serif !important;
    letter-spacing: 0 !important;
  }
</style>
