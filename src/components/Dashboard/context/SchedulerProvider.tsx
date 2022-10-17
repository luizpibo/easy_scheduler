import FullCalendar from "@fullcalendar/react";
import moment from "moment";
import {
  createContext,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { fireStoreApp } from "../../../API/firebaseApp";
import { collection, addDoc, getDocs } from "firebase/firestore";
interface Inputs {
  title: string;
  description: string;
  startDateTime: Date;
  duration: number;
}

interface Events {
  start: string;
  end: string;
  id: string;
  title: string;
  description: string;
  duration: number;
}

interface ISchedulerContext {
  calendarRef: MutableRefObject<FullCalendar>;
  events?: Events[];
  handleAddEvent: (event: Inputs) => void;
  handleUpdateEvent: (originalEvent: Inputs, newEvent: Inputs) => void;
  handleDeleteEvent: (event: Inputs) => void;
}

interface IProvider {
  children: React.ReactNode;
}
interface IpureEvent {
  title: string;
  start: string;
  end: string;
}

export const SchedulerContext = createContext<ISchedulerContext>(
  {} as ISchedulerContext
);

const SchedulerProvider: React.FC<IProvider> = ({ children }) => {
  const calendarRef = useRef<FullCalendar>(null!);
  const [events, setEvents] = useState<Events[]>([]);
  const dbInstance = collection(fireStoreApp, "task");

  useEffect(() => {
    const fetchData = async () => {
      const dbEvents = await getEventsFromDb();
      saveSaveInLocal(dbEvents);
      return dbEvents;
    };
    const localStoreEvents = getEventsOnLocal();

    if (localStoreEvents) {
      console.log("pegou do cache", localStoreEvents);
      setEvents(localStoreEvents);
    } else {
      fetchData().then((data) => setEvents(data));
    }
  }, []);

  const getEventsFromDb = async (): Promise<any> => {
    return await getDocs(dbInstance).then((data) => {
      return data.docs.map((task) => {
        return { ...task.data(), id: task.id };
      });
    });
  };

  const saveSaveInLocal = (events: Events[]) => {
    localStorage.setItem("events", JSON.stringify(events));
  };

  const getEventsOnLocal = () => {
    const stringEvents = localStorage.getItem("events");
    if (stringEvents) {
      return JSON.parse(stringEvents);
    }
    return null;
  };

  const handleAddEvent = async (event: Inputs) => {
    const calendarApi = calendarRef.current.getApi();
    const createdEvent = calendarApi.addEvent({
      title: event.title,
      start: moment(event.startDateTime).toDate(),
      end: moment(event.startDateTime).add(event.duration, "minutes").toDate(),
    });

    if (createdEvent) {
      await addDoc(dbInstance, {
        ...createdEvent.toJSON(),
        desciption: event.description,
        duration: event.duration,
      }).then((data) => {
        const newEvent = {
          ...(createdEvent.toJSON() as IpureEvent),
          description: event.description,
          duration: event.duration,
          id: data.id,
        };
        const newEvents = [...events, newEvent];
        setEvents(newEvents);
        saveSaveInLocal(newEvents);
      });
    }
  };

  const handleUpdateEvent = (originalEvent: Inputs, newEvent: Inputs) => {};
  const handleDeleteEvent = (event: Inputs) => {};
  return (
    <SchedulerContext.Provider
      value={{
        calendarRef,
        events,
        handleAddEvent,
        handleUpdateEvent,
        handleDeleteEvent,
      }}
    >
      {children}
    </SchedulerContext.Provider>
  );
};

export default SchedulerProvider;
