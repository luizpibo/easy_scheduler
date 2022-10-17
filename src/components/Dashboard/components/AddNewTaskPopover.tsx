import { Popover, Transition } from "@headlessui/react";
import { Button } from "flowbite-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useContext } from "react";
import { SchedulerContext } from "../context/SchedulerProvider";
import moment from "moment";

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
    inputName: "title"
  },
  {
    label: "Descrição",
    id: "taskDescription",
    type: "text",
    inputName: "description"
  },
  {
    label: "Dia da tarefa",
    id: "taskDay",
    type: "datetime-local",
    inputName: "startDateTime"
  },
  {
    label: "Tempo de duração da tarefa em minutos",
    id: "taskDuration",
    type: "number",
    inputName: "duration"
  },
];

interface Inputs {
  title: string;
  description: string;
  startDateTime: Date;
  duration: number;
}


const PopoverButton = () => {
  const {handleAddEvent} = useContext(SchedulerContext);
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => {handleAddEvent(data)};
  return (
    <Popover className="z-20">
      <Popover.Button className="bg-slate-500 px-8 py-4 rounded-md shadow-lg hover:bg-slate-400 hover:shadow-xl text-gray-300 w-full">
        Adicionar Tarefa
      </Popover.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
        className="w-full flex-1"
      >
        <Popover.Panel className="absolute mt-4 px-4 py-3 bg-slate-500 rounded-lg shadow text-gray-300 w-screen max-w-sm transform lg:translate-x-1/4">
          <form className="grid gap-2" onSubmit={handleSubmit(onSubmit)}>
            {newTaskForm.map((field) => {
              return (
                <div className="relative" key={field.inputName}>
                  <label htmlFor={field.id} className="absolute hidden">
                    {field.label}
                  </label>
                  <input
                    className="bg-slate-600 border border-slate-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2"
                    id={field.id}
                    placeholder={field.label}
                    required
                    type={field.type}
                    defaultValue={field.type=="datetime-local"? moment().toNow(): ""}
                    {...register(field.inputName)}
                  />
                </div>
              );
            })}
            <Button type="submit">Adicionar tarefa</Button>
          </form>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default PopoverButton;
