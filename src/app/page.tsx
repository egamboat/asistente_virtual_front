"use client";
import 'regenerator-runtime/runtime';
import Reloj from "@/components/reloj/reloj";
import { useState } from "react";
import React from 'react';
import MicrofonoBoton from '@/components/microfono/microfono';

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
          <MicrofonoBoton />
      </div>
    </div >
  );
}

export default Home;