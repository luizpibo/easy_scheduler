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
import { useForm } from "react-hook-form";
import { Button } from "flowbite-react";

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

interface Task {
  label: string;
  id: string;
  type: string;
  inputName: "title" | "description" | "startDateTime" | "duration";
}

const newTaskForm: Task[] = [
  {
    label: "Título da tarefa",
    id: "taskTitle",
    type: "text",
    inputName: "title",
  },
  {
    label: "Descrição",
    id: "taskDescription",
    type: "text",
    inputName: "description",
  },
  {
    label: "Dia da tarefa",
    id: "taskDay",
    type: "datetime-local",
    inputName: "startDateTime",
  },
  {
    label: "Tempo de duração da tarefa em minutos",
    id: "taskDuration",
    type: "number",
    inputName: "duration",
  },
];

const SchedulerProvider: React.FC<IProvider> = ({ children }) => {
  const calendarRef = useRef<FullCalendar>(null!);
  const [selectedEvent, setSelectedEvent] = useState<Events>();
  const { register, handleSubmit } = useForm<Inputs>();
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

  const getEventById = async (id: string): Promise<any> => {
    // Buscando pelo banco de dados
    // const docRef = doc(fireStoreApp, "task", id);
    // const docData = await getDoc(docRef);

    const selectEventFilter = events.filter((event) => event.id === id);
    if (selectEventFilter) {
      console.log(selectEventFilter[0]);
      setSelectedEvent(selectEventFilter[0]);
    }
  };

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

  const handleUpdateEvent = (newEvent: Inputs) => {};

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
                    <form
                      className="grid gap-2"
                      onSubmit={handleSubmit(handleUpdateEvent)}
                    >
                      {newTaskForm.map((field) => {
                        return (
                          <div className="relative" key={field.inputName}>
                            <label
                              htmlFor={field.id}
                              className="absolute hidden"
                            >
                              {field.label}
                            </label>
                            <input
                              className="bg-slate-600 border border-slate-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2"
                              id={field.id}
                              placeholder={field.label}
                              required
                              type={field.type}
                              defaultValue={
                                field.type == "datetime-local"
                                  ? moment().toNow()
                                  : ""
                              }
                              {...register(field.inputName)}
                            />
                          </div>
                        );
                      })}
                      <Button type="submit">Adicionar tarefa</Button>
                    </form>
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
