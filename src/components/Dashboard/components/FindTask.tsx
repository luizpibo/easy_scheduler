import { Combobox } from "@headlessui/react";
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
  const { events, handleShowEventDetails, setSelectedEvent } = useContext(SchedulerContext);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  return (
    <Combobox
      value={selected}
      onChange={(e) => {
        console.log("selected event",e);
        handleShowEventDetails(e);
      }}
    >
      <div className="flex items-center px-4">
        <Combobox.Input
          className="h-12 w-full border-0 text-sm text-gray-800 placeholder-gray-400 focus:ring-0"
          placeholder="Digite o nome do evento..."
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <Combobox.Options>
        {events?.map((event) => {
          return (
            <Combobox.Option value={event.id} key={event.id}>
              <div className="flex justify-between px-4 py-3">
                <h3>{event.title}</h3>
                <p>{moment(event.start).format("D/M/YYYY - hh:mm")}</p>
              </div>
            </Combobox.Option>
          );
        })}
      </Combobox.Options>
    </Combobox>
  );
};

export default FindTask;
