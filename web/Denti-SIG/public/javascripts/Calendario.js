console.log("load1111");

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();

const day = document.querySelector(".calendar-dates");
const currdate = document.querySelector(".calendar-current-date");
const prenexIcons = document.querySelectorAll(".calendar-navigation span");

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

let clickedDay = null;
let selectedDayElement = null;
let clickedHour = null;
let clickedMinutes = null;
let selectedHourElement = null;

const manipulate = () => {
  let dayone = new Date(year, month, 1).getDay();
  let lastdate = new Date(year, month + 1, 0).getDate();
  let dayend = new Date(year, month, lastdate).getDay();
  let monthlastdate = new Date(year, month, 0).getDate();

  let lit = "";

  for (let i = dayone; i > 0; i--) {
    lit += `<li class="inactive">${monthlastdate - i + 1}</li>`;
  }

  
  for (let i = 1; i <= lastdate; i++) {
    let isToday = (i === date.getDate()
      && month === new Date().getMonth()
      && year === new Date().getFullYear()) ? "active" : "";

    let highlightClass = (clickedDay === i) ? "highlight" : "";

    lit += `<li class="${isToday} ${highlightClass}" data-day="${i}">${i}</li>`;
  }


  for (let i = dayend; i < 6; i++) {
    lit += `<li class="inactive">${i - dayend + 1}</li>`;
  }

  currdate.innerText = `${months[month]} ${year}`;
  day.innerHTML = lit;

  const allHours = document.querySelectorAll(".Hour-button")
  allHours.forEach(li => {
    
      var tempclickedHour = parseInt(li.getAttribute('data-hour'));
      var tempclickedMinutes = parseInt(li.getAttribute('data-minute'));
      var UserTasks = checkTasksForDay(clickedDay,month,year,tempclickedHour,tempclickedMinutes);
      if (UserTasks===null){
        li.classList.add("Hour-Free");
        li.classList.remove("Hour-Busy");
        li.setAttribute("data-tarefas","");
      }else{
        li.classList.add("Hour-Busy");
        li.classList.remove("Hour-Free");
        li.setAttribute("data-tarefas",UserTasks);
      }

      console.log('Hora:', clickedHour);
      console.log('Minutos:', clickedMinutes);
  });
  
  addClickListenersToDays();
  addClickListenersToHours()
};


function addClickListenersToDays() {
  const allDays = day.querySelectorAll('li:not(.inactive)');
  allDays.forEach(li => {
    li.addEventListener('click', () => {
      if (selectedDayElement) {
        selectedDayElement.classList.remove('highlight');
      }

      li.classList.add('highlight');
      selectedDayElement = li;

      clickedDay = parseInt(li.getAttribute('data-day'));

      console.log('Dia:', clickedDay);
      console.log('Més:', month+1);
      console.log('Ano:', year);
    });
  });
}

function format2digits(n){
  if (n===null){
    return null;
  }
  return (n < 10) ? '0' + n.toString() : n.toString();
}

function checkTasksForDay(clickedday,month,year,clickedHour,clickedMinutes){

  /* Colocar metodo para acessar o servidor e verificar se este horario tem alguma tarefa.
  if (){
    return (string de tarefas);
  } 
  */
  return null /*retorna null se não tem */
}

function addClickListenersToHours(){
  const allHours = document.querySelectorAll(".Hour-button")
  allHours.forEach(li => {
    li.addEventListener('click', () => {
      if (selectedHourElement) {
        selectedHourElement.classList.remove('selectedhour');
      }

      li.classList.add('selectedhour');
      selectedHourElement = li;

      clickedHour = parseInt(li.getAttribute('data-hour'));
      clickedMinutes = parseInt(li.getAttribute('data-minute'));

      console.log('Hora:', clickedHour);
      console.log('Minutos:', clickedMinutes);

      
      document.getElementById("Agenda").innerHTML= "Mostrando conteudo agendado para "+format2digits(clickedDay)+"/"+format2digits(month+1)+"/"+year+" ás "+format2digits(clickedHour)+":"+format2digits(clickedMinutes)+" : ";
      document.getElementById("AgendaInput").value = li.getAttribute("data-tarefas");
    });
  });
}

manipulate();

prenexIcons.forEach(icon => {
  icon.addEventListener("click", () => {
    month = icon.id === "calendar-prev" ? month - 1 : month + 1;

    if (month < 0 || month > 11) {
      date = new Date(year, month, new Date().getDate());
      year = date.getFullYear();
      month = date.getMonth();
    } else {
      date = new Date();
    }

    clickedDay = null;
    selectedDayElement = null;

    manipulate();
  });
});
function EditButtonAction(){
  alert("enviando ao servidor: Tarefas para o dia "+format2digits(clickedDay)+"/"+format2digits(month+1)+"/"+year+" ás "+format2digits(clickedHour)+":"+format2digits(clickedMinutes)+" : "+document.getElementById("AgendaInput").value);
  console.log("enviando ao servidor:");
  console.log("Tarefas para o dia "+format2digits(clickedDay)+"/"+format2digits(month+1)+"/"+year+" ás "+format2digits(clickedHour)+":"+format2digits(clickedMinutes));
  console.log(document.getElementById("AgendaInput").value)
  /*mandar este valor ao servidor*/
}
document.getElementById("EditButton").setAttribute('onclick',"EditButtonAction()");