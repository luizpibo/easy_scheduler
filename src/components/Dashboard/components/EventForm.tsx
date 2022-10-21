import { Button } from "flowbite-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useContext } from "react";
import { Inputs, SchedulerContext } from "../context/SchedulerProvider";
import moment from "moment";

interface Task {
  label: string;
  id: string;
  type: string;
  inputName: "title" | "description" | "start" | "duration";
}

const newTaskForm: Task[] = [
  {
    label: "Título da tarefa",
    id: "title",
    type: "text",
    inputName: "title",
  },
  {
    label: "Descrição",
    id: "description",
    type: "text",
    inputName: "description",
  },
  {
    label: "Dia da tarefa",
    id: "start",
    type: "datetime-local",
    inputName: "start",
  },
  {
    label: "Tempo de duração da tarefa em minutos",
    id: "duration",
    type: "number",
    inputName: "duration",
  },
];

const EventForm = ({currentModal}:{currentModal: string}) => {
  const { handleAddEvent, handleEventUpdateWithInputs, selectedEvent } = useContext(SchedulerContext);
  const { register, handleSubmit } = useForm<Inputs>(currentModal == "alterar_tarefa"?{defaultValues: {...selectedEvent, start: moment(selectedEvent?.start).toDate()}}:{});
  
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log("Current modal", currentModal)
    switch(currentModal){
      case "adicionar_tarefa":
        handleAddEvent(data);
        break;
      case "alterar_tarefa":
        console.log("to alterando")
        handleEventUpdateWithInputs(data);
        break;
    }
  };

  return (
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
              {...register(field.inputName)}

            />
          </div>
        );
      })}

      <Button type="submit">{currentModal=="alterar_tarefa"? "Alterar Tarefa": "Criar Tarefa"}</Button>
      {currentModal=="alterar_tarefa" && <Button type="submit">Apagar tarefa</Button>}
    </form>
  );
};

export default EventForm;
