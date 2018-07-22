<template>
    <div>
        <div id="menubar">
            <input v-model="email" type="email" placeholder="Email">
            <input v-model="password" type="password" placeholder="password"> 
            <button @click="signin" id="signin">Sign In</button>
            <u @click="showModal('signUp')">Register</u>
        </div>
        <iframe id="jps_site" src="http://jpsarchives.net/" frameborder="0"></iframe>
        <!-- The Modal -->
        <div id="signUp" class="modal">
            <!-- Modal content -->
            <div class="modal-content-signup">
                <div class="modal-header">
                <span class="close" @click="hideModal('signUp')">&times;</span>
                <h2>Create new Account</h2>
                </div>
                <div class="modal-body">
                    <input v-model="name" type="text" placeholder="Name"> <br>
                    <input type="email" v-model="email" placeholder="email"> <br>
                    <input type="password" v-model="password" placeholder="password"> <br>
                    <input type="password" v-model="password_" placeholder="re-enter password"> <br>
                    <button @click="signup">Create Account</button> 
                    <!-- <u>Sign up with google</u> -->
                </div>
            </div>
        </div>
        <div id="signIn" class="modal">
            <!-- Modal content -->
            <div class="modal-content-signup">
                <div class="modal-header">
                <span class="close" @click="hideModal('signIn')">&times;</span>
                <h2>Sign In</h2>
                </div>
                <div class="modal-body">
                    <input type="email" v-model="email" placeholder="email"> <br>
                    <input type="password" v-model="password" placeholder="password"> <br>
                    <button @click="signin">Sign In</button> <br>
                    Forgot password? <u @click="passwordReset">reset password</u>
                    <p id="error"></p>
                    <!-- <u>Sign up with google</u> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import bootstrap from '@/bootstrap'
import firebase from 'firebase'
import {db} from '../main'
export default {
    name: 'welcome',
    data(){
    return{
      name: '',
      email: '',
      password: '',
      password_: '',
    }
  },
  mounted(){
      localStorage._jpsarc_uname = ''
      document.getElementById('jps_site').style.height = (window.innerHeight - 60) + 'px'
      window.onresize = function(){
          document.getElementById('jps_site').style.height = (window.innerHeight - 60) + 'px'
      }
  },
    methods:{
        hideModal(modalId){
            document.getElementById(modalId).style.display = 'none';
        },
        showModal(modalId){
            document.getElementById(modalId).style.display = 'inline';
            window.onclick = function(e){
                if(e.target==document.getElementById(modalId))
                    document.getElementById(modalId).style.display = 'none';
            }
        },
        passwordReset(){
            var email = prompt('Please enter email address', this.email);
            var showModal = this.showModal;
            firebase.auth().sendPasswordResetEmail(email).then(function(){
                document.getElementById('error').innerHTML = 'please check your emal for instructions to reset password'
                document.getElementById('error').style.backgroundColor = 'green'
            }).catch(function(error){
                console.log(error)
                showModal('signIn')
                document.getElementById('error').innerHTML = error.message
            })
        },
      signin(){
        var loader = document.createElement('div');
        var showModal = this.showModal;
        var email = this.email;
        loader.className = 'loader'
        document.body.appendChild(loader);
        firebase.auth().signInWithEmailAndPassword(this.email,this.password).then(
            (user)=>{
                document.body.removeChild(document.querySelector('.loader'))
                db.collection('Users').doc(user.user.uid).update({lastLogin: new Date()});
                if(user.user.emailVerified||user.user.email=='mayank@hk.com'){
                    localStorage._jpsarc_u = email;
                    bootstrap.updateUserInfo();
                    localStorage._jpsarc_uid = user.user.uid;
                    this.$router.replace('home');
                } else{
                    var x = prompt('Email not varified\n\nResend varification code', email)
                       if(x!=null){
                           user.user.sendEmailVerification().then(function(){
                               alert('Varification emial sent')
                               firebase.auth().signOut()
                           });
                       }
                }
            },
            function(err){
                document.body.removeChild(document.querySelector('.loader'));
                document.getElementById('error').innerHTML = err.message;
                showModal('signIn');
                setTimeout(function(){
                    document.getElementById('error').innerHTML = ''
                }, 5000)
                // alert(err.message);
            }
          )
        },
        signup(){
            if(this.password!=this.password_){
              alert('password do not match!\n Please try again')
              return;
            }
          var loader = document.createElement('div');
          loader.className = 'loader'
          document.body.appendChild(loader);
            var name = this.name;
            var email = this.email;
            var password = this.password;
            firebase.auth().createUserWithEmailAndPassword(email,password).then(
                (user)=>{
                    document.body.removeChild(document.querySelector('.loader'))
                    var createdAt = new Date()
                    db.collection('Users').doc(user.user.uid).set({
                        email:email, name: name, createdAt:createdAt, lastLogin:'',
                        allowDigitization: true, allowProof1: false, allowProof2: false, 
                        currentTask_type: '', currentTask_book: '', currentTask_page:'',
                        digitizationTasksCompleted:0, digitizationTasksDebounced:0,
                        proof1TasksCompleted:0, proof1TasksDebounced:0,
                        proof2TasksCompleted:0, proof2TasksDebounced:0,
                    })
                    user.user.updateProfile({displayName: name})
                    user.user.sendEmailVerification().then(function(){
                        alert('Account Created!\n\nThank you for volunteering for JPS Archives\n\nPlease verify your email address by following instructions in the varification email sent to you.')
                        firebase.auth().signOut()
                    })
                },
                function(err){
                    document.body.removeChild(document.querySelector('.loader'))
                    alert(err.message)
                }
            )
        },
    }
}
</script>

<style>
iframe{
    position: fixed;
    top: 60px; bottom: 0px; left: 0px; right: 0px;
    width: 100%;
}
#error{
    background-color: red;
    color: aliceblue
}
</style>
