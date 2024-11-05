"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react"

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { data: session } = useSession();
  console.log(session)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <div className={`flex`}>
        <div className={`bg-[#234AB7] text-white h-full p-6 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`} >
          <button
            className=""
            onClick={toggleSidebar}
          >
            {isCollapsed ? "☰" : (
              <i className="ri-close-large-line"></i>
            )}
          </button>

          {!isCollapsed ? (
            <div
              className={`transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"
                } flex flex-col h-full`}>

              <h2 className="text-[1rem] font-bold pt-6 mb-6 break-words">
                noMi
              </h2>

              <div className="mt-6 p-2 flex-grow">
                <ul>
                  <li className="my-6">
                    <Link href="/asistente/">
                      <p className="hover:text-gray-300">Inicio</p>
                    </Link>
                  </li>
                  {session?.user ? (
                    <>
                      <li className="my-6">
                        <Link href="/asistente/calendario">
                          <p className="hover:text-gray-300">Calendario</p>
                        </Link>
                      </li>
                      <li className="my-6">
                        <Link href="/asistente/agenda">
                          <p className="hover:text-gray-300">Agenda</p>
                        </Link>
                      </li>
                      <li className="my-6">
                        <Link href="/asistente/perfil">
                          <p className="hover:text-gray-300">Perfil</p>
                        </Link>
                      </li>
                    </>
                  ) : null}
                </ul>
              </div>

              {session?.user ? (
                <div className="mt-auto p-2">
                  <img src={session.user.image ?? ""} alt="" className="w-10 h-10 rounded-full cursor-pointer" />
                  <button onClick={async () => await signOut({ callbackUrl: "/" })}
                    className="hover:text-gray-300 my-6 font-bold">
                    Cerrar Sesión
                    <i className="ml-2 ri-logout-box-line font-normal"></i>
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div
              className="transition-opacity duration-200 flex flex-col h-full">
              {session?.user ? (
                <div className="mt-auto">
                  <button onClick={() => signOut({ callbackUrl: "/" })}
                    className="hover:text-gray-300 my-6">
                    <i className="ri-logout-box-line"></i>
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div >
    </>
  );
};

export default Sidebar;
