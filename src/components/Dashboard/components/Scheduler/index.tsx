import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useContext } from "react";
import { SchedulerContext } from "../../context/SchedulerProvider";

const Scheduler: React.FC = () => {
  const { calendarRef, events, handleShowEventDetails } =
    useContext(SchedulerContext);
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
          handleShowEventDetails(e.event.id);
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
