// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import config from './config'
import firebase from 'firebase'
import VueFire from 'vuefire'
import 'firebase/firestore'

firebase.initializeApp(config.config);
Vue.config.productionTip = false

Vue.use(VueFire)
export const db = firebase.firestore()

firebase.auth().onAuthStateChanged(function(user){
  if(!app){
    var app = new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    })
  }
})

