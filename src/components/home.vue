<template>
    <div style="text-align: center; overflow: auto;">
        <!-- menu 'home' 'Jump To' 'digitization page' -->

        <!-- debounced tasks -->
        <div class="details" id="details1">
        <!-- current task -->
            <table id="currentTasks">
                <thead>
                    <th colspan="8">Current Tasks</th>
                </thead>
                <thead>
                    <th></th>
                    <th>Book Name</th>
                    <th>Page Number</th>
                </thead>
                <tbody>
                    <tr @click="goToCurrentTask()">
                        <td id="currentTaskType"></td>
                        <td id="currentTaskBook"></td>
                        <td id="currentTaskpage"></td>
                    </tr>
                </tbody>
            </table>
            <table id="digitizationTasks">
                <thead>
                    <th colspan="8">Digitization Tasks</th>
                </thead>
                <thead>
                    <th @click="sortTable('digitizationTasks',0)">Book Name</th>
                    <th @click="sortTable('digitizationTasks',1)">Totoal Pages</th>
                    <th @click="sortTable('digitizationTasks',2)">Pages Available</th>
                    <th @click="sortTable('digitizationTasks',3)">Pages In Process</th>
                    <th @click="sortTable('digitizationTasks',4)">Pages Completed</th>
                </thead>
                <tbody>
                    <tr v-for="book in booksForDigitization" @click="goToDigitizationPage(book)">
                        <td>{{book.id}}</td>
                        <td>{{book.no_of_pages}}</td>
                        <td>{{book.digitization_pagesAvailable}}</td>
                        <td>{{book.digitization_pagesInProcess}}</td>
                        <td>{{book.digitization_pagesCompleted}}</td>
                    </tr>
                </tbody>
            </table>
            
            <table id="proof1Tasks">
                <thead>
                    <th colspan="9">Proof Reading Level 1 Tasks</th>
                </thead>
                <thead>
                    <th @click="sortTable('proof1Tasks',0)">Book Name</th>
                    <th @click="sortTable('proof1Tasks',1)">Totoal Pages</th>
                    <th @click="sortTable('proof1Tasks',2)">Pages Available</th>
                    <th @click="sortTable('proof1Tasks',3)">Pages In Process</th>
                    <th @click="sortTable('proof1Tasks',4)">Pages Completed</th>
                </thead>
                <tbody>
                    <tr v-for="book in booksForProof1" @click="goToProof1Page(book)">
                        <td>{{book.id}}</td>
                        <td>{{book.no_of_pages}}</td>
                        <td>{{book.proof1_pagesAvailable}}</td>
                        <td>{{book.proof1_pagesInProcess}}</td>
                        <td>{{book.proof1_pagesCompleted}}</td>
                    </tr>
                </tbody>
            </table>
            
            <table id="proof2Tasks">
                <thead>
                    <th colspan="9">Proof Reading Level 2 Tasks</th>
                </thead>
                <thead>
                    <th @click="sortTable('proof2Tasks',0)">Book Name</th>
                    <th @click="sortTable('proof2Tasks',1)">Totoal Pages</th>
                    <th @click="sortTable('proof2Tasks',2)">Pages Available</th>
                    <th @click="sortTable('proof2Tasks',3)">Pages In Process</th>
                    <th @click="sortTable('proof2Tasks',4)">Pages Completed</th>
                </thead>
                <tbody>
                    <tr v-for="book in booksForProof2" @click="goToProof2Page(book)">
                        <td>{{book.id}}</td>
                        <td>{{book.no_of_pages}}</td>
                        <td>{{book.proof2_pagesAvailable}}</td>
                        <td>{{book.proof2_pagesInProcess}}</td>
                        <td>{{book.proof2_pagesCompleted}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import bootstrap from '@/bootstrap'
import firebase from 'firebase'
import { db } from '../main';
import router from '../router';
export default {
    name: 'home',
    firestore () {
        return {
            books: db.collection('Books'),
        }
    },
    mounted(){
        bootstrap.updateUserInfo();
        if(localStorage._jpsarc_u_currentTask_page==""){
            document.getElementById('currentTasks').style.display = 'none'
        } else{
            document.getElementById('currentTaskType').innerHTML = localStorage._jpsarc_u_currentTask_type
            document.getElementById('currentTaskBook').innerHTML = localStorage._jpsarc_u_currentTask_book
            document.getElementById('currentTaskPage').innerHTML = localStorage._jpsarc_u_currentTask_page
        }
        if(localStorage._jpsarc_u_allowDigitization=="false"){
            document.getElementById('digitizationTasks').style.display = 'none'
        }
        if(localStorage._jpsarc_u_allowProof1=="false"){
            document.getElementById('proof1Tasks').style.display = 'none'
        }
        if(localStorage._jpsarc_u_allowProof2=="false"){
            document.getElementById('proof2Tasks').style.display = 'none'
        }
    },
    data(){
        return{
            books: [],
            user:{}
        }
    },
    computed:{
        booksForDigitization(){
            var b = [];
            this.books.forEach(book=>{
                if(book.showInDigitization && book.digitization_pagesAvailable)
                    b.push(book);
            });
            return b;
        },
        booksForProof1(){
            var b = [];
            this.books.forEach(book=>{
                if(book.showInProof1 && book.proof1_pagesAvailable)
                    b.push(book);
            });
            return b;
        },
        booksForProof2(){
            var b = [];
            this.books.forEach(book=>{
                if(book.showInProof2 && book.proof2_pagesAvailable)
                    b.push(book);
            });
            return b;
        },
    },
    methods:{
        goToCurrentTask(){
            if(localStorage._jpsarc_u_currentTask_type=='digitization'){
                db.collection('Books').doc(localStorage._jpsarc_u_currentTask_book).get().then(function(doc){
                    sessionStorage.digitization_pagesInProcess = (parseInt(book.digitization_pagesInProcess));
                    sessionStorage.digitization_pagesCompleted = parseInt(book.digitization_pagesCompleted);
                    sessionStorage.proof1_pagesAvailable = parseInt(book.proof1_pagesAvailable);
                })
                db.collection(localStorage._jpsarc_u_currentTask_book).doc(localStorage._jpsarc_u_currentTask_page)
                .get().then(function(doc){
                    localStorage._jpsarc_img = doc.data().src;
                    router.replace('digitization');
                })
            } else if(localStorage._jpsarc_u_currentTask_type=='proof1'){
                db.collection('Books').doc(localStorage._jpsarc_u_currentTask_book).get().then(function(doc){
                    sessionStorage.proof1_pagesInProcess = (parseInt(book.proof1_pagesInProcess));
                    sessionStorage.proof1_pagesCompleted = parseInt(book.proof1_pagesCompleted);
                    sessionStorage.proof2_pagesAvailable = parseInt(book.proof2_pagesAvailable);
                })
                db.collection(localStorage._jpsarc_u_currentTask_book).doc(localStorage._jpsarc_u_currentTask_page)
                .get().then(function(doc){
                    localStorage._jpsarc_img = doc.data().src;
                    router.replace('proof1');
                })
            }
        },
        goToDigitizationPage(book){
            var router = this.$router;
            if(localStorage._jpsarc_u_currentTask_page != ''){
                alert('Please complete active task first before moving to next task')
                return
            }
            db.collection(book.id).get().then(function(query){
                var Break = false
                query.forEach(function(page){
                    if(Break) return
                    if(page.exists && page.data().digitization_volunteerName==""){
                        // route to digitization page and return
                        Break = true;
                        localStorage._jpsarc_img = page.data().src;
                        db.collection(book.id).doc(page.id).update({
                            digitization_volunteerName: localStorage._jpsarc_uid,
                            digitization_startedOn: new Date()
                        })
                        db.collection('Books').doc(book.id).update({
                            digitization_pagesAvailable: (parseInt(book.digitization_pagesAvailable)-1),
                            digitization_pagesInProcess: (parseInt(book.digitization_pagesInProcess)+1),
                        })
                        db.collection('Users').doc(localStorage._jpsarc_uid).update({
                            currentTask_type: 'digitization', currentTask_book: book.id, currentTask_page: page.id
                        })
                        localStorage._jpsarc_u_currentTask_type = 'digitization';
                        localStorage._jpsarc_u_currentTask_book = book.id;
                        localStorage._jpsarc_u_currentTask_page = page.id;
                        sessionStorage.digitization_pagesInProcess = (parseInt(book.digitization_pagesInProcess)+1);
                        sessionStorage.digitization_pagesCompleted = parseInt(book.digitization_pagesCompleted);
                        sessionStorage.proof1_pagesAvailable = parseInt(book.proof1_pagesAvailable);
                        router.replace('digitization')
                    }
                })
            })
        },
        goToProof1Page(book){
            var router = this.$router;
            if(localStorage._jpsarc_u_currentTask_page != ''){
                alert('Please complete active task first before moving to next task')
                return
            }
            db.collection(book.id).get().then(function(query){
                var Break = false
                query.forEach(function(page){
                    if(Break) return
                    if(page.exists && page.data().digitization_completedOn!='' 
                        && page.data().proof1_volunteerName==""){
                        // route to digitization page and return
                        Break = true;
                        localStorage._jpsarc_img = page.data().src;
                        db.collection(book.id).doc(page.id).update({
                            proof1_volunteerName: localStorage._jpsarc_uid,
                            proof1_startedOn: new Date()
                        })
                        db.collection('Books').doc(book.id).update({
                            proof1_pagesAvailable: (book.proof1_pagesAvailable-1),
                            proof1_pagesInProcess: (parseInt(book.proof1_pagesInProcess)+1),
                        })
                        db.collection('Users').doc(localStorage._jpsarc_uid).update({
                            currentTask_type: 'proof1', currentTask_book: book.id, currentTask_page: page.id
                        })
                        localStorage._jpsarc_u_currentTask_type = 'proof1';
                        localStorage._jpsarc_u_currentTask_book = book.id;
                        localStorage._jpsarc_u_currentTask_page = page.id;
                        sessionStorage.proof1_pagesInProcess = (parseInt(book.proof1_pagesInProcess)+1);
                        sessionStorage.proof1_pagesCompleted = parseInt(book.proof1_pagesCompleted);
                        sessionStorage.proof2_pagesAvailable = parseInt(book.proof2_pagesAvailable);
                        router.replace('proof1')
                    }
                })
            })
        },
        goToProof2Page(book){

        },
        sortTable(a,b){
            bootstrap.sortTable(a,b);
        }
    }
}
</script>

<style>
#digitizationTasks tr:hover, #proof1Tasks tr:hover, #proof2Tasks tr:hover, #currentTasks tr:hover{
    background-color: white;
    cursor: pointer;
}

#digitizationTasks, #proof1Tasks, #proof2Tasks, #currentTasks{
    margin: 5px 10%;
    width: 80%
}
#details1, #staticHead{
    left: 0px; right: 0px; width: auto; bottom: 0px;
}
#staticHead{
    bottom: auto;
}
</style>
