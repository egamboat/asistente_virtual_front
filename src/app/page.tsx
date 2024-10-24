"use client";
import Reloj from "@/components/reloj/reloj";
import { useState } from "react";

const Home = () => {


  return (
    <div className="h-full bg-white flex flex-col justify-between">
      <div className="flex justify-between w-full">
        <div className="ml-4">
          <h1 className="text-3xl font-bold">
            Asistente Virtual
          </h1>
        </div>
        <div className="text-2xl mr-4">
          <Reloj />
        </div>
      </div>
      {/* Chat container */}
      <div className="flex-1 flex justify-start items-end pb-4">
        <div className="bg-purple-200 text-black p-4 rounded-lg shadow-lg border mb-6">
          ¿Ocupado? ¡Te ayudo!
        </div>
      </div>

      {/* Botón de micrófono */}
      <div className="flex justify-center items-center">
        <button className="bg-gray-300 p-6 rounded-lg shadow-lg ">
          {/* <img src="/public/media/imagens/mic.png" alt=""  className="w-8 h-8"  /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-8 h-8"
          >
            <path d="M12 1c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2s-2-.9-2-2V3c0-1.1.9-2 2-2zm5 9V9h-2v1c0 1.7-1.3 3-3 3s-3-1.3-3-3V9H7v1c0 2.4 1.7 4.4 4 4.9V17H8v2h8v-2h-3v-2.1c2.3-.5 4-2.5 4-4.9z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Home;