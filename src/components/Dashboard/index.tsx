import { logout } from "../../contexts/AuthContexts";
import Scheduler from "../Scheduler";
import AddNewTaskPopover from "./components/AddNewTaskPopover";
import FindTask from "./components/FindTask";
import SchedulerProvider from "./context/SchedulerProvider";

const Dashboard = () => {
  return (
    <SchedulerProvider>
      <div className="container m-auto flex flex-col flex-1 bg-opacity-75 bg-gray-500 w-full p-4 rounded gap-5 shadow-xl relative">
        <div className="flex gap-4 w-full justify-center my-4 align-middle">
          <AddNewTaskPopover />
          <FindTask />
          <button
            onClick={logout}
            className="bg-slate-500 px-8 py-4 rounded-md shadow-lg transition hover:bg-slate-400 hover:shadow-xl text-gray-300"
          >
            Logout
          </button>
        </div>
        <div className="flex-col flex-1">
          <Scheduler />
        </div>
      </div>
    </SchedulerProvider>
  );
};

export default Dashboard;
