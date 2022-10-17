import { EventDef } from "@fullcalendar/common";
import { Popover, Transition } from "@headlessui/react";
import { Button } from "flowbite-react";
import { useState } from "react";

const newTaskForm = [
  {
    label: "Buscar pelo título",
    id: "taskTitle",
    type: "text",
  },
];
const FindTask = () => {
  const [task, setTask] = useState<EventDef>();

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
          <form className="grid gap-2">
            {newTaskForm.map((field) => {
              return (
                <div className="relative" key={field.label}>
                  <label htmlFor={field.id} className="absolute hidden">
                    {field.label}
                  </label>
                  <input
                    className="bg-slate-600 border border-slate-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2"
                    id={field.id}
                    placeholder={field.label}
                    required
                    type={field.type}
                  />
                </div>
              );
            })}
            <Button type="submit">Procurar tarefa</Button>
          </form>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default FindTask;
