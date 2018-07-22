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
                <vue-editor v-model="content" ></vue-editor>
                <button @click="addContent(false)">Save as 'In Progress'</button>
                <button @click="addContent(true)">Save as 'Done' and Go to next task</button>
                <button @click="loadData(true)">Load Saved Data From Server</button>
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
import router from '../router';
export default {
    name: 'digitizationPage',
    props:['isAdmin'],
    data(){
        return{
            splitHorizontal: true,
            content: '',
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
            .update({digitization_content: content, digitization_lastSavedOn: new Date()})
            if(completed){
                var x = prompt('Once you mark the current task as done, you will not be able edit it.\n\nPlease enter 123 to continue')
                if(x!='123')
                    return;
                db.collection(localStorage._jpsarc_u_currentTask_book).doc(localStorage._jpsarc_u_currentTask_page)
                .update({digitization_completedOn: new Date()});
                db.collection('Books').doc(localStorage._jpsarc_u_currentTask_book).update({
                    digitization_pagesInProcess: (sessionStorage.digitization_pagesInProcess-1),
                    digitization_pagesCompleted: (parseInt(sessionStorage.digitization_pagesCompleted)+1),
                    proof1_pagesAvailable: (parseInt(sessionStorage.proof1_pagesAvailable)+1),
                })
                db.collection('Users').doc(localStorage._jpsarc_uid).update({
                    currentTask_type: '', currentTask_book: '', currentTask_page: '', 
                    digitizationTasksCompleted: parseInt(localStorage.digitizationTasksCompleted) + 1
                })
                localStorage._jpsarc_u_currentTask_book = '';
                localStorage._jpsarc_u_currentTask_page = '';
                localStorage.digitizationTasksCompleted = parseInt(localStorage.digitizationTasksCompleted) + 1;
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
                        x.content = doc.data().digitization_content;
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
                "width: 48.8%;border: 1px solid gray;"+ 
                "border-radius: 5px;");

                document.getElementById('divider').
                setAttribute('style',"position: fixed;"+
                "top: 62px; bottom: 0; left: 49.5%;"+
                "cursor: col-resize;"+
                "width: 1%;");
                
                document.getElementById('split2').
                setAttribute('style',"position: fixed;"+
                "top: 62px; left: 50.2%;bottom: 0;"+
                "width: 48.8%;border: 1px solid gray;"+ 
                "border-radius: 5px;");
            } else{
                document.getElementById('toggleBtn').innerHTML = 'Split Horizontally'

                document.getElementById('split1').
                setAttribute('style',"position: fixed;"+
                "top: 62px; left: .75%; height: " + (window.innerHeight-62)*.488 + "px;" +
                "width: 98%;border: 1px solid gray;"+ 
                "border-radius: 5px;");

                document.getElementById('divider').
                setAttribute('style',"position: fixed;"+
                "cursor: row-resize;"+
                "top: " + (62+(window.innerHeight-62)*.488) + "px; height: 1%; left: 2%;"+
                "width: 96%;");
                
                document.getElementById('split2').
                setAttribute('style',"position: fixed;"+
                "top: " + (62+(window.innerHeight-62)*.488) + "px;" + "left: .75%;height: " + (window.innerHeight-62)*.488 + "px;" +
                "width: 98%;border: 1px solid gray;"+ 
                "border-radius: 5px;");
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
    position: fixed;
    left: 5px;
    top: 68px;
    width: 100px;
    height: 3px;
    background-color: burlywood;
    border: 1px solid gray;
    border-radius: 5px;
}
</style>
