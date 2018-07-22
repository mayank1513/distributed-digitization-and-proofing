<template>
    <div>
        <div class="container">
            <div id="split1">
                <div id="reference">
                    <img id="img1" alt="page">
                    <input type="range" min="-2" max="2"
                    value="0" step="0.01" id="slider1">
                </div>
            </div>
            <div id="split2" style="left: 50.5%">
                <span id="digitizedContent"></span>
                <div id="proof1Content">
                    <vue-editor v-model="content"></vue-editor>
                    <div id="buttonsContainer">
                        <button @click="addContent(false)">Save as 'In Progress'</button>
                        <button @click="addContent(true)">Save as 'Done' and Go to next task</button>
                        <button @click="loadData(true)">Load Data From Server</button>
                    </div>
                </div>
            </div>
            <div id="divider"></div>
        </div>
        <button id="toggleBtn" @click="toggle">Split Vertically</button>
    </div>
</template>

<script>
import firebase from 'firebase'
import { VueEditor } from 'vue2-editor';
import { db } from '../main';
export default {
    name: 'proof1',
    data(){
        return{
            splitHorizontal: true,
            content: '',
            digitizedContent: 'Hare Krishna Hare Krishna',
            customToolbar: [
                ['font'],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ]
        }
    },
    components:{
        VueEditor,
    },
    mounted(){
        var x = this;
        db.collection(localStorage._jpsarc_u_currentTask_book).doc(localStorage._jpsarc_u_currentTask_page)
            .get().then(function(doc){
                x.digitizedContent = doc.data().digitization_content;
                document.getElementById('digitizedContent').innerHTML = x.digitizedContent;
        })
        this.loadData(false);
        document.getElementById('img1').setAttribute('src',localStorage._jpsarc_img)
        var splitHorizontal = true;
        document.getElementById('slider1').oninput = function(){
            document.getElementById('img1').style.width = 100*Math.exp(this.value) + '%';
        }
        document.getElementById('divider').addEventListener('mousedown', function(e){
            splitHorizontal = (document.getElementById('toggleBtn').innerHTML == 'Split Vertically')
            document.addEventListener('mousemove', mouseMove)
            document.addEventListener('mouseup', mouseUp)
        })

        var mouseMove = function(e){
            if(splitHorizontal){
                split1 = document.getElementById('split1');
                split2 = document.getElementById('split2');
                document.getElementById('divider').style.left = e.clientX + 'px';
                split1.style.width =  e.clientX - 0.0075*window.innerWidth + 'px';
                split2.style.left = e.clientX + 0.0075*window.innerWidth + 'px';
                split2.style.right = 0.0075*window.innerWidth + 'px';
                split2.style.width = 'auto';
            } else{
                split1 = document.getElementById('split1');
                split2 = document.getElementById('split2');
                document.getElementById('divider').style.top = e.clientY + 'px';
                split1.style.height =  (e.clientY - 0.0075*window.innerHeight - 61) + 'px';
                split2.style.top = (e.clientY + 0.0075*window.innerHeight) + 'px';
                split2.style.bottom = 0.0075*window.innerHeight + 'px';
                split2.style.height = 'auto';
            }
        }
        var mouseUp = function(e){
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        }
    },
    methods:{
        addContent(completed){
            content = this.content;
            db.collection(localStorage._jpsarc_u_currentTask_book).doc(localStorage._jpsarc_u_currentTask_page)
            .update({proof1_content: content, proof1_lastSavedOn: new Date()})
            if(completed){
                var x = prompt('Once you mark the current task as done, you will not be able edit it.\n\nPlease enter 123 to continue')
                if(x!='123')
                    return;
                db.collection(localStorage._jpsarc_u_currentTask_book).doc(localStorage._jpsarc_u_currentTask_page)
                .update({proof1_completedOn: new Date()});
                db.collection('Books').doc(localStorage._jpsarc_u_currentTask_book).update({
                    proof1_pagesInProcess: (sessionStorage.proof1_pagesInProcess-1),
                    proof1_pagesCompleted: (parseInt(sessionStorage.proof1_pagesCompleted)+1),
                    proof2_pagesAvailable: (parseInt(sessionStorage.proof2_pagesAvailable)+1),
                })
                db.collection('Users').doc(localStorage._jpsarc_uid).update({
                    currentTask_type: '', currentTask_book: '', currentTask_page: ''
                })
                localStorage._jpsarc_u_currentTask_book = '';
                localStorage._jpsarc_u_currentTask_page = '';
                this.$router.replace('/home')
            }
        },
        loadData(shouldPrompt){
            var x = 0;
            if(shouldPrompt)
                x = prompt("Once you load data from server all data in the text box will be overwritten. \n\nEnter 123 to continue.")
            if(x=='123'||!shouldPrompt){ 
                var x = this;
                db.collection(localStorage._jpsarc_u_currentTask_book).doc(localStorage._jpsarc_u_currentTask_page)
                    .get().then(function(doc){
                        x.content = doc.data().proof1_content;
                    })
            }
        },
        toggle(){
            this.splitHorizontal = !this.splitHorizontal;
            if(this.splitHorizontal){
                document.getElementById('toggleBtn').innerHTML = 'Split Vertically'

                document.getElementById('split1').
                setAttribute('style',"position: fixed;"+
                "top: 62px; left: .75%;bottom: 0;"+
                "width: 48.8%;");

                document.getElementById('divider').
                setAttribute('style',"position: fixed;"+
                "top: 62px; bottom: 0; left: 49.5%;"+
                "cursor: col-resize;"+
                "width: 1%;");
                
                document.getElementById('split2').
                setAttribute('style',"position: fixed;"+
                "top: 62px; left: 50.2%;bottom: 0;"+
                "width: 48.8%;");

                // 
                document.getElementById('digitizedContent').setAttribute('style',
                "height: 49.4%; width: 99.7%;");

                document.getElementById('proof1Content').setAttribute('style',
                "height: 49.4%; width: 99.7%; top: 50.1%; left: 0");
            } else{
                document.getElementById('toggleBtn').innerHTML = 'Split Horizontally'

                document.getElementById('split1').
                setAttribute('style',"position: fixed;"+
                "top: 62px; left: .75%; height: " + (window.innerHeight-62)*.488 + "px;" +
                "width: 98%;");

                document.getElementById('divider').
                setAttribute('style',"position: fixed;"+
                "cursor: row-resize;"+
                "top: " + (62+(window.innerHeight-62)*.488) + "px; height: 1%; left: 2%;"+
                "width: 96%;");
                
                document.getElementById('split2').
                setAttribute('style',"position: fixed;"+
                "top: " + (62+(window.innerHeight-62)*.50) + "px;" + "left: .75%;height: " + (window.innerHeight-62)*.488 + "px;" +
                "width: 98%;");
                
                document.getElementById('digitizedContent').setAttribute('style',
                "height: 99.5%; width: 49.5%;");

                document.getElementById('proof1Content').setAttribute('style',
                "height: 99.5%; width: 49.8%; left: 50%; top: 0px");
            }
        }
    }
}
</script>

<style>
img{
    width: 100%
}
#toggleBtn{
    position: fixed;
    top: 2%; right: 2%;
    border: 1px solid gray;
    border-radius: 5px;
}
p{
    margin: 1px 5px;
}
#digitizedContent, #proof1Content{
    position: absolute;
    left: 0;
    /* padding: 0 5px; */
    text-align: justify;
    resize: none;
    overflow: auto;
    width: 99.7%;
    height: 49.4%;
    border: 1px solid gray;
    border-radius: 5px;
}
#digitizedContent{
    background-color: rgb(226, 226, 226)
}
#proof1Content{
    top: 50%
}
#buttonsContainer{
    position: fixed;
    bottom: 5px;
    right: 80px;
}
.container{
    position: fixed;
    top: 60px; left: .5%;
    bottom: 1px;
    width: 99%;
    border: 1px solid gray;
    border-radius: 5px;
}

#split1, #split2{
    position: fixed;
    top: 62px; left: .75%;
    bottom: 2px;
    width: 48.8%;
    border: 1px solid gray;
    border-radius: 5px;
    text-align: center;
    overflow: auto;
}

#divider{
    position: fixed;
    top: 17px;
    bottom: 0;
    left: 49.5%; width: 1%;
    cursor: col-resize;
}

#slider1, #slider2{
    position: absolute;
    left: 0;
    top: 5px;
    width: 100px;
    height: 3px;
    background-color: burlywood;
    border: 1px solid gray;
    border-radius: 5px;
}
</style>
