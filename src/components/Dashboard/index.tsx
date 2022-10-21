import { useState } from "react";
import HeaderButtons from "./components/HeaderButtons";
import Modals from "./components/Modals";
import Scheduler from "./components/Scheduler";
import SchedulerProvider from "./context/SchedulerProvider";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentModal, setModal] = useState("buscar_tarefa")

  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal = () => {
    setIsOpen(true);
  };
  const setCurrentModal = (modalName: string) => {
    setModal(modalName);
    openModal();
  };

  console.log("Renderizou")
  return (
    <SchedulerProvider>
      <div className="container m-auto flex flex-col flex-1 bg-opacity-75 bg-gray-500 w-full p-4 rounded gap-5 shadow-xl relative">
        <HeaderButtons setCurrentModal={setCurrentModal}/>
        <Scheduler setCurrentModal={setCurrentModal}/>
        <Modals closeModal={closeModal} isOpen={isOpen} currentModal={currentModal}/>
      </div>
    </SchedulerProvider>
  );
};

export default Dashboard;
