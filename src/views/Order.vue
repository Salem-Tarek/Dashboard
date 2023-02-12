<template>
  <main>
    <v-overlay :value="overlay">
      <v-progress-circular
        :size="70"
        :width="7"
        color="blue"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
    <v-container>
      <div class="orders">
        <template>
          <v-data-table
            :headers="orderType !== 'price' ? headers : headers_price"
            :items="orders"
            class="elevation-1"
            hide-default-footer
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title class="font-weight-bold blue--text">
                  <h2>الطلبات</h2>
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
                      <span class="text-h5 cairoFont">تفاصيل الطلب</span>
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
                              v-model="editedItem.address"
                              label="العنوان"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" v-if="orderType !== 'price'">
                            <v-text-field
                              disabled
                              outlined
                              hide-details
                              v-model="editedItem.date"
                              label="التاريخ"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" v-if="orderType === 'price'">
                            <v-text-field
                              disabled
                              outlined
                              hide-details
                              v-model="editedItem.career"
                              label="مجال نشاط العميل"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              disabled
                              outlined
                              hide-details
                              v-model="editedItem.person"
                              label="الشخص المسئول"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" v-if="orderType !== 'price'">
                            <v-text-field
                              disabled
                              outlined
                              hide-details
                              v-model="editedItem.system"
                              label="النظام المراد إصلاحة"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" v-if="orderType === 'price'">
                            <v-text-field
                              disabled
                              outlined
                              hide-details
                              v-model="editedItem.details"
                              label="التفاصيل"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-textarea
                              disabled
                              outlined
                              hide-details
                              v-model="editedItem.notes"
                              label="ملاحظات"
                              no-resize
                            ></v-textarea>
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
                    <v-card-title class="noLetterSpace">هل تريد حذف هذا الطلب ؟</v-card-title>
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
  </main>
</template>

<script>
import router from '../store/index.js';
import axios from 'axios';
import Swal from 'sweetalert2'

export default {
  name: "Order",
  data(){
    return {
      orderType: '',
      headers: [
        { text: 'الاسم',value: 'fullname' },
        { text: 'الايميل', value: 'email' },
        { text: 'الواتس اب', value: 'whatsapp' },
        { text: 'العنوان', value: 'address' },
        { text: 'التاريخ', value: 'date' },
        { text: 'الشخص المسئول', value: 'person' },
        { text: 'النظام المراد إصلاحه', value: 'system' },
        { text: 'ملاحظات', value: 'notes' },
        { text: 'عرض و حذف', value: 'actions' },
      ],
      headers_price: [
        { text: 'الاسم',value: 'fullname' },
        { text: 'الايميل', value: 'email' },
        { text: 'الواتس اب', value: 'whatsapp' },
        { text: 'العنوان', value: 'address' },
        { text: 'مجال نشاط العميل', value: 'career' },
        { text: 'الشخص المسئول', value: 'person' },
        { text: 'التفاصيل', value: 'details' },
        { text: 'ملاحظات', value: 'notes' },
        { text: 'عرض و حذف', value: 'actions' },
      ],
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      orders: [],
      editedItem: {},
      overlay: false,
    }
  },
  watch: {
    $route: {
      handler(){
        this.overlay = true;
        this.orderType = this.$route.params.type;
        this.getOrdersData();
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    async getOrdersData(){
      let res = null;
      switch(this.orderType){
        case 'service' :
          res = await axios.get('/dashboard/ordersService');
          break;
        case 'price' :
          res = await axios.get('/dashboard/ordersPrice');
          break;
        case 'survey' :
          res = await axios.get('/dashboard/orders');
          break;
        default :
          this.$route.push('/')
      }
      if(res.status === 200){
        this.orders = res.data.data.orders;
        this.overlay = false;
      }else{
        this.$route.push('/')
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
      let res = null;
      switch(this.orderType){
        case 'service' :
          res = await axios.post('/dashboard/ordersService/delete', {id: this.editedItem.id});
          break;
        case 'price' :
          res = await axios.post('/dashboard/ordersPrice/delete', {id: this.editedItem.id});
          break;
        case 'survey' :
          res = await axios.post('/dashboard/orders/delete', {id: this.editedItem.id});
          break;
        default : 
          this.$route.push('/')
      }
      if(res.status === 200){
        // alert('تم حذف الطلب بنجاح');
        this.alertMaker('تم حذف الطلب بنجاح');
        this.getOrdersData()
      }else{
        this.alertMaker('عفوا يوجد شئ خاطئ', 'error');
      }
      this.dialogDelete = false;
    },
    alertMaker(titleAr, icon = 'success'){
      Swal.fire({
        position: 'center',
        icon: icon,
        title: titleAr,
        showConfirmButton: false,
        timer: 3000,
        didDestroy: () => {
          // location.reload();
        }
      })
    }
  },
  beforeRouteEnter(to, from, next){
    if(router.getters.isLogged){
      next()
    }else{
      next("/login")
      this.alertMaker('يجب تسجيل الدخول اولا', 'info');
    }
  },
}
</script>

<style>
.text-h5.cairoFont {
  font-family: 'Cairo', sans-serif !important;
}
.noLetterSpace {
  letter-spacing: 0 !important;
}
</style>