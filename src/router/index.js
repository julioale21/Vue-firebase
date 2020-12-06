import Vue from 'vue'
import VueRouter from 'vue-router'
import RoomsView from '../views/RoomsView.vue';
import AuthView from '../views/AuthView.vue';
import UserProfileView from '../views/UserProfileView.vue';
import store from '../store';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'rooms',
    component: RoomsView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView
  },
  {
    path: '/profile',
    name: 'profile',
    component: UserProfileView,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

router.beforeEach( async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if(requiresAuth && !(await store.dispatch('user/getCurrentUser'))) {
    next({ name: 'auth'})
  } else if (!requiresAuth && (await store.dispatch('user/getCurrentUser'))) {
    next({ name: 'rooms'})
  } else {
    next()
  }
}) 

export default router
