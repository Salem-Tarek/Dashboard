<template>
  <v-container>
    <!-- User Details Edit and Add -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card class="mx-auto py-3" max-width="500px">
        <v-card-title>
          <h5>بيانات المشرف</h5>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                v-if="mode === 'show' && editOrAddUserData.image"
              >
                <v-img :src="editOrAddUserData.image" contain></v-img>
              </v-col>
              <v-col cols="12" v-else-if="mode !== 'show'">
                <v-file-input
                  @change="handleUserImg"
                  outlined
                  hide-details
                  label="صورة المشرف"
                ></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :disabled="mode === 'show'"
                  outlined
                  hide-details
                  v-model="editedUser.name"
                  label="الاسم"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :disabled="mode === 'show'"
                  outlined
                  hide-details
                  v-model="editedUser.email"
                  label="الايميل"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn
            v-if="mode === 'edit'"
            depressed
            color="info"
            @click="updateUser"
            ><v-icon left>mdi-account-edit</v-icon> تعديل بيانات المشرف</v-btn
          >
          <v-btn depressed color="error" @click="editDialog = false"
            ><v-icon left>mdi-account-plus</v-icon> إغلاق</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <h3 class="my-4">بروفايل الأدمن</h3>
    <v-card class="mx-auto" max-width="374">
      <!-- <v-img height="250" :src="dataShow.image || '../assets/default.jpg'"></v-img> -->
      <v-img height="250" :src="dataShow.image || userImg"></v-img>

      <v-card-title class="noLetterSpace">{{
        dataShow && dataShow.name
      }}</v-card-title>

      <v-card-text>
        <v-icon class="ml-2">mdi-email</v-icon>
        {{ dataShow && dataShow.email }}</v-card-text
      >
      <v-card-actions>
        <v-btn depressed color="info" @click="editUser(dataShow)"
          ><v-icon>mdi-account-edit</v-icon> تعديل بيانات الأدمن</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import router from "../store/index.js";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "Profile",
  data() {
    return {
      dialog: false,
      editDialog: false,
      submitBtn: true,
      userImg: "../assets/default.jpg",
      dataShow: {},
      userData: {
        name: "",
        password: "",
        image: null,
      },
      disabled: true,
      dialogDelete: false,
      editedUser: {},
      mode: "",
      newUser: {
        name: "",
        email: "",
        image: null,
        password: "",
      },
      userDeletedId: null,
    };
  },
  beforeRouteEnter(to, from, next) {
    if (router.getters.isLogged) {
      next();
    } else {
      next("/login");
      this.alertMaker("يجب تسجيل الدخول اولا");
    }
  },
  methods: {
    async updateUser() {
      let fd = new FormData();
      for (let key in this.editedUser) {
        if (this.editedUser[key]) {
          fd.append(key, this.editedUser[key]);
        }
      }
      const res = await axios.post("/dashboard/profile/update", fd);
      if (res.status === 200) {
        this.alertMaker("تم تعديل البيانات بنجاح");
        this.getProfileData();
        ;
        this.editDialog = false;
      }
    },
    handleImg(e) {
      if (e) {
        this.userData.image = e;
        this.submitBtn = false;
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          this.userImg = reader.result;
          // Store This Array below in both localStorage and Store
          localStorage.setItem("userImg", this.userImg);
          localStorage.setItem("userImgFile", JSON.stringify(e));
        });
        reader.readAsDataURL(e);
      }
    },
    async getProfileData() {
      const res = await axios.get("/dashboard/profile");
      if (res.status === 200) {
        this.dataShow = res.data.data;
        this.userData.name = res.data.data.name;
        this.userData.image = res.data.data.image;
      }
    },
    editUser(item) {
      this.editDialog = true;
      this.editedUser = item;
      this.mode = "edit";
    },
    handleUserImg(e) {
      this.disabled = false;
      if (this.mode === "create") {
        this.newUser.image = e;
      } else {
        this.editedUser.image = e;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        this.userImg = reader.result;
      });
      reader.readAsDataURL(e);
    },
    saveUserChanges() {
      this.editedUser = {};
    },
    alertMaker(titleAr, icon = "success") {
      Swal.fire({
        position: "center",
        icon: icon,
        title: titleAr,
        showConfirmButton: false,
        timer: 3000,
        didDestroy: () => {
          // location.reload();
        },
      });
    },
  },
  mounted() {
    this.userImg = localStorage.getItem("userImg");
    this.getProfileData();
  },
  watch: {
    editDialog(newVal) {
      if (!newVal) {
        // ;
        this.getProfileData();
      }
    },
  },
  computed: {
    editOrAddUserData() {
      return this.mode === "create" ? this.newUser : this.editedUser;
    },
  },
};
</script>

<style>
.noLetterSpace {
  letter-spacing: 0 !important;
}

.profile {
  width: 100vw;
  height: calc(100vh - 65px);
  background-color: #e2e2e2;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview {
  width: 100px;
  height: 100px;
  background-size: contain;
}
</style>
