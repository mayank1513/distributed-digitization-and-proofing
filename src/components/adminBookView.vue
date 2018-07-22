<template>
    <div>
        <article id="bookHolder">
            <ol id="bookHolder_">
                <li v-for="book in books" @click="updateTableData('myTable', book)">{{book.id}}</li>
            </ol>
            <u @click="showModal('addBook')" style="margin:20px">Add New Book</u>
        </article>
        <div id="details" class="details">
        <table id="myTable">
            <thead>
                <th rowspan="2" style="cursor: default;"></th>
                <th colspan="3" style="cursor: default;">Digitization</th>
                <th colspan="3" style="cursor: default;">Proof Read Level 1</th>
                <th colspan="3" style="cursor: default;">Proof Read Level 2</th>
            </thead>
            <thead>
                <th @click="sortTable('myTable',0)">Page No.</th>
                <th @click="sortTable('myTable',1)">Volunteer Name</th>
                <th @click="sortTable('myTable',2)">Started On</th>
                <th @click="sortTable('myTable',3)">Completed On</th>
                <th @click="sortTable('myTable',4)">Volunteer Name</th>
                <th @click="sortTable('myTable',5)">Started On</th>
                <th @click="sortTable('myTable',6)">Completed On</th>
                <th @click="sortTable('myTable',7)">Volunteer Name</th>
                <th @click="sortTable('myTable',8)">Started On</th>
                <th @click="sortTable('myTable',9)">Completed On</th>
            </thead>
            <tbody id="tbody">
                <tr>
                    <td colspan="15">Click on book name on left side to see details</td>
                </tr>
            </tbody>
        </table>
        </div>
        <!-- <div id="staticHead" class="staticHead">
            <table>
            <thead>
                <th rowspan="2" ></th>
                <th colspan="3" style="cursor: default;">Digitization</th>
                <th colspan="3" style="cursor: default;">Proof Read Level 1</th>
                <th colspan="3" style="cursor: default;">Proof Read Level 2</th>
            </thead>
            <thead>
                <th @click="sortTable('myTable',0)">Page No.</th>
                <th @click="sortTable('myTable',1)">Volunteer Name</th>
                <th @click="sortTable('myTable',2)">Started On</th>
                <th @click="sortTable('myTable',3)">Completed On</th>
                <th @click="sortTable('myTable',4)">Volunteer Name</th>
                <th @click="sortTable('myTable',5)">Started On</th>
                <th @click="sortTable('myTable',6)">Completed On</th>
                <th @click="sortTable('myTable',7)">Volunteer Name</th>
                <th @click="sortTable('myTable',8)">Started On</th>
                <th @click="sortTable('myTable',9)">Completed On</th>
            </thead>
            </table>
        </div> -->
        <div id="book_stats">
            <table>
                <th style="cursor: default">
            <label for="digitization">Show in Digitization Tasks</label>
            <input id="digitization" type="checkbox" v-model="showInDigitization" @click="toggle_digitization"> <br>
            <p id="digitization_progress" class="progress_"></p>
                </th>
                <th style="cursor: default">
            <label for="proof1">Show in Proofing Level 1 Tasks</label>
            <input id="proof1" type="checkbox" v-model="showInProof1" @click="toggle_proof1"> <br>
            <p id="proof1_progress" class="progress_"></p>
                </th>
                <th style="cursor: default">
            <label for="proof2">Show in Proofing Level 2 Tasks</label>
            <input id="proof2" v-model="showInProof2" type="checkbox" @click="toggle_proof2"> <br>
            <p id="proof2_progress" class="progress_"></p>            
                </th>
            </table>
        </div>
        <!-- The Modal -->
        <div id="addBook" class="modal">
            <!-- Modal content -->
            <div class="modal-content">
                <div class="modal-header">
                <span class="close" @click="hideModal('addBook')">&times;</span>
                <h2>Add New Book</h2>
                </div>
                <div class="modal-body">
                    Please follow these steps...
                    <ol>
                        <li>Save book pages in a valid image format.</li>
                        <li>Name of file should be page number. e.g. 1.jpg, 2.jpg, ..</li>
                        <li>Place all pages in a folder.</li>
                        <li>Enter the name of the book in the book name field</li>
                        <li>You can either drag and drop the folder or browse it by clicking on browse button.</li>
                    </ol>
                    <input v-model="newBookName" type="text" placeholder="Book Name">
                    <input id="files" type='file' webkitdirectory style="border:none">
                    <button @click="upload" style="border-radius:0">Upload</button>
                    <span id="uploadProgress"></span>
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
    name:'admin_books',
    props: ['book'],
    data(){
        return{
            books:[],
            showInDigitization: false,
            showInProof1: false,
            showInProof2: false,
            selectedBook: {},
            sort_asc: true,
            newBookName:'',
            user:[],
        }
    },
    firestore () {
        return {
            // dgitizationProjs: db.collection('digitizationProjects').orderBy('BookName'),
            books: db.collection('Books'),
            user: db.collection('Users')
        }
    },
    mounted(){
        // 
        File.prototype.convertToBase64 = function(callback, bookName, i){
            var FR= new FileReader();
            FR.onload = function(e) {
                callback(e.target.result, bookName, i)
            };       
            FR.readAsDataURL(this);
        }
    },
    methods:{
        sortTable(a, b){
            bootstrap.sortTable(a,b);
        },
        updateTableData(tableId, book){
            this.selectedBook = book;
            var indx = this.books.indexOf(book)
            var booksDiv = document.getElementById('bookHolder_')
            for(var i = 0; i<booksDiv.childElementCount; i++){
                if(i==indx){
                    booksDiv.children[i].setAttribute('style', "background-color: white")
                }else{
                    booksDiv.children[i].setAttribute('style', "background-color: gainsboro")
                }
            }
            // 
            var table = document.getElementById(tableId);
            table.removeChild(document.getElementById('tbody'));
            var tbody = document.createElement('tbody');
            tbody.id = 'tbody'
            var user = this.user; 
            var tthis = this;
            var pages = db.collection(book.id).get().then(function(querySnapshot){
                querySnapshot.forEach(function(page){
                    var tr = document.createElement('tr');
                    tr.innerHTML = '<td><a href = '+ page.data().src + ' target="_blank">' + page.id + '</a></td>'

                    var name = page.data().digitization_volunteerName;
                    user.forEach(function(u){
                        if(name == u.id)
                            name = u.name;
                    })

                    tr.innerHTML += '<td>' + name + '</td>'

                    if(page.data().digitization_startedOn!=''){
                        var td = document.createElement('td');
                        td.innerHTML = page.data().digitization_startedOn.toLocaleString() + '<br>';
                        var u = document.createElement('u');
                        u.innerHTML = '<small>inspect</small>';
                        u.addEventListener('click', function(){
                            console.log(page)
                        })
                        td.appendChild(u);
                        tr.appendChild(td);
                    } else{
                        tr.innerHTML += '<td></td>'
                    }

                    if(page.data().digitization_completedOn!=''){
                        var td = document.createElement('td');
                        td.innerHTML = page.data().digitization_completedOn.toLocaleString() + '<br>';
                        var u = document.createElement('u');
                        u.innerHTML = '<small>inspect</small>';
                        // u.onclick = tthis.inspectDigitization(page);
                        td.appendChild(u);
                        tr.appendChild(td);
                    } else{
                        tr.innerHTML += '<td></td>'
                    }

                    var name = page.data().proof1_volunteerName;
                    user.forEach(function(u){
                        if(name == u.id)
                            name = u.name;
                    })
                    tr.innerHTML += '<td>' + name + '</td>'
                    
                    if(page.data().proof1_startedOn!=''){
                        var td = document.createElement('td');
                        td.innerHTML = page.data().proof1_startedOn.toLocaleString() + '<br>';
                        var u = document.createElement('u');
                        u.innerHTML = '<small>inspect</small>';
                        u.onclick = tthis.inspectProof1(page);
                        td.appendChild(u);
                        tr.appendChild(td);
                    } else{
                        tr.innerHTML += '<td></td>'
                    }

                    if(page.data().proof1_completedOn!=''){
                        var td = document.createElement('td');
                        td.innerHTML = page.data().proof1_completedOn.toLocaleString() + '<br>';
                        var u = document.createElement('u');
                        u.innerHTML = '<small>inspect</small>';
                        u.onclick = tthis.inspectProof1(page);
                        td.appendChild(u);
                        tr.appendChild(td);
                    } else{
                        tr.innerHTML += '<td></td>'
                    }

                    var name = page.data().proof2_volunteerName;
                    user.forEach(function(u){
                        if(name == u.id)
                            name = u.name;
                    })
                    tr.innerHTML += '<td>' + name + '</td>'
                    
                    if(page.data().proof2_startedOn!=''){
                        var td = document.createElement('td');
                        td.innerHTML = page.data().proof2_startedOn.toLocaleString() + '<br>';
                        var u = document.createElement('u');
                        u.innerHTML = '<small>inspect</small>';
                        u.onclick = tthis.inspectProof2(page);
                        td.appendChild(u);
                        tr.appendChild(td);
                    } else{
                        tr.innerHTML += '<td></td>'
                    }

                    if(page.data().proof2_completedOn!=''){
                        var td = document.createElement('td');
                        td.innerHTML = page.data().proof2_completedOn.toLocaleString() + '<br>';
                        var u = document.createElement('u');
                        u.innerHTML = '<small>inspect</small>';
                        u.onclick = tthis.inspectProof2(page);
                        td.appendChild(u);
                        tr.appendChild(td);
                    } else{
                        tr.innerHTML += '<td></td>'
                    }
                    
                    tbody.appendChild(tr);
                })
                table.appendChild(tbody);
            })
            
            this.showInDigitization = book.showInDigitization;
            this.showInProof1 = book.showInProof1;
            this.showInProof2 = book.showInProof2;
            
            document.getElementById('digitization_progress').innerHTML = book.digitization_pagesAvailable + ' pages available | '
                + book.digitization_pagesInProcess + ' pages in process | ' + book.digitization_pagesCompleted + ' pages completed'

            document.getElementById('proof1_progress').innerHTML = book.proof1_pagesAvailable + ' pages available | '
                + book.proof1_pagesInProcess + ' pages in process | ' + book.proof1_pagesCompleted + ' pages completed'
            
            document.getElementById('proof2_progress').innerHTML = book.proof2_pagesAvailable + ' pages available | '
                + book.proof2_pagesInProcess + ' pages in process | ' + book.proof2_pagesCompleted + ' pages completed'
        },
        showModal(modalId){
            document.getElementById(modalId).style.display = 'inline';
            window.onclick = function(e){
                if(e.target==document.getElementById(modalId))
                    document.getElementById(modalId).style.display = 'none';
            }
        },
        hideModal(modalId){
            document.getElementById(modalId).style.display = 'none';
            document.getElementById('uploadProgress').style.display = 'none';
        },
        toggle_digitization(){
            this.selectedBook.showInDigitization = !this.selectedBook.showInDigitization;
            var showInDigitization = this.selectedBook.showInDigitization;
            db.collection('Books').doc(this.selectedBook.id).update({showInDigitization: showInDigitization})
        },
        toggle_proof1(){
            this.selectedBook.showInProof1 = !this.selectedBook.showInProof1;
            var showInProof1 = this.selectedBook.showInProof1;
            db.collection('Books').doc(this.selectedBook.id).update({showInProof1: showInProof1})
        },
        toggle_proof2(){
            this.selectedBook.showInProof2 = !this.selectedBook.showInProof2;
            var showInProof2 = this.selectedBook.showInProof2;
            db.collection('Books').doc(this.selectedBook.id).update({showInProof2: showInProof2})
        },
        inspectDigitization(page){
            var isAdmin = true;
            localStorage._jpsarc_img = page.src;
            console.log(page.src)
            sessionStorage.digitization_pagesInProcess = (parseInt(this.selectedBook.digitization_pagesInProcess)+1);
            sessionStorage.digitization_pagesCompleted = parseInt(this.selectedBook.digitization_pagesCompleted);
            sessionStorage.proof1_pagesAvailable = parseInt(this.selectedBook.proof1_pagesAvailable);
            this.$router.replace({name:'digitization', params:{isAdmin}});
        },
        inspectProof1(page){

        },
        inspectProof2(page){

        },
        upload(){
            if(this.newBookName==''){
                alert('please enter book name');
                return;
            }
            var bookExists = false;
            var newBook = this.newBookName;
            this.books.forEach(function(book){
                if(newBook==book.id){
                    bookExists = true;
                }
            })
            if(bookExists){
                alert('Book with same name already exists in database. Please try again');
                return;
            }

            var bookName = this.newBookName;
            var files = document.getElementById('files').files;
            var progressBar = document.getElementById('uploadProgress')
            progressBar.style.display = 'inline';
            progressBar.setAttribute('max', files.length, 'value', 0)
            // Create a root reference
            var storageRef = firebase.storage().ref();
            
            db.collection('Books').doc(bookName).set({
                no_of_pages: files.length,
                showInDigitization: true,
                showInProof1: false,
                showInProof2: false,
                
                digitization_pagesAvailable: files.length,
                digitization_pagesInProcess: 0,
                digitization_pagesCompleted: 0,
                
                proof1_pagesAvailable: 0,
                proof1_pagesInProcess: 0,
                proof1_pagesCompleted: 0,
                
                proof2_pagesAvailable: 0,
                proof2_pagesInProcess: 0,
                proof2_pagesCompleted: 0,
            })

            function upload_(file, i){
                var ref = storageRef.child(bookName + '/' + files[i].name)
                ref.put(files[i]).then(function(snapshot) {
                    ref.getDownloadURL().then(function(url){
                        console.log('Uploaded a blob or file!');
                        db.collection(bookName).doc(i+'').set({
                            src: url,
                            digitization_volunteerName: '',
                            digitization_startedOn: '',
                            digitization_lastSavedOn: '',
                            digitization_completedOn: '',
                            
                            proof1_volunteerName: '',
                            proof1_startedOn: '',
                            proof1_lastSavedOn:'',
                            proof1_completedOn: '',

                            proof2_volunteerName: '',
                            proof2_startedOn: '',
                            proof2_lastSavedOn:'',
                            proof2_completedOn: '',
                            
                            digitization_content: '',
                            proof1_content: '',
                            proof2_content: ''
                        })
                    })
                });
                document.getElementById('uploadProgress').innerHTML = 'uploaded ' + (i+1) + ' of ' + files.length + ' files'
            }
            for(var i = 0; i<files.length; i++){
                upload_(files[i], i)
                // files[i].convertToBase64(callback, i);
            }
            this.newBookName = '';
            // hideModal('addBook')
        }
    }
}
</script>

<style>
.progress_{
    font-size: small;
    margin: 0;
}
#uploadProgress{
    display: none;
}
#details, #staticHead{
    left: 180px; right: 0px; width: auto; bottom: 48px;
}
#staticHead{
    bottom: auto;
}
#book_stats{
    background-color: #4CAF50;
    position: absolute;
    bottom: 0; left: 180px; height: 48px; right: 0;
}
</style>
