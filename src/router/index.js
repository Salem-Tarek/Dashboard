import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
// import Home from "../views/Home.vue";
// import Theme1 from "../views/Theme1.vue";
import LogIn from "../views/LogIn.vue";
// import OrdersPage from "../views/OrdersPage.vue";
import Profile from "../views/Profile.vue";
import HomeContent from "../views/HomeContent.vue";
import AboutContent from "../views/AboutContent.vue";
import ServicesContent from "../views/ServicesContent.vue";
import Order from "../views/Order.vue";
import Messages from "../views/Messages.vue";
import Setting from "../views/Setting.vue";
import Users from "../views/Users.vue";
import NotFound from "../views/NotFound.vue";
import Swal from 'sweetalert2'

Vue.use(VueRouter);

const routes = [
  // {
  //   path: "/",
  //   name: "Theme1",
  //   component: Theme1,
  //   meta: {requiresAuth: true},
  // },
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
    path: "/users",
    name: "Users",
    component: Users,
    meta: {requiresAuth: true},
  },
  {
    // /:id
    path: "/Order/:type",
    name: "Order",
    component: Order,
    meta: {requiresAuth: true},
  //   children: [
  //     {
  //         path: "",
  //         name: "Child1",
  //         component: Child1
  //     }
  // ]
  },
  {
    path: "/messages",
    name: "Messages",
    component: Messages,
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
    beforeEnter: (to, from, next) => {
      if(!store.getters.isLogged){
        next('/login')
      }else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'هذا المسار غير موجود',
          showConfirmButton: false,
          timer: 3000,
          didDestroy: () => {
            next('/home-content')
            // location.reload();
          }
        })
      }
    },
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
