import firebase from 'firebase'
import {db} from './main'

export default{
    name: 'bootstrap',
    sortTable: function(tableId, n) {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById(tableId);
        switching = true;
        // Set the sorting direction to ascending:
        dir = "asc";
        /* Make a loop that will continue until
        no switching has been done: */
        while (switching) {
            // Start by saying: no switching is done:
            switching = false;
            rows = table.getElementsByTagName("TR");
            /* Loop through all table rows (except the
            first, which contains table headers): */
            for (i = 0; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            if(tableId=='myTable' && n==0){
                x = rows[i].getElementsByTagName("TD")[n].getElementsByTagName("*")[0];
                y = rows[i + 1].getElementsByTagName("TD")[n].getElementsByTagName("*")[0];
            } else{
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
            }
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir == "asc") {
                if(tableId=='myTable' && n==0){
                    if (parseInt(x.innerHTML.toLowerCase()) > parseInt(y.innerHTML.toLowerCase())) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else{
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            } else if (dir == "desc") {
                if(tableId=='myTable' && n==0){
                    if (parseInt(x.innerHTML.toLowerCase()) < parseInt(y.innerHTML.toLowerCase())) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else{
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            }
            if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount ++;
            } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
            }
        }
    },
    updateUserInfo(){
        var user = firebase.auth().currentUser;
        if(localStorage._jpsarc_uid!=user.uid){
            db.collection('Users').doc(user.uid).get().then(function(doc){
                localStorage._jpsarc_uname = doc.data().name
                localStorage._jpsarc_u_allowDigitization = doc.data().allowDigitization
                localStorage._jpsarc_u_allowProof1 = doc.data().allowProof1
                localStorage._jpsarc_u_allowProof2 = doc.data().allowProof2

                localStorage._jpsarc_u_currentTask_type = doc.data().currentTask_type; 
                localStorage._jpsarc_u_currentTask_book = doc.data().currentTask_book; 
                localStorage._jpsarc_u_currentTask_page = doc.data().currentTask_page;

                localStorage._jpsarc_u_digitizationTasksCompleted = doc.data().digitizationTasksCompleted;
                localStorage._jpsarc_u_proof1TasksCompleted = doc.data().proof1TasksCompleted;
                localStorage._jpsarc_u_proof2TasksCompleted = doc.data().proof2TasksCompleted;
            
                if(localStorage._jpsarc_u_currentTask_page==""){
                    document.getElementById('currentTasks').style.display = 'none'
                } else{
                    document.getElementById('currentTaskBook').innerHTML = localStorage._jpsarc_u_currentTask_book
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
                if(localStorage._jpsarc_uname!=''){
                    var p = document.createElement('i'); p.innerHTML = 'Welcome ' + localStorage._jpsarc_uname 
                    p.style.marginLeft = '-150px';
                    document.getElementById('header').appendChild(p);
                }
            });
        }
    }
}