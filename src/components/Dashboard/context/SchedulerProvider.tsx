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
  where,
} from "firebase/firestore";
import { fireStoreApp, auth } from "../../../API/firebaseApp";
import FullCalendar from "@fullcalendar/react";
import moment from "moment";
import Modals from "../components/Modals";

interface ISchedulerContext {
  calendarRef: MutableRefObject<FullCalendar>;
  events?: Events[];
  isOpen: boolean;
  openModal: ()=>void;
  closeModal: ()=>void;
  selectedEvent?: Events; 
  handleAddEvent: (event: Inputs) => void;
  // handleUpdateEvent: (originalEvent: Inputs, newEvent: Inputs) => void;
  handleUpdateEvent: any
  handleDeleteEvent: (event: Inputs) => void;
  handleShowEventDetails: (event: string) => void;
  currentModal: string
  setCurrentModal: (modalName: string)=>void
  setSelectedEvent: any
}

export interface Events {
  start: string;
  end: string;
  id: string;
  title: string;
  description: string;
  duration: number;
}

export interface Inputs {
  title: string;
  description: string;
  startDateTime: Date;
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
  const [currentModal, setModal] = useState("buscar_tarefa")
  const dbInstance = collection(fireStoreApp, "task");

  useEffect(() => {
    const fetchData = async () => await getEventsFromDb();

    const localStoreEvents = getEventsOnLocal();
    console.log("Local store", localStoreEvents);
    if (localStoreEvents) {
      setEvents(localStoreEvents);
    } else {
      fetchData().then((data) => {
        console.log(data)
        saveTasksInLocal(data);
        setEvents(data);
      });
    }
  }, []);

  const setCurrentModal = (modalName: string) => {
    openModal()
    setModal(modalName)
  }

  const closeModal = () => {
    setIsOpen(false);
  }
  const openModal = () => {
    setIsOpen(true);
  }
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
      start: moment(event.startDateTime).toDate(),
      end: moment(event.startDateTime).add(event.duration, "minutes").toDate(),
    });

    if (createdEvent) {
      const userUid = auth.currentUser?.uid;
      await addDoc(dbInstance, {
        ...createdEvent.toJSON(),
        description: event.description,
        duration: event.duration,
        userUid: userUid,
      }).then((data) => {
        const newEvent = {
          ...(createdEvent.toJSON() as IpureEvent),
          description: event.description,
          duration: event.duration,
          id: data.id,
        };
        const newEvents = [...events, newEvent];
        setEvents(newEvents);
        saveTasksInLocal(newEvents);
      });
    }
  };
  const handleShowEventDetails = (eventId: string) => {
    getEventById(eventId);
    console.log(selectedEvent)
    setCurrentModal("alterar_tarefa");
  };
  const handleUpdateEvent = (newEvent: Inputs) => {};
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
          currentModal
        }}
      >
        {children}
        <Modals />
      </SchedulerContext.Provider>

    </div>
  );
};

export default SchedulerProvider;
