<template>
  <nav>
    <v-navigation-drawer v-model="drawer" app dark right v-if="isLogged">
      <v-list class="pb-0">
        <v-list-item top class="py-1">
          <v-list-item-avatar>
            <v-img src="../../assets/handasiah.png"></v-img>
          </v-list-item-avatar>
          <h3>الهندسيــة</h3>
        </v-list-item>
        <v-divider></v-divider>
      </v-list>
      <v-list class="pt-0 navigation">
        <v-subheader>الإعدادت</v-subheader>
        <v-list-item class="px-0">
          <router-link to="/" class="d-flex px-4">
            <v-list-item-icon>
              <v-icon v-text="'mdi-chart-bar'"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'الإحصائيات'"></v-list-item-title>
            </v-list-item-content>
          </router-link>
        </v-list-item>
        <v-list-item class="px-0" v-if="savedActiveTabs?.setting?.index || activeTabs.setting.index">
          <router-link to="/setting" class="d-flex px-4">
            <v-list-item-icon>
              <v-icon v-text="'mdi-cog'"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'الإعدادات'"></v-list-item-title>
            </v-list-item-content>
          </router-link>
        </v-list-item>
        <v-list-item class="px-0" v-if="savedActiveTabs?.users?.index || activeTabs.users.index">
          <router-link to="/users" class="d-flex px-4">
            <v-list-item-icon>
              <v-icon v-text="'mdi-account-group'"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'المشرفين'"></v-list-item-title>
            </v-list-item-content>
          </router-link>
        </v-list-item>

        <template v-if="pages">
          <v-subheader>الصفحات</v-subheader>
          <template v-for="(page, i) in (savedActiveTabs?.pages || activeTabs.pages)">
            <v-list-item v-if="page.isShown"
              :key="`page-${i}-${page.title}`"
              class="px-0"
            >
              <router-link :to="page.link" class="d-flex px-4">
                <v-list-item-icon>
                  <v-icon v-text="page.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="page.title"></v-list-item-title>
                </v-list-item-content>
              </router-link>
            </v-list-item>
          </template>
        </template>
        <template v-if="orders">
          <v-subheader>الطلبات</v-subheader>
          <template v-for="(page, i) in (savedActiveTabs?.ordersList || activeTabs.ordersList)">
            <v-list-item v-if="page.isShown"
              :key="`order-${i}-${page.title}`"
              class="px-0"
            >
              <router-link :to="page.link" class="d-flex px-4">
                <v-list-item-icon>
                  <v-icon v-text="page.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="page.title"></v-list-item-title>
                </v-list-item-content>
              </router-link>
            </v-list-item>
          </template>
        </template>

        <v-subheader v-if="savedActiveTabs?.contactUs?.index || activeTabs.contactUs.index">تواصل معنا</v-subheader>
        <v-list-item class="px-0" v-if="savedActiveTabs?.contactUs?.index || activeTabs.contactUs.index">
          <router-link to="/messages" class="d-flex px-4">
            <v-list-item-icon>
              <v-icon>mdi-forum</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>تواصل معنا</v-list-item-title>
            </v-list-item-content>
          </router-link>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <h1>الهندسيــة</h1>
      <v-spacer></v-spacer>
      <span class="group">
        <v-menu offset-y v-if="isLogged">
          <template v-slot:activator="{ on, attrs }">
            <v-icon plain dense class="ma-2" v-bind="attrs" v-on="on"
              >mdi-account-circle</v-icon>
          </template>
          <v-list class="text-center">
            <v-list-item class="px-0">
              <v-list-item-title>
                <v-btn class="black--text" to="/profile">
                  <v-icon left>mdi-account</v-icon>
                  الصفحة الشخصية
                </v-btn>
              </v-list-item-title>
            </v-list-item>
            <v-list-item class="px-0 justify-center">
              <v-btn class="black--text elevation-0" @click="LogOut()">
                <v-icon left>mdi-exit-to-app</v-icon>
                تسجيل الخروج
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </span>
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        v-if="isLogged"
      ></v-app-bar-nav-icon>
    </v-app-bar>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Navbar",
  data() {
    return {
      drawer: true,
      savedActiveTabs: {},
    };
  },
  props: ['activeTabs'],
  computed: {
    ...mapGetters(["isLogged"]),
    pages(){
      let pages = this.activeTabs.pages;
      return pages.filter(page => page.isShown === true).length;
    },
    orders(){
      let pages = this.activeTabs.ordersList;
      return pages.filter(page => page.isShown === true).length;
    },
  },
  methods: {
    ...mapActions(["userLogIn", "userLogOut"]),
    LogOut() {
      this.userLogOut();
      localStorage.removeItem("userToken");
      this.$router.push("/login");
    },
  },
  created(){
    this.savedActiveTabs = JSON.parse(localStorage.getItem('activeTabs'));
  },
};
</script>

<style>
a {
  text-decoration: none;
  color: #fff !important;
  width: 100% !important;
  transition: 0.5s;
}
.navigation .v-list-item a:hover,
.navigation .v-list-item .router-link-exact-active {
  background-color: rgba(238, 238, 238, 0.4);
}

.v-badge span.v-badge__badge.red {
  inset: auto auto calc(100% - 12px) calc(100% - 14px) !important;
}
.v-badge span.v-badge__badge.yellow {
  inset: auto auto calc(100% - 12px) calc(100% - 18px) !important;
}
</style>
