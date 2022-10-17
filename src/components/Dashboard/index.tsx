import HeaderButtons from "./components/HeaderButtons";
import Scheduler from "./components/Scheduler";
import SchedulerProvider from "./context/SchedulerProvider";

const Dashboard = () => {
  return (
    <SchedulerProvider>
      <div className="container m-auto flex flex-col flex-1 bg-opacity-75 bg-gray-500 w-full p-4 rounded gap-5 shadow-xl relative">
        <HeaderButtons />
        <Scheduler />
      </div>
    </SchedulerProvider>
  );
};

export default Dashboard;
