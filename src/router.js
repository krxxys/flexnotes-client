import { createMemoryHistory, createRouter, createWebHistory } from "vue-router"
import HomeView from "./views/HomeView.vue"
import LoginView from "./views/LoginView.vue"
import RegisterView from "./views/RegisterView.vue"


const routes = [
    { path: '/', name: 'home', component: HomeView, meta: {auth: true} },
    { path: '/login', name: 'login', component: LoginView, meta: {auth: false}},
    { path: '/register', name: 'register', component: RegisterView, meta: {auth: false}},
    { path: '/editor', 
      name: 'editor', 
      component: NoteView, 
      meta: {auth: true}, 
    }

]


const router = createRouter({
    history: createWebHistory(), 
    routes
})

import { isAuth } from "./http"
import NoteView from "./views/NoteView.vue"

router.beforeEach((to, from, next) => {
  if (to.meta.auth === true && isAuth() == false) {
    next('/login')
  } else {
    next()
  }
})


export default router