<template>
  <v-app dir="rtl">
    <Navbar />
    <v-main>
      <router-view />
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
  async mounted(){
    const res = await axios.get('/dashboard/setting');
    if(res.status === 200){
      const favIcon = document.getElementById('favIconId');
      favIcon.href = res.data.data.favicon;
      // location.reload();
    }

  }
};
</script>
<style>
  body, body *, .subtitle-1 {
    font-family: 'Cairo', sans-serif !important;
  }
</style>
