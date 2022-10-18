import {
  createContext,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  setDoc,
  where,
  doc,
} from "firebase/firestore";
import { fireStoreApp, auth } from "../../../API/firebaseApp";
import FullCalendar from "@fullcalendar/react";
import moment from "moment";
import Modals from "../components/Modals";

interface ISchedulerContext {
  calendarRef: MutableRefObject<FullCalendar>;
  events?: Events[];
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  selectedEvent?: Events;
  handleAddEvent: (event: Inputs) => void;
  // handleUpdateEvent: (originalEvent: Inputs, newEvent: Inputs) => void;
  handleUpdateEvent: any;
  handleDeleteEvent: (event: Inputs) => void;
  handleShowEventDetails: (event: string) => void;
  currentModal: string;
  setCurrentModal: (modalName: string) => void;
  setSelectedEvent: any;
}

export interface Events {
  start: string;
  end: string;
  id?: string;
  title: string;
  description: string;
  duration: number;
  userUid?: string;
}

export interface Inputs {
  title: string;
  description: string;
  start: Date;
  duration: number;
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
  const [selectedEvent, setSelectedEvent] = useState<Events>();
  const [events, setEvents] = useState<Events[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentModal, setModal] = useState("buscar_tarefa");
  const dbInstance = collection(fireStoreApp, "task");

  useEffect(() => {
    const fetchData = async () => await getEventsFromDb();
    const localStoreEvents = getEventsOnLocal();
    if (localStoreEvents) {
      setEvents(localStoreEvents);
    } else {
      fetchData().then((data) => {
        saveTasksInLocal(data);
        setEvents(data);
      });
    }
  }, []);

  const setCurrentModal = (modalName: string) => {
    openModal();
    setModal(modalName);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal = () => {
    setIsOpen(true);
  };
  const getEventById = (id: string) => {
    // Buscando pelo banco de dados
    // const docRef = doc(fireStoreApp, "task", id);
    // const docData = await getDoc(docRef);
    const selectEventFilter = events.filter((event) => event.id === id);
    if (selectEventFilter) {
      setSelectedEvent(selectEventFilter[0]);
    }
  };
  const getEventsFromDb = async (): Promise<any> => {
    const userUid = auth.currentUser?.uid as String;
    const q = query(dbInstance, where("userUid", "==", userUid));
    return await getDocs(q).then((data) => {
      return data.docs.map((task) => {
        return { ...task.data(), id: task.id };
      });
    });
  };
  const saveTasksInLocal = (events: Events[]) => {
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
      start: moment(event.start).toDate(),
      end: moment(event.start).add(event.duration, "minutes").toDate(),
    });

    if (createdEvent) {
      const userUid = auth.currentUser?.uid;
      const newEvent = {
        ...createdEvent.toJSON(),
        description: event.description,
        duration: event.duration,
        userUid: userUid,
      }
      await addDoc(dbInstance, newEvent).then((data) => {
        const newEvent = {
          ...(createdEvent.toJSON() as IpureEvent),
          description: event.description,
          duration: event.duration,
          id: data.id,
        };
        const newEvents = [...events, newEvent];
        setEvents(newEvents);
        saveTasksInLocal(newEvents);
        closeModal();
      });
    }
  };

  const UpdateEventState = () => {
    if (events.length > 0) {
      const newEventsState = events.map((event) => {
        if (event.id == selectedEvent?.id) {
          return selectedEvent;
        }
        return event;
      });
      setEvents(newEventsState as Events[]);
      saveTasksInLocal(newEventsState as Events[]);
    }
  };
  const handleShowEventDetails = (eventId: string) => {
    getEventById(eventId);
    setCurrentModal("alterar_tarefa");
  };
  const handleUpdateEvent = async (newEvent: Inputs) => {
    const refDoc = doc(dbInstance, selectedEvent?.id);

    const newEventFormated = {
      ...selectedEvent,
      description: newEvent.description,
      duration: newEvent.duration,
      end: moment(newEvent.start).add(newEvent.duration, "minutes").toDate().toISOString(),
      start: moment(newEvent.start).toDate().toISOString(),
      title: newEvent.title,
    }
    setSelectedEvent(newEventFormated);

    await setDoc(refDoc, newEventFormated);
    UpdateEventState();
    closeModal();
    const calendarApi = calendarRef.current.getApi();
    calendarApi.refetchEvents();
  };
  const handleDeleteEvent = (event: Inputs) => {};
  return (
    <div className="relative">
      <SchedulerContext.Provider
        value={{
          calendarRef,
          events,
          isOpen,
          closeModal,
          openModal,
          selectedEvent,
          handleAddEvent,
          handleUpdateEvent,
          handleDeleteEvent,
          handleShowEventDetails,
          setCurrentModal,
          setSelectedEvent,
          currentModal,
        }}
      >
        {children}
        <Modals />
      </SchedulerContext.Provider>
    </div>
  );
};

export default SchedulerProvider;
