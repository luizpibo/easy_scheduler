import FullCalendar from "@fullcalendar/react";
import moment from "moment";
import { createContext, MutableRefObject, useRef, useState } from "react"

interface Inputs {
    title: string;
    description: string;
    startDateTime: Date;
    duration: number;
  }

interface ISchedulerContext {
   calendarRef: MutableRefObject<FullCalendar>;
   events?: Inputs[];
   handleAddEvent: (event: Inputs)=>void;
   handleUpdateEvent: (originalEvent:Inputs, newEvent:Inputs)=>void;
   handleDeleteEvent: (event: Inputs)=>void;
}

interface IProvider {
    children: React.ReactNode
}

export const SchedulerContext = createContext<ISchedulerContext>({} as ISchedulerContext);


const SchedulerProvider:React.FC<IProvider> = ({children}) => {
    const calendarRef = useRef<FullCalendar>(null!);
    const [events, setEvent] = useState<Inputs[]>();

    const handleAddEvent = (event: Inputs) => {
        console.log("Evento...", event)
        const calendarApi = calendarRef.current.getApi();
        console.log();
        calendarApi.addEvent({
            title: event.title,
            start: moment(event.startDateTime).toDate(),
            end: moment(event.startDateTime).add(event.duration, "minutes").toDate(),
        })

    }
    const handleUpdateEvent = (originalEvent:Inputs, newEvent:Inputs) => {

    }
    const handleDeleteEvent = (event: Inputs) => {

    }
    return (
        <SchedulerContext.Provider value={{calendarRef, events, handleAddEvent, handleUpdateEvent, handleDeleteEvent}}>
            {children}
        </SchedulerContext.Provider>
    )
}

export default SchedulerProvider