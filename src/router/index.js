import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import welcome from '@/components/welcome'
import admin_books from '@/components/adminBookView'
import admin_user from '@/components/adminUserView'
import home from '@/components/home'
import super_ from '@/components/superUser'
import digitizationPage from '@/components/digitizationPage'
import proof1 from '@/components/proof1Page'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      component: welcome,
      meta:{
        redirectToWelcome: true,
      }
    },
    {
      path: '/',
      component: welcome
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      meta:{
        requiresAuth: true
      }
    },
    {
      path: '/digitization',
      name: 'digitization',
      component: digitizationPage,
      props: true,
      meta:{
        requiresAuth: true
      }
    },
    {
      path: '/proof1',
      name: 'proof1',
      component: proof1,
      props: true,
      meta:{
        requiresAuth: true
      }
    },
    {
      path: '/admin/books',
      name: 'admin/books',
      component: admin_books,
      meta:{
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/admin/users',
      name: 'admin/users',
      component: admin_user,
      meta:{
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/super',
      name: 'super',
      component: super_,
      meta:{
        requiresAuth: true,
        requiresSuper: true
      }
    }
  ]
})

router.beforeEach((to, from, next)=>{
  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  let requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  let requiresSuper = to.matched.some(record => record.meta.requiresSuper);
  let redirectToWelcome = to.matched.some(record => record.meta.redirectToWelcome);

  if(redirectToWelcome)
    next('/')

  if(requiresAuth && !currentUser) next('/')
  else if(!requiresAuth && currentUser) next('home')
  else if(requiresAdmin&& !(localStorage._jpsarc_u=="mayank@hk.com"||localStorage._jpsarc_u=="shyamarasikadas@gmail.com")) {
    alert('Available only for Admin')
    next('/')
  }
  else if(requiresSuper && localStorage._jpsarc_u!="mayank@hk.com") {
    alert('Available only for Super User')
    next('/')
  }
  else next()
})
export default router