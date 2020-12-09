import Vue from 'vue'
import VueRouter from 'vue-router'
const RoomsView = () => import ('../views/RoomsView.vue');
const AuthView = () => import('../views/AuthView.vue');
const UserProfileView = () => import('../views/UserProfileView.vue');
const CreateRoom = () => import('../views/CreateRoom.vue');
const UpdateRoom = () => import('../views/UpdateRoom.vue');
const ViewRoom = () => import('../views/ViewRoom.vue');
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
  },
  {
    path: '/create',
    name: 'createRoom',
    component: CreateRoom,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/update/:id',
    props: true,
    name: 'update',
    component: UpdateRoom,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/view/:id',
    props: true,
    name: 'view',
    component: ViewRoom,
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
