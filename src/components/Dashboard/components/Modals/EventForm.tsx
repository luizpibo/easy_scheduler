import { Button } from "flowbite-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useContext } from "react";
import { IEventDTO, SchedulerContext } from "../../context/SchedulerProvider";
import moment from "moment";

interface IEventForm {
  label: string;
  id: string;
  type: string;
  inputName: "title" | "description" | "start" | "duration";
}

const newEventForm: IEventForm[] = [
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

const EventForm = ({
  currentModal,
  closeModal,
}: {
  currentModal: string;
  closeModal: () => void;
}) => {
  const {
    handleAddEvent,
    handleEventUpdateWithIEventDTO,
    selectedEvent,
    handleDeleteEvent,
  } = useContext(SchedulerContext);
  const { register, handleSubmit } = useForm<IEventDTO>(
    currentModal == "alterar_tarefa"
      ? {
          defaultValues: {
            ...selectedEvent,
            start: moment(selectedEvent?.start).toDate(),
          },
        }
      : {}
  );

  const onSubmit: SubmitHandler<IEventDTO> = (data) => {
    console.log("Current modal", currentModal);
    switch (currentModal) {
      case "adicionar_tarefa":
        handleAddEvent(data);
        closeModal();
        break;
      case "alterar_tarefa":
        console.log("to alterando");
        handleEventUpdateWithIEventDTO(data);
        closeModal();
        break;
    }
  };

  return (
    <>
      <form className="grid gap-2 mb-4" onSubmit={handleSubmit(onSubmit)}>
        {newEventForm.map((field) => {
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

        <Button type="submit">
          {currentModal == "alterar_tarefa" ? "Alterar Tarefa" : "Criar Tarefa"}
        </Button>
      </form>
      {currentModal == "alterar_tarefa" && (
        <Button
          type="submit"
          onClick={(e) => {
            handleDeleteEvent(selectedEvent?.id as string);
            closeModal();
          }}
        >
          Apagar tarefa
        </Button>
      )}
    </>
  );
};

export default EventForm;
