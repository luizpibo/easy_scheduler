import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useContext } from "react";
import { SchedulerContext } from "../../context/SchedulerProvider";


interface IScheduler {
  setCurrentModal: (modalName: "adicionar_tarefa"| "alterar_tarefa" | "buscar_tarefa" )=>any
}
const Scheduler: React.FC<IScheduler> = ({setCurrentModal}) => {
  const { calendarRef, events, selectEventById } =
    useContext(SchedulerContext);
    console.log("events of Scheduler", events);
    
  return (
    <div className="flex-col flex-1 rounded bg-gray-800 p-4 shadow-lg text-gray-200">
      <FullCalendar
        ref={calendarRef}
        events={events}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridDay,timeGridWeek,dayGridMonth",
        }}
        buttonText={{
          today: "Hoje",
          month: "Mês",
          week: "Semana",
          day: "Dia",
          list: "Lista",
        }}
        eventClick={(e) => {
          console.log("Event id", e.event.id);
          if(selectEventById(e.event.id)){
            setCurrentModal('alterar_tarefa')
          }
        }}
        height={480}
        initialDate={Date.now()}
        initialView="timeGridWeek"
        locale="pt-br"
        dayMaxEvents
        nowIndicator
        selectable
      />
    </div>
  );
};

export default Scheduler;
