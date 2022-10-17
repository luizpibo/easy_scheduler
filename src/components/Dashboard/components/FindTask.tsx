import { Popover, Transition, Dialog, Combobox } from "@headlessui/react";
import { Button } from "flowbite-react";
import moment from "moment";
import { useContext, useState } from "react";
import { SchedulerContext } from "../context/SchedulerProvider";
const newTaskForm = [
  {
    label: "Buscar pelo título",
    id: "taskTitle",
    type: "text",
  },
];
const FindTask = () => {
  const {events, handleShowEventDetails} = useContext(SchedulerContext);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [query, setQuery] = useState('')
  return (
    <Popover className="z-20">
      <Popover.Button className="bg-slate-500 px-8 py-4 rounded-md shadow-lg transition hover:bg-slate-400 hover:shadow-xl text-gray-300 w-full">
        Procurar tarefa
      </Popover.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
        className="z-10"
      >
        <Popover.Panel className="transition m-auto absolute mt-4 px-4 py-3 bg-slate-500 rounded-lg shadow text-gray-300 w-screen max-w-sm transform -translate-x-32 lg:-translate-x-1/4">
            <Combobox value={selectedEvent} onChange={(e)=>{
              console.log("setSelectedEvent",e)
              handleShowEventDetails(e);
              setSelectedEvent(e);
            }}>
            <div className="flex items-center px-4">
              <Combobox.Input className="h-12 w-full border-0 text-sm text-gray-800 placeholder-gray-400 focus:ring-0" 
                placeholder="Digite o nome do evento..."
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>  
            <Combobox.Options>
              {events?.map((event)=>{
              return <Combobox.Option value={event.id} key={event.id}>
                <div className="flex justify-between px-4 py-3">
                  <h3>{event.title}</h3>
                  <p>{moment(event.start).format("D/M/YYYY - hh:mm")}</p>
                </div>
              </Combobox.Option>
              })}
            </Combobox.Options>
            </Combobox>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default FindTask;
