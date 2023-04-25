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
    <v-btn color="info" @click="addUserProcess" class="mb-3">
      <v-icon left>mdi-account-plus</v-icon>
      إضافة مشرف
    </v-btn>
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
                v-if="mode === 'show' && editedUser.image"
              >
                <v-img :src="editOrAddUserData.image" contain></v-img>
              </v-col>
              <v-col cols="12" v-if="mode !== 'show'">
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
                  v-model="editOrAddUserData.name"
                  label="الاسم"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :disabled="mode === 'show'"
                  outlined
                  hide-details
                  v-model="editOrAddUserData.email"
                  label="الايميل"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :disabled="mode === 'show'"
                  outlined
                  hide-details
                  :value="getRole()"
                  label="رتبة المشرف"
                ></v-text-field>
              </v-col>
              <v-col cols="12" v-if="mode === 'create'">
                <v-text-field
                  type="password"
                  outlined
                  hide-details
                  v-model="newUser.password"
                  label="الباسورد"
                ></v-text-field>
              </v-col>
              <v-col cols="12" v-if="mode === 'create'">
                <v-select
                  hide-details
                  :items="roles"
                  label="رتبة المشرف"
                  v-model="newUser.role"
                  item-value="value"
                  item-text="text"
                  outlined
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn
            v-if="mode === 'create'"
            depressed
            color="info"
            @click="createUser"
            ><v-icon left>mdi-account-plus</v-icon> إنشاء مشرف</v-btn
          >
          <v-btn
            v-if="mode === 'edit'"
            depressed
            color="info"
            @click="updateUser"
            ><v-icon left>mdi-account-edit</v-icon> تعديل بيانات المشرف</v-btn
          >
          <v-btn depressed color="error" @click="editDialog = false"
            ><v-icon left>mdi-close</v-icon> إغلاق</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Users Table -->
    <div class="users" v-if="users.length">
      <template>
        <v-data-table
          :headers="headers"
          :items="users"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title class="font-weight-bold blue--text">
                <h2>قائمة المشرفين</h2>
              </v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>

              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="noLetterSpace"
                    >هل تريد حذف هذاالمشرف ؟</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="closeDeleteDialog"
                      >إغلاق</v-btn
                    >
                    <v-btn color="error" @click="deleteItemConfirm">حذف</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.image="{ item }">
            <div class="my-2 p-2">
              <v-img max-width="100px" :src="item.image" :alt="item.name" max-height="100px"></v-img>
            </div>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon large class="title ml-3" @click="showUser(item)">
              mdi-eye
            </v-icon>
            <v-icon class="title" @click="deleteUser(item.id)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </template>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "Users",
  data() {
    return {
      users: [],
      headers: [
        { text: "الاسم", value: "name" },
        { text: "الايميل", value: "email" },
        { text: "الصورة", value: "image" },
        { text: "حذف و تعديل", value: "actions" },
      ],
      dialogDelete: false,
      userDeletedId: null,
      editedUser: {},
      editDialog: false,
      mode: "",
      currentUserData: {},
      newUser: {
        name: "",
        email: "",
        image: null,
        password: "",
        role: 1
      },
      roles: [
        {
          text: "مشرف (Supervisor)",
          value: 2
        },
        {
          text: "مسئول (Admin)",
          value: 1
        },
      ],
      overlay: false,
    };
  },
  computed: {
    editOrAddUserData() {
      return this.mode === "create" ? this.newUser : this.editedUser;
    },
  },
  methods: {
    async getUsers() {
      this.overlay = true;
      const res = await axios.get("/dashboard/users");
      if (res.status === 200) {
        this.users = res.data.data.users;
        this.overlay = false;
      }
    },
    async getProfileData() {
      this.overlay = true;
      const res = await axios.get("/dashboard/profile");
      if (res.status === 200) {
        this.currentUserData = res.data.data;
        this.overlay = false;
      }
    },
    async createUser() {
      let fd = new FormData();
      for (let key in this.newUser) {
        fd.append(key, this.newUser[key]);
      }

      const res = await axios.post("/dashboard/users/create", fd);
      if (res.status === 200) {
        this.alertMaker("تم إنشاء المشرف بنجاح");
        this.editDialog = false;
        this.getUsers();
      }
    },
    addUserProcess() {
      this.mode = "create";
      this.editDialog = true;
    },
    closeDeleteDialog() {
      this.dialogDelete = false;
      this.userDeletedId = null;
    },
    showUser(item) {
      this.editDialog = true;
      this.editedUser = item;
      this.mode = "show";
    },
    deleteUser(id) {
      if (id !== this.currentUserData.id) {
        this.dialogDelete = true;
        this.userDeletedId = id;
      } else {
        this.alertMaker(
          "عفوا, لا يمكن حذف المشرف المسجل فى الموقع الان",
          "warning"
        );
      }
    },
    async deleteItemConfirm() {
      if (this.userDeletedId) {
        const res = await axios.post("/dashboard/users/delete", {
          id: this.userDeletedId,
        });
        if (res.status === 200) {
          this.alertMaker("تم حذف المستخدم بنجاح");
          this.dialogDelete = false;
          this.getUsers();
        }
      }
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
    getRole(){
      if(this.editOrAddUserData.role === 2){
        return "مشرف (Supervisor)"
      }else {
        return "مسئول (Admin)"
      }
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
    this.getUsers();
    this.getProfileData();
  },
};
</script>

<style>
.noLetterSpace {
  letter-spacing: 0 !important;
}
</style>
