import Vue from 'vue'
import VueRouter from 'vue-router'
import UserProfile from '../components/UserProfile.vue'
import Chart from '../components/Chart.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

export function createRouter () {
  return new VueRouter({
    routes: [
      { path: '/home', component: Home },
      { path: '/user/profile', component: UserProfile },
      { path: '/stock/:ticker/chart/', name: 'chart', component: Chart, props: true },
      { path: '/', redirect: '/home' },
      { path: '*', redirect: '/home' }
    ]
  })
}
