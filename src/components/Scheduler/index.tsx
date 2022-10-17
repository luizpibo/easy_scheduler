import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useContext, useRef, useState } from "react";
import { SchedulerContext } from "../Dashboard/context/SchedulerProvider";

const Scheduler: React.FC = () => {
  const {calendarRef, events} = useContext(SchedulerContext);

  return (
    <div className="rounded bg-gray-800 p-4 shadow-lg text-gray-200">
      <FullCalendar
        ref={calendarRef}
        events={events}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        dateClick={(e)=>{
          e.view.calendar.addEvent({title: "teste da madruga", start: Date().toString()})
        }}
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
