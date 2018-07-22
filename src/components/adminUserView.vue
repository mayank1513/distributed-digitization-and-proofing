<template>
    <div>
        <div class="details">
        <table id="userTable">
            <thead>
                <th rowspan="2" style="cursor: default;"></th>
                <th rowspan="2" style="cursor: default;"></th>
                <th colspan="3" style="cursor: default;">Permissions</th>
                <th colspan="2" style="cursor: default;">Digitization</th>
                <th colspan="2" style="cursor: default;">Proof Read Level 1</th>
                <th colspan="2" style="cursor: default;">Proof Read Level 2</th>
            </thead>
            <thead>
                <th>Name</th>
                <th>Email</th>
                <th>Digitization</th>
                <th>Proof Level_1</th>
                <th>Proof Level_2</th>
                
                <th>Debounced Tasks</th>
                <th>Completed Tasks</th>
                
                <th>Debounced Tasks</th>
                <th>Completed Tasks</th>
                
                <th>Debounced Tasks</th>
                <th>Completed Tasks</th>
            </thead>
            <tbody id="tbody">
                <tr v-for="user in users">
                    <td>{{user.name}}</td>
                    <td>{{user.email}}</td>
                    <td style="text-align: center; cursor: pointer" @click="toggleDigitization(user)">
                        <input type="checkbox" v-model="user.allowDigitization">
                    </td>
                    <td style="text-align: center; cursor: pointer" @click="toggleProof1(user)">
                        <input type="checkbox" v-model="user.allowProof1">
                    </td>
                    <td style="text-align: center; cursor: pointer" @click="toggleProof2(user)">
                        <input type="checkbox" v-model="user.allowProof2">
                    </td>
                    <td>{{user.digitizationTasksDebounced}}</td>
                    <td>{{user.digitizationTasksCompleted}}</td>
                    <td>{{user.proof1TasksDebounced}}</td>
                    <td>{{user.proof1TasksCompleted}}</td>
                    <td>{{user.proof2TasksDebounced}}</td>
                    <td>{{user.proof2TasksCompleted}}</td>
                </tr>
            </tbody>
        </table>
        </div>
        <!-- <div class="staticHead">
            <table>
            <thead>
            
                <th rowspan="2" ></th>
                <th rowspan="2" ></th>
                <th colspan="3">Permissions</th>
                <th colspan="3">Digitization</th>
                <th colspan="3">Proof Read Level 1</th>
                <th colspan="3">Proof Read Level 2</th>
            </thead>
            <thead>
                <th>Name</th>
                <th>Email</th>
                <th>Digitization</th>
                <th>Proof Level_1</th>
                <th>Proof Level_2</th>
                
                <th>Current_Task</th>
                <th>Debounced Tasks</th>
                <th>Completed Tasks</th>
                
                <th>Current_Task</th>
                <th>Debounced Tasks</th>
                <th>Completed Tasks</th>
                
                <th>Current_Task</th>
                <th>Debounced Tasks</th>
                <th>Completed Tasks</th></thead>
            </table>
        </div> -->
    </div>
</template>

<script>
import bootstrap from '@/bootstrap'
import firebase from 'firebase'
import {db} from '../main'
export default {
    name: 'admin_user',
    data(){
        return{
            users:[]
        }
    },
    firestore () {
        return {
            users: db.collection('Users')
        }
    },
    methods:{
        sortTable(a, b){
            bootstrap.sortTable(a,b);
        },
        toggleDigitization(user){
            user.allowDigitization = !user.allowDigitization
            db.collection('Users').doc(user.id).update({allowDigitization: user.allowDigitization})
        },
        toggleProof1(user){
            user.allowProof1 = !user.allowProof1
            db.collection('Users').doc(user.id).update({allowProof1: user.allowProof1})
        },
        toggleProof2(user){
            user.allowProof2 = !user.allowProof2
            db.collection('Users').doc(user.id).update({allowProof2: user.allowProof2})
        },
    }
}
</script>

<style>

</style>
