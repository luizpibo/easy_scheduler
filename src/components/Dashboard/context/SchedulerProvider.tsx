import {
  createContext,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import FullCalendar from "@fullcalendar/react";
import moment from "moment";
import { AuthContext } from "../../../contexts/AuthContext";
import {
  addNewEventService,
  getAllUserEventsService,
  upgradeEventService,
} from "../../../services/userSevices";
import { getEventsOnLocal, updateLocalStorage } from "../../../Utils";

interface ISchedulerContext {
  calendarRef: MutableRefObject<FullCalendar>;
  events?: Events[];
  selectedEvent?: Events;
  selectEventById: (eventId: string) => boolean;
  handleEventUpdateWithInputs: (event: Inputs) => void;
  handleAddEvent: (event: Inputs) => void;
  handleDeleteEvent: (event: Inputs) => void;
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

export const SchedulerContext = createContext<ISchedulerContext>(
  {} as ISchedulerContext
);

const SchedulerProvider: React.FC<IProvider> = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [selectedEvent, setSelectedEvent] = useState<Events>();
  const [events, setEvents] = useState<Events[]>([]);
  const calendarRef = useRef<FullCalendar>(null!);
  console.log("events", events);
  useEffect(() => {
    const fetchData = async () =>
      await getAllUserEventsService(currentUser.userUid);
    const localStoreEvents = getEventsOnLocal();
    if (localStoreEvents) {
      setEvents(localStoreEvents);
    } else {
      fetchData().then((data) => {
        updateLocalStorage(data);
        setEvents(data);
      });
    }
  }, []);

  const updateEvent = (newEvent: Events) => {
    const newEventsList = events.map((event) => {
      if (event.id == newEvent.id) {
        console.log("achou um com id igual");
        return newEvent;
      }
      return event;
    });
    upgradeStateEvents({ newEvents: newEventsList });
  };

  const upgradeStateEvents = ({
    newEvents,
    newEvent,
  }: {
    newEvents?: Events[];
    newEvent?: Events;
  }) => {
    if (newEvents) {
      const newEventsList = [...events, ...newEvents];
      console.log("NEW EVENTS LIST ON UPGRADE", newEventsList);
      updateLocalStorage(newEventsList);
      setEvents(newEventsList);
    } else if (newEvent) {
      updateEvent(newEvent);
    }
  };

  const selectEventById = (id: string) => {
    // Buscando pelo banco de dados
    // const docRef = doc(fireStoreApp, "task", id);
    // const docData = await getDoc(docRef);
    const eventFiltering = events.filter((event) => event.id === id);
    if (eventFiltering.length > 0) {
      console.log("Evento selecionado", eventFiltering[0]);
      setSelectedEvent(eventFiltering[0]);
      return true;
    }
    return false;
  };

  const handleAddEvent = async (event: Inputs) => {
    //Pegar o id do usuário logado
    const userUid = currentUser.userUid;
    // Criando um novo docmento para ser salvo na firebase, contendo o evendo do calendário, descrição, duração da atividade e id do usuario
    const newEvent = {
      title: event.title,
      start: moment(event.start).toDate().toISOString(),
      end: moment(event.start)
        .add(event.duration, "minutes")
        .toDate()
        .toISOString(),
      description: event.description,
      duration: event.duration,
      userUid: userUid,
    } as Events;
    // Acionando a função que adiciona um novo documento, ela recebe a referencia da coleção e o novo evento
    const eventOnFirebase = await addNewEventService(newEvent);
    upgradeStateEvents({ newEvent: eventOnFirebase });
  };

  const handleEventUpdateWithInputs = async (newEvent: Inputs) => {
    if (selectedEvent?.id) {
      const newEventFormated = {
        userUid: selectedEvent.userUid,
        id: selectedEvent.id,
        description: newEvent.description,
        duration: newEvent.duration,
        end: moment(newEvent.start)
          .add(newEvent.duration, "minutes")
          .toDate()
          .toString(),
        start: moment(newEvent.start).toDate().toString(),
        title: newEvent.title,
      };
      await upgradeEventService(newEventFormated);
      updateEvent(newEventFormated);
    }
  };

  const handleDeleteEvent = (event: Inputs) => {};

  return (
    <div className="relative">
      <SchedulerContext.Provider
        value={{
          calendarRef,
          events,
          selectedEvent,
          handleAddEvent,
          handleEventUpdateWithInputs,
          handleDeleteEvent,
          selectEventById,
        }}
      >
        {children}
      </SchedulerContext.Provider>
    </div>
  );
};

export default SchedulerProvider;
