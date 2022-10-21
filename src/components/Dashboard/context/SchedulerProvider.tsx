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

interface ISchedulerContext {
  calendarRef: MutableRefObject<FullCalendar>;
  events?: Events[];
  selectedEvent?: Events;
  selectEventById: (eventId: string) => boolean;
  handleEventUpdateWithIEventDTO: (event: IEventDTO) => void;
  handleAddEvent: (event: IEventDTO) => void;
  handleDeleteEvent: (event?: Events) => void;
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

export interface IEventDTO {
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
    fetchData().then((data) => {
      setEvents(data);
    });
  }, []);

  const updateEvent = (newEvent: Events) => {
    const newEventsList = events.map((event) => {
      if (event.id == newEvent.id) {
        console.log("achou um com id igual");
        return newEvent;
      }
      return event;
    });
    setEvents(newEventsList);
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

  const handleAddEvent = async (event: IEventDTO) => {
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
    console.log("Novo evento sendo adicionado", eventOnFirebase);
    setEvents([...events, eventOnFirebase]);
  };

  const handleEventUpdateWithIEventDTO = async (newEvent: IEventDTO) => {
    if (selectedEvent?.id) {
      const newEventFormated = {
        userUid: selectedEvent.userUid,
        id: selectedEvent.id,
        description: newEvent.description,
        duration: newEvent.duration,
        end: moment(newEvent.start)
          .add(newEvent.duration, "minutes")
          .toISOString(),
        start: moment(newEvent.start).toDate().toISOString(),
        title: newEvent.title,
      };
      console.log("evento sendo atualizado", newEventFormated)
      await upgradeEventService(newEventFormated);
      updateEvent(newEventFormated);
    }
  };

  const handleDeleteEvent = (event?: Events) => {
    console.log("evento", event)
  };

  return (
    <div className="relative">
      <SchedulerContext.Provider
        value={{
          calendarRef,
          events,
          selectedEvent,
          handleAddEvent,
          handleEventUpdateWithIEventDTO,
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
