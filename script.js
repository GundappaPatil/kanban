let addBtn = document.querySelector(".add-btn")
let removeBtn = document.querySelector(".remove-btn")
let addTaskFlag = false
let removeTaskFlag = false
let modalCont = document.querySelector(".modal-cont")
let mainCont = document.querySelector(".main-cont")
let textAreaCont = document.querySelector(".textArea-cont")
let modalPrioritycolor = "black";
let colors = ["lightpink","lightgreen","lightblue","black"];
let lockClass = 'fa-lock';
let unlockClass = 'fa-lock-open'
let colorList = document.querySelectorAll(".color")
let ticketList = [];


//GETTING ITEMS FROM LOCAL STORAGE
if(localStorage.getItem('tickets')){
    ticketList = JSON.parse(localStorage.getItem('tickets'));
    ticketList.forEach(function(ticket){
        createTicket(ticket.ticketColor,ticket.ticketTask,ticket.ticketId)
    })
}


//ADD BUTTON TO CREATE A TICKET
addBtn.addEventListener("click",function(){
    addTaskFlag = !addTaskFlag;
    if(addTaskFlag===true){
        modalCont.style.display = "flex"
    }
    else{
        modalCont.style.display = "none";
    }
})

//TO DELETE TASK FROM LIST FIRST WE NEED TO ACTIVATE REMOVE BUTTON
removeBtn.addEventListener("click",function(){
    removeTaskFlag = !removeTaskFlag;
    if(removeTaskFlag==true){
        alert("delete button has been activated")
        removeBtn.style.backgroundColor = "red";
    }else{
        removeBtn.style.backgroundColor = "inherit";
    }
})

//CREATE TICKET ONLY WHEN WE PRESS SHIFT KEY
modalCont.addEventListener('keydown',function(e){
    let key = e.key;
    if(key==='Shift'){
        createTicket(modalPrioritycolor,textAreaCont.value);
        modalCont.style.display = "none";
        textAreaCont.value = ''
    }
})

//CREATING TICKET
function createTicket(ticketColor,ticketTask,ticketId){ 
    let id = ticketId || shortid();
    let ticketCont = document.createElement("div")
    ticketCont.setAttribute('class','ticket-cont')

    ticketCont.innerHTML = `<div class=" ticket-color ${ticketColor}" ></div>
    <div class="ticket-id">${id}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="lock-icon"><i class="fa-solid fa-lock" style="color: #0c0d0d;"></i></div>`
                    
    mainCont.appendChild(ticketCont);
    if(!ticketId){
        ticketList.push({ticketColor,ticketTask,ticketId:id});
        localStorage.setItem('tickets',JSON.stringify(ticketList));
    }
    handleRemoval(ticketCont,id);
    handleLock(ticketCont ,id);
    handleColor(ticketCont,id);
}
console.log(ticketList);

//SELECTING COLOR FOR YOUR TASK
let allPriorityColors = document.querySelectorAll(".priority-color");
allPriorityColors.forEach(function(colorElem){
    colorElem.addEventListener('click',function(){
        allPriorityColors.forEach(function(priorityColorElem){
            priorityColorElem.classList.remove("active")
        })
        colorElem.classList.add('active');
        modalPrioritycolor = colorElem.classList[0]
    })
})

//DELETING TICKET FROM LIST
function handleRemoval(ticket,id){
ticket.addEventListener("click",function(){
    if(!removeTaskFlag)return;
    let idx = getTicketIdx(id);
    ticket.remove();
    let deletedElement = ticketList.splice(idx,1);

    localStorage.setItem('tickets',JSON.stringify(ticketList))
})
}

//TO EDIT TEXT AREA USE LOCK AND UNLOCK ICON
function handleLock(ticket,id){
    
    let ticketLockElem = ticket.querySelector(".lock-icon");
    let ticketLockIcon = ticketLockElem.children[0]
    let ticketTaskArea = ticket.querySelector('.task-area');
    ticketLockIcon.addEventListener('click',function(){
        let ticketIdx = getTicketIdx(id);
        if(ticketLockIcon.classList.contains(lockClass)){
            ticketLockIcon.classList.remove(lockClass)
            ticketLockIcon.classList.add(unlockClass);
            ticketTaskArea.setAttribute('contenteditable','true')
        }else{ 
            ticketLockIcon.classList.remove(unlockClass);
            ticketLockIcon.classList.add(lockClass);
            ticketTaskArea.setAttribute('contenteditable','false')
        }
        ticketList[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem('tickets',JSON.stringify(ticketList))
    })
}

//CHANGE THE COLOR OF TICKET BAND ON CLICKING
function handleColor(ticket,id){
    let ticketColorBand = ticket.querySelector(".ticket-color");
    ticketColorBand.addEventListener('click',function(){
        let ticketColorIdx = getTicketIdx(id);
        let currentColor = ticketColorBand.classList[1];
        let currentColorIdx = colors.findIndex(function(color){
            return currentColor===color;
        })
        currentColorIdx++;

        let newTicketColor = colors[currentColorIdx % colors.length];
        ticketColorBand.classList.remove(currentColor);
        ticketColorBand.classList.add(newTicketColor);

        ticketList[ticketColorIdx].ticketColor = newTicketColor;
        localStorage.setItem('tickets',JSON.stringify(ticketList))
    })
}

//FILTERING THE TICKETS
for(let i=0; i<colorList.length ; i++){
    colorList[i].addEventListener('click',function(){
        let selectedColor = colorList[i].classList[0];
        let filteredTickets = ticketList.filter(function(ticket){
            return selectedColor === ticket.ticketColor; 
        })
        let allTickets = document.querySelectorAll('.ticket-cont')
        for(let i=0 ; i<allTickets.length ; i++){
            allTickets[i].remove();
        }
        filteredTickets.forEach(function(filteredTicket){
            createTicket(filteredTicket.ticketColor,filteredTicket.ticketTask,filteredTicket.ticketId)
        })
    })
}

//GETTING INDEX OF ID PASSED TO LOCK FUNCTION
function getTicketIdx(id){
    let ticketIdx = ticketList.findIndex(function(ticketObj){
        return ticketObj.ticketId === id;
    })
    console.log(ticketIdx)
    return ticketIdx;

}
