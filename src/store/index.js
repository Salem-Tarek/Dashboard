import Vue from "vue";
import Vuex from "vuex";
import Swal from 'sweetalert2'

Vue.use(Vuex);

function alertMaker(titleAr, icon = 'success'){
  Swal.fire({
    position: 'center',
    icon: icon,
    title: titleAr,
    showConfirmButton: false,
    timer: 3000,
    // didDestroy: () => {
    //   location.reload();
    // }
  })
}

export default new Vuex.Store({
  state: {
    user: localStorage.getItem('userToken') || null,
    lang: "en",
  },
  getters:{
    isLogged(state){
      if(state.user !== '' && state.user !== null){
        return true
      }else{
        return false
      }
    } 
  },
  mutations: {
    toggleLang: state => {
      if(state.lang === "en"){
        state.lang = "ar"
      }else{
        state.lang = "en"
      }
    },
    setUser(state, token){
      state.user = token;
    },
    logOut(state){
      state.user = null;
      localStorage.removeItem('userToken');
      localStorage.removeItem('servicesTitles');
      localStorage.removeItem('activeTabs');
      // alert('Logged Out');
      alertMaker('تم تسجيل الخروج بنجاح');
    },
  },
  actions: {
    toggleLang({commit}){
      commit('toggleLang')
    },
    userLogIn({commit}){
      commit("userLogIn")
    },
    userLogOut({commit}){
      commit("logOut")
    },
  },
});
