import FullCalendar, { DatesSetArg, EventInput } from "@fullcalendar/react";
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useRef, useState } from "react";

interface ICardColor {
    backgroundColor: string;
    textColor: string;
  }
  
  interface IModalInfosEventCalendaryProps {
    open: boolean;
    handleClose: () => void;
    eventInfos: any;
    isEditCard: boolean;
  }

  
const Scheduler:React.FC = () => {
    const calendarRef = useRef<FullCalendar>(null!);
    const [events, setEvents] = useState<EventInput[]>([
      { title: "initial event1", start: new Date() },
    ]);
    return(
        <FullCalendar
        ref={calendarRef}
        events={events}
        datesSet={(arg: DatesSetArg) => {
          setEvents([...events, { title: "additional", start: arg.start }]);
        }}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        
        headerToolbar ={
          {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth'
          }
        }
        buttonText={
          {
            today:    'Hoje',
            month:    'Mês',
            week:     'Semana',
            day:      'Dia',
            list:     'Lista'
          }
        }
        height={480}
        initialDate={Date.now()}
        initialView="timeGridWeek"
        showNonCurrentDates
        locale="pt-br"
        dayMaxEvents
        editable
        nowIndicator
        selectable
      />
    )
}

export default Scheduler;