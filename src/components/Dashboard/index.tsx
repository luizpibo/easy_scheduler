import { logout } from "../../contexts/AuthContexts";
import Scheduler from "../Scheduler";

const Dashboard = () => {
  return (
    <div className="container m-auto flex flex-col lg:flex-row flex-1 bg-opacity-75 bg-gray-500 w-full p-4 rounded gap-5 shadow-xl relative">
      <div className="flex gap-4 w-full lg:w-1/4 lg:flex-col my-4">
        <button
          className="bg-slate-500 px-8 py-4 rounded-md shadow-lg transition hover:bg-slate-400 hover:shadow-xl text-gray-300"
          data-bs-toggle="modal"
          data-bs-target="#newEvent"
        >
          criar nova tarefa
        </button>
        <button
          onClick={logout}
          className="bg-slate-500 px-8 py-4 rounded-md shadow-lg transition hover:bg-slate-400 hover:shadow-xl text-gray-300"
        >
          Logout
        </button>
      </div>

      <div className="flex-col flex-1">
        <div className="rounded bg-gray-900 p-4 shadow-lg text-gray-200">
          <Scheduler />
        </div>
      </div>

      <div
        className="bg-black bg-opacity-40 modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
        id="newEvent"
        aria-labelledby="newEventLabel"
        tabIndex={-1}
        aria-hidden
        aria-modal
      >
        <button
          type="button"
          className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
          data-bs-dismiss="modal"
          aria-label="Close"
        >
          fechar
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
