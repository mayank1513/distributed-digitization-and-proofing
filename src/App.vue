<template>
  <div id="app">
    <div id="header">
      <h1>JPS Archives Digitization</h1>
      <router-link to="../home" style="float:left; margin: -2px 15px"><button>Home</button></router-link>
      <div id="menu_right_btns">
        <router-link id="super" to="../super"><button>Super User</button></router-link>
        <router-link id="admin" to="../admin/books"><button>Manage Books</button></router-link>
        <router-link id="admin1" to="../admin/users"><button>Manage Users</button></router-link>
      </div>
        <button @click="signout" style="float:right; margin: -2px 10px">Logout</button>
      <p id="user_welcome"></p>
    </div>
    <router-view/>
    <div id="notificationTOast"></div>
  </div>
</template>

<script>
import firebase from 'firebase'
import { db } from './main'
export default {
  name: 'App',
  methods:{
        signout(){
            firebase.auth().signOut().then(()=>{
                localStorage._jpsarc_u = '';
                localStorage._jpsarc_uname = '';
                localStorage._jpsarc_uid = '';
                this.$router.replace('/');
            })
        },
    },
  mounted(){
    // var user = firebase.auth().currentUser;
        if(localStorage._jpsarc_uname==undefined){document.getElementById('user_welcome').innerHTML = ''}
        else if(localStorage._jpsarc_uname!=''){
            document.getElementById('user_welcome').innerHTML = 'Welcome ' + localStorage._jpsarc_uname 
        } else{
            document.getElementById('user_welcome').innerHTML = ''
        }
          if(localStorage._jpsarc_u != 'mayank@hk.com') document.getElementById('super').style.display = 'none'
          if(!(localStorage._jpsarc_u=="mayank@hk.com"||localStorage._jpsarc_u=="shyamarasikadas@gmail.com")){
            document.getElementById('admin').style.display = 'none'
            document.getElementById('admin1').style.display = 'none'
    }
  }
}
</script>

<style>
i{
  font-family: cursive;
}
h1,h2, u{
  margin: 0;
  color: blue;
}
u{
    cursor: pointer;
}
input{
  border: 1px solid gray;
  border-radius: 5px;
  text-align: center;
}
button{
    cursor: pointer;
  border: 1px solid gray;
  border-radius: 5px;
}
table{
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
    background-color: aliceblue
}

td, th {
    border: 1px solid #ddd;
    padding: 8px;
}
td{
    word-break: normal;
}

tr:nth-child(even){background-color: #f2f2f2;}

td:hover {background-color: rgb(255, 253, 253);}
button:hover {background-color: rgb(255, 253, 253);}
u:hover {background-color: rgb(255, 253, 253);}

th {
    padding-top: 5px;
    padding-bottom: 5px;
    text-align: center;
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
}

#header{
  position: absolute;
  text-align: center;
  top: 0; left: 0; right: 0;
  height: 60px;
  min-width: 500px;
  background-color: antiquewhite;
}
#menubar{
  text-align: right;
  position: absolute;
  top:35px; right: 0px; padding: 0 10px;
  background-color: antiquewhite;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 62px;
  overflow: auto;
}
#menu_right_btns{
    position: fixed;
    right: 70px;
    top: 35.6px
}
li{
    cursor: pointer;
    padding: 3px;
    padding-left: 0px; 
}
label{
    cursor: pointer;
}
#bookHolder, .details, .staticHead{
    position: absolute;
    left: 0;
    top:60px; 
    bottom: 0;
    width: 180px;
    text-align: left;
    font-weight: bold;
    background-color: gainsboro;
    overflow: auto;
}
.details, .staticHead{
    left: 0px; right: 0px; width: auto; bottom: 0px;
}
.staticHead{
    bottom: auto;
}
#book_stats{
    position: absolute;
    bottom: 0; left: 180px; height: 52px; right: 0;
}
#user_welcome{
    margin: 0;
    font-family: cursive;
}
/* The Modal (background) */
.modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    -webkit-animation-name: fadeIn; /* Fade in the background */
    -webkit-animation-duration: 0.4s;
    animation-name: fadeIn;
    animation-duration: 0.4s
}

/* Modal Content */
.modal-content {
    /* margin: 10% auto; */
    margin: 10% 25%;
    text-align: left;
    background-color: #fefefe;
    -webkit-animation-name: slideIn;
    -webkit-animation-duration: 0.4s;
    animation-name: slideIn;
    animation-duration: 0.4s;
    overflow: auto;
}
.modal-content-signup {
    /* margin: 10% auto; */
    margin: 100px auto;
    width: 320px;
    text-align: center;
    background-color: #fefefe;
    -webkit-animation-name: slideIn;
    -webkit-animation-duration: 0.4s;
    animation-name: slideIn;
    animation-duration: 0.4s;
    overflow: auto;
}

/* The Close Button */
.close {
    color: greenyellow;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: red;
    text-decoration: none;
    cursor: pointer;
}

.modal-header {
    text-align: center;
    padding: 2px;
    background-color: #f8f3f1;
    color: white;
}

.modal-body {padding: 2px }
.modal-body input{
  /* width: 80%; */
  margin: 5px}
.modal-footer {
    padding: 2px;
    background-color: #5cb85c;
    color: white;
}
.loader {
    position: absolute;
    margin: 7% 43%;
  border: 6px solid #f3f3f3;
  border-radius: 50%;
  border-top: 6px solid #3498db;
  height: 140px;
  width: 140px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Add Animation */
@-webkit-keyframes slideIn {
    from {bottom: -300px; opacity: 0} 
    to {bottom: 0; opacity: 1}
}

@keyframes slideIn {
    from {bottom: -300px; opacity: 0}
    to {bottom: 0; opacity: 1}
}

@-webkit-keyframes fadeIn {
    from {opacity: 0} 
    to {opacity: 1}
}

@keyframes fadeIn {
    from {opacity: 0} 
    to {opacity: 1}
}

</style>
