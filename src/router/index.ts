import { createRouter, createWebHistory } from 'vue-router'
import DeviceListView from '@/views/device/DeviceListView.vue'
import DataListView from '@/views/data/DataListView.vue'
import PasswordView from '@/views/user/PasswordView.vue'
import UserListView from '@/views/user/UserListView.vue'
import LoginView from '../views/user/LoginView.vue'
import InfoView from '@/views/user/InfoView.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: LoginView },
    {
      path: '/home',
      name: 'Home',
      component: HomeView,
      children: [
        {
          path: '/info',
          name: 'Info',
          component: InfoView,
        },
        {
          path: '/user/list',
          name: 'UserList',
          component: UserListView,
        },
        {
          path: '/password',
          name: 'Password',
          component: PasswordView,
        },
        {
          path: '/device/list',
          name: 'DeviceList',
          component: DeviceListView,
        },
        {
          path: '/data/list',
          name: 'DataList',
          component: DataListView,
        },
      ],
    },
  ],
})

export default router
