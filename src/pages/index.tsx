import type { NextPage } from "next";
import { login, logout } from "../contexts/AuthContexts";
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import Scheduler from "../components/Scheduler";
import Dashboard from "../components/Dashboard";
import { Navbar } from "flowbite-react";

const Home: NextPage = () => {
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setLogged(true);
      } else {
        setLogged(false);
      }
    });
  }, []);

  return (
    <div className="flex flex-col bg-slate-800 min-h-screen items-center justify-center py-8 gap-4 relative">
      <h1 className="text-3xl text-gray-300 font-bold">To-Do Schedule</h1>
      {logged ? (
        <Dashboard />
      ) : (
        <>
          <button onClick={login} className="bg-slate-500 px-8 py-4 rounded-md">
            Login{" "}
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
