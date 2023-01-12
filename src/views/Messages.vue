<template>
    <v-container>
        <v-overlay :value="overlay">
            <v-progress-circular
            :size="70"
            :width="7"
            color="blue"
            indeterminate></v-progress-circular>
        </v-overlay>
      <div class="messages">
        <template>
          <v-data-table
            :headers="headers"
            :items="messages"
            class="elevation-1"
            hide-default-footer
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title class="font-weight-bold blue--text">
                  <h2>الرسائل</h2>
                </v-toolbar-title>
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <!-- Order Details View Component -->
                <v-dialog v-model="dialog" max-width="500px">
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">تفاصيل الطلب</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-text-field
                              disabled
                              outlined
                              hide-details
                              v-model="editedItem.fullname"
                              label="الاسم"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              disabled
                              outlined
                              hide-details
                              v-model="editedItem.email"
                              label="الايميل"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              disabled
                              outlined
                              hide-details
                              v-model="editedItem.whatsapp"
                              label="الواتس اب"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              disabled
                              outlined
                              hide-details
                              v-model="editedItem.phone"
                              label="رقم الموبايل"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              disabled
                              outlined
                              hide-details
                              v-model="editedItem.subject"
                              label="الموضوع"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary darken-1" @click="dialog = false">
                        إغلاق
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="noLetterSpace">هل تريد حذف هذه الرساله ؟</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" @click="dialogDelete = false">إغلاق</v-btn>
                      <v-btn color="error" @click="deleteItemConfirm">حذف</v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon class="title ml-3" @click="editItem(item)">
                mdi-eye
              </v-icon>
              <v-icon class="title" @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </template>
      </div>
    </v-container>
</template>

<script>
import router from '../store/index.js';
import axios from 'axios';
import Swal from 'sweetalert2'

export default {
    name: "Messages",
    beforeRouteEnter(to, from, next){
        if(router.getters.isLogged){
        next()
        }else{
        next("/login")
        this.alertMaker('يجب تسجيل الدخول اولا', 'info');
        }
    },
    data(){
      return {
        headers: [
          { text: 'الاسم',value: 'fullname' },
          { text: 'الايميل', value: 'email' },
          { text: 'الواتس اب', value: 'whatsapp' },
          { text: 'رقم الموبايل', value: 'phone' },
          { text: 'الموضوع', value: 'subject' },
          { text: 'عرض و حذف', value: 'actions' },
        ],
        dialog: false,
        overlay: false,
        dialogDelete: false,
        editedIndex: -1,
        messages: [],
        editedItem: {},
      }
    },
    methods: {
      async getMessages(){
          this.overlay = true;
          const res = await axios.get('/dashboard/contactUs');
          if(res.status === 200){
            this.messages = res.data.data.contactUs;
            this.overlay = false;
          }
      },
      editItem (item) {
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      async deleteItemConfirm(){
        const res = await axios.post('/dashboard/contactUs/delete', {id: this.editedItem.id});
        this.dialogDelete = false;
        if(res.status === 200){
          // alert('تم حذف الرساله بنجاح');
          this.alertMaker('تم حذف الرساله بنجاح');
          this.getMessages();
        }
      },
      alertMaker(titleAr){
        Swal.fire({
          position: 'center',
          icon: 'success',
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
      this.getMessages()
    }
}
</script>

<style>

</style>