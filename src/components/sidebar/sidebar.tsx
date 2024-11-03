"use client";
import React, { useState } from "react";
import Link from "next/link";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`flex`}>
      <div className={`bg-[#234AB7] text-white h-full p-6 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`} >
        <button
          className=""
          onClick={toggleSidebar}
        >
          {isCollapsed ? "O" : "X"}
        </button>

        {!isCollapsed && (
                  <div
          className={`transition-opacity duration-300 ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}>

            <h2 className="text-[1rem] font-bold pt-6 mb-6 break-words">
              noMi
            </h2>
            <nav className="mt-6 p-2">
              <ul>
                <li className="my-6">
                  <Link href="/">
                    <p className="hover:text-gray-300">Inicio</p>
                  </Link>
                </li>
                <li className="my-6">
                  <Link href="/calendario">
                    <p className="hover:text-gray-300">Calendario</p>
                  </Link>
                </li>
                <li className="my-6">
                  <Link href="/agenda">
                    <p className="hover:text-gray-300">Agenda</p>
                  </Link>
                </li>
                <li className="my-6">
                  <Link href="/perfil">
                    <p className="hover:text-gray-300">Perfil</p>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

    </div>
  );
};

export default Sidebar;
