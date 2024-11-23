"use client";
import 'regenerator-runtime/runtime';
import Reloj from "@/components/reloj/reloj";
import React, { useEffect, useState } from 'react';
import MicrofonoBoton from '@/components/microfono/microfono';
import { useChat } from "ai/react";
import {
  // handleCreateEvent,
  handleEditEvent,
  handleDeleteEvent,
  handleConsultEvents,
} from "@/utils/servicios"
import { customFetch } from '@/components/refresh_token';
import { toast } from 'react-toastify';

interface ProcessedContent {
  userMessage: string;
  // eslint-disable-next-line
  json?: any;
  isComplete: boolean;
}

const Home: React.FC = () => {
  const [processedJson, setProcessedJson] = useState(null);
  const { messages, append } = useChat();
  const [isComplete, setIsComplete] = useState(false);
  const [dataSent, setDataSent] = useState(false);
  const handleTranscriptionComplete = async (transcribedText: string) => {
    if (transcribedText && transcribedText.trim() !== '') {
      console.log("Transcripción completada:", transcribedText);
      await append({ role: 'user', content: transcribedText });
      console.log("Mensajes después de append:", messages);
    }
  };

  const handleDataSend = (data: any) => {

    if (!data.fecha_fin || data.fecha_fin.trim() === '') {
      data.fecha_fin = data.fecha_inicio;
    }
    async function sendDataToBackend() {
      const url = 'http://localhost:8000/asistente/api/eventos/';

      try {
        const response = await customFetch(url, {
          method: 'POST',
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Respuesta del backend:', data);
          toast.success('Reunión agendada con éxito')
        } else {
          const errorData = await response.json();
          console.error('Error del backend:', errorData);
          toast.error('Error al enviar los datos al backend')
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        toast.error('Hubo un error al conectar con el backend')
      }
    }

    sendDataToBackend();
  };

  const handleCommandWrapper = async (
    transcribedText: string,
    handler: (message: any, append: (msg: any) => Promise<void>) => Promise<void>
  ) => {
    try {
      await append({ role: 'user', content: transcribedText });

      const message = {
        role: "user" as const,
        content: transcribedText,
      };
      await handler(message, async (msg) => {
        await append(msg);
      });
    } catch (error) {
      console.error("Error en handleCommandWrapper:", error);
    }
  };

  const handleEditEventWrapper = async (transcribedText: string) => {
    await handleCommandWrapper(transcribedText, handleEditEvent);
  };

  const handleDeleteEventWrapper = async (transcribedText: string) => {
    await handleCommandWrapper(transcribedText, handleDeleteEvent);
  };

  const handleConsultEventsWrapper = async (transcribedText: string) => {
    await handleCommandWrapper(transcribedText, handleConsultEvents);
  };


  const processAssistantMessage = (messageContent: string): ProcessedContent => {
    try {
      // Utilizar una expresión regular para extraer el JSON
      const jsonMatch = messageContent.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const jsonPart = jsonMatch[0];
        const parsedJson = JSON.parse(jsonPart);
        const isComplete = parsedJson.completo;

        // Obtener el resto del mensaje después del JSON
        const userMessage = messageContent.slice(jsonMatch.index! + jsonPart.length).trim();

        return { json: parsedJson, userMessage, isComplete };
      } else {
        // No se encontró JSON, devolver todo el mensaje como userMessage
        return { userMessage: messageContent, isComplete: false };
      }
    } catch (error) {
      console.error("Error procesando el mensaje del asistente:", error);
      return { userMessage: messageContent, isComplete: false };
    }
  };


  useEffect(() => {
    const assistantMessages = messages.filter((m) => m.role === "assistant");
    if (assistantMessages.length > 0) {
      const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
      const processedContent = processAssistantMessage(lastAssistantMessage.content);

      setProcessedJson(processedContent.json);
      setIsComplete(processedContent.isComplete);

      if (processedContent.isComplete && processedContent.json && !dataSent) {
        const dataSend = {
          // id: processedContent.json.id,
          // agendaId: processedContent.json.agendaId,
          descripcion: processedContent.json.descripcion,
          fecha_inicio: processedContent.json.fecha_inicio,
          fecha_fin: processedContent.json.fecha_fin,
          tipo_evento: processedContent.json.tipo_evento,
          modalidad: processedContent.json.modalidad,
          // completo: processedContent.json.completo,
        };
        handleDataSend(dataSend);
        setDataSent(true);
      }
    }
  }, [messages]);



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
          <div className="text-white">
            {messages.map((m) => {
              const isAssistant = m.role === "assistant";
              const processedContent: ProcessedContent = isAssistant
                ? processAssistantMessage(m.content)
                : { userMessage: m.content, isComplete: false };


              return (
                <div key={m.id} className={`flex ${isAssistant ? "justify-start" : "justify-end"} mb-2`}>
                  <div className={`max-w-[75%] p-2 rounded-md ${isAssistant ? "bg-gray-800" : "bg-[#D9D9D9]"}`}>
                    <span className={`text-xs block ${isAssistant ? "text-right" : "text-left"}`}>
                      {isAssistant ? "Nomi" : "Tú"}
                    </span>
                    <div className={`mt-1 ${isAssistant ? "text-white" : "text-black"}`}>
                      <p>{processedContent.userMessage}</p>
                    </div>
                  </div>
                </div>

              );
            })}

          </div>
        </div>
      </div>

      <div className="flex justify-center items-center my-4">
        <MicrofonoBoton
          onTranscriptionComplete={handleTranscriptionComplete}
        />

      </div>
    </div >
  );
}
export default Home;
