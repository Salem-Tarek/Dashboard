<template>
  <v-container class="my-4">
    <v-form class="login-form" ref="form" v-model="valid" @submit.prevent="submitForm()">
      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <v-text-field
            v-model="logInForm.email"
            :rules="rules.email"
            label="إيميل"
            outlined
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="d-flex justify-center">
          <v-text-field
            v-model="logInForm.password"
            :rules="rules.password"
            type="password"
            label="باسورد"
            outlined
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="d-flex justify-center">
          <v-btn dark type="submit" class="noLetterSpace">تسجيل الدخول</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import Swal from 'sweetalert2'
import axios from 'axios'
export default {
  name: "LogIn",
  data(){
    return {
      logInForm: {
        email: '',
        password: '',
      },
      valid: false,
      rules:{
        email: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        password:[
          v => !!v || 'Password is Required',
        ]
      }
    }
  },
  methods:{
    async submitForm(){
      if(this.$refs.form.validate()){
        try {
          const res = await axios.post('/dashboard/login', this.logInForm);
          if(res.status === 200){
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.accessToken}`;
            this.$store.commit('setUser', res.data.data.accessToken)
            localStorage.setItem('userToken', res.data.data.accessToken);
            this.$router.push("/home-content");
            this.$emit('getActiveTabs', res.data.data.access)
          }

          // location.reload()
        } catch (error) {

          // alert("Email or Password incorrect")
          this.alertMaker('البريد الالكترونى او كلمة المرور غير صحيحه', 'error');
        }
      }else{
        // alert('Please, Fill all Fields according to the rules');
        this.alertMaker('من فضلك قم بملئ جميع حقول الإدخال طبقا لقواعد كل حقل', 'warning');
      }
    },
    alertMaker(titleAr, icon = 'success'){
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
  },
};
</script>

<style>
.noLetterSpace {
  letter-spacing: 0 !important;
}
.login-form .v-text-field{
  max-width: 400px !important;
}
</style>