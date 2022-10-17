import FullCalendar, { EventClickArg } from "@fullcalendar/react";
import moment from "moment";
import {
  createContext,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
  Fragment,
} from "react";
import { fireStoreApp } from "../../../API/firebaseApp";
import { collection, addDoc, getDocs, getDoc, doc } from "firebase/firestore";
import { Dialog, Transition } from "@headlessui/react";

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
  handleShowEventDetails: (event: string) => void;
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
  const [isOpen, setIsOpen] = useState(true);
  const dbInstance = collection(fireStoreApp, "task");

  useEffect(() => {
    const fetchData = async () => {
      const dbEvents = await getEventsFromDb();
      saveTasksInLocal(dbEvents);
      return dbEvents;
    };
    const localStoreEvents = getEventsOnLocal();

    if (localStoreEvents) {
      setEvents(localStoreEvents);
    } else {
      fetchData().then((data) => setEvents(data));
    }
  }, []);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const getEventById = async(id: string): Promise<any> => {
    // Buscando pelo banco de dados
    // const docRef = doc(fireStoreApp, "task", id);
    // const docData = await getDoc(docRef);

    const selectEventFilter = events.filter((event)=>event.id===id);
    if(selectEventFilter){
        console.log(selectEventFilter[0])
        setSelectedEvent(selectEventFilter[0])
    }
  }

  const getEventsFromDb = async (): Promise<any> => {
    return await getDocs(dbInstance).then((data) => {
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
        saveTasksInLocal(newEvents);
      });
    }
  };

  const handleShowEventDetails = (eventClick: string) => {
    setIsOpen(true);
    getEventById(eventClick);
  };
  const handleUpdateEvent = (originalEvent: Inputs, newEvent: Inputs) => {};
  const handleDeleteEvent = (event: Inputs) => {};
  return (
    <div className="relative">
      <SchedulerContext.Provider
        value={{
          calendarRef,
          events,
          handleAddEvent,
          handleUpdateEvent,
          handleDeleteEvent,
          handleShowEventDetails,
        }}
      >
        {children}
      </SchedulerContext.Provider>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-500 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {selectedEvent?.title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your payment has been successfully submitted. We’ve sent
                      you an email with all of the details of your order.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default SchedulerProvider;
