"use client";
import 'regenerator-runtime/runtime';
import Reloj from "@/components/reloj/reloj";
import React from 'react';
import MicrofonoBoton from '@/components/microfono/microfono';
import { useChat } from "ai/react";

const Home: React.FC = () => {

  const { messages, setInput, handleSubmit } = useChat();
  console.log("Mensaje index", messages)
  const handleTranscriptionComplete = (transcribedText: string) => {
    if (transcribedText && transcribedText.trim() !== '') {
      setInput(transcribedText);
      const syntheticEvent = { preventDefault: () => { } };
      handleSubmit(syntheticEvent as React.FormEvent<HTMLFormElement>);
      console.log("Mensaje enviado:", transcribedText);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col justify-between">
      <div className="flex justify-between w-full mt-4">
        <div className="ml-4">
          <h1 className="text-3xl font-bold">
            Asistente Virtual
          </h1>
        </div>
        <div className="text-2xl m-8">
          <Reloj />
        </div>
      </div>
      <div className="flex-1 flex flex-col mt-4">
        <div className="flex-1 overflow-y-auto">
          {/* Initial message */}
          <div className="flex justify-start">

            <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg mb-6 text-right">
              <span className={`text-xs block`} >
                Nomi
              </span>
              ¿Ocupado? ¡Te ayudo!
            </div>
          </div>

          {/* Chat messages */}
          <div className="text-white">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "assistant" ? "justify-start" : "justify-end"} mb-2`}
              >
                <div
                  className={`max-w-[75%] p-2 rounded-md ${m.role === "assistant"
                    ? "bg-gray-800"
                    : "bg-[#D9D9D9]"
                    }`}
                >
                  <span
                    className={`text-xs block ${m.role === "assistant" ? "text-right" : "text-left"
                      }`}
                  >
                    {m.role === "assistant" ? "Nomi" : "Tú"}
                  </span>
                  <div className={`mt-1 ${m.role === "assistant" ? "text-white" : "text-black"
                    }`}>
                    {m.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        {/* <form onSubmit={handleSubmit} className="max-w-xl w-full mt-auto">
          <div className="flex justify-between my-4">
            <button
              className="bg-blue-600 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
              disabled={isLoading || !input}
            >
              Enviar
            </button>
          </div>
          <textarea
            rows={2}
            value={input}
            onChange={handleInputChange}
            className="text-black bg-slate-300 px-2 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="¿Qué deseas hacer?"
            autoFocus
          />
        </form> */}
      </div>
      {/* Botón de micrófono */}
      <div className="flex justify-center items-center my-4">
        <MicrofonoBoton onTranscriptionComplete={handleTranscriptionComplete} />
      </div>
    </div >
  );
}
export default Home;
