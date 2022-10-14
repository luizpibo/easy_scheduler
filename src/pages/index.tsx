import type { NextPage } from "next";
import { login, logout } from "../contexts/AuthContexts";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import Calendar from "react-calendar";
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

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
    <div className="flex flex-col bg-slate-800 min-h-screen items-center justify-center py-8 gap-4">
      <h1 className="text-3xl text-gray-300 font-bold">Tasks To Do Calendar</h1>
      {
      logged ? (
        <>
          <div className="container m-auto flex flex-1 bg-opacity-75 bg-gray-500 w-full p-4 rounded gap-5 shadow-xl">
            <div className="flex flex-col w-full gap-4 md:w-1/3">
              <button
                className="bg-slate-500 px-8 py-4 rounded-md shadow-lg transition hover:bg-slate-400 hover:shadow-xl text-gray-300"
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
                <FullCalendar
                  plugins={[ dayGridPlugin ]}
                  initialView="dayGridMonth"
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <button onClick={login} className="bg-slate-500 px-8 py-4 rounded-md">
            Login{" "}
          </button>
        </>
      )
      }
    </div>
  )
};

export default Home;
