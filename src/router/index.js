import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
// import Home from "../views/Home.vue";
import Theme1 from "../views/Theme1.vue";
import LogIn from "../views/LogIn.vue";
// import OrdersPage from "../views/OrdersPage.vue";
import Profile from "../views/Profile.vue";
import HomeContent from "../views/HomeContent.vue";
import AboutContent from "../views/AboutContent.vue";
import ServicesContent from "../views/ServicesContent.vue";
import Setting from "../views/Setting.vue";
import NotFound from "../views/NotFound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Theme1",
    component: Theme1,
    meta: {requiresAuth: true},
  },
  {
    path: "/login",
    name: "LogIn",
    component: LogIn,
    meta: {guest: true},
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {requiresAuth: true},
  },
  {
    path: "/home-content",
    name: "HomeContent",
    component: HomeContent,
    meta: {requiresAuth: true},
  },
  {
    path: "/about-content",
    name: "AboutContent",
    component: AboutContent,
    meta: {requiresAuth: true},
  },
  {
    path: "/services-content",
    name: "ServicesContent",
    component: ServicesContent,
    meta: {requiresAuth: true},
  },
  {
    path: "/setting",
    name: "Setting",
    component: Setting,
    meta: {requiresAuth: true},
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});


router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLogged) {
      next()
      return
    }else{
      next('/login')
    }
  } else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.guest)) {
    if (store.getters.isLogged) {
      next("/login");
      return;
    }else{
      next();
    }
  } else {
    next();
  }
});

export default router;
