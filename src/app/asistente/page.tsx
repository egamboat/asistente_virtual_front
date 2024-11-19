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

  const handleTranscriptionComplete = (transcribedText: string) => {
    if (transcribedText && transcribedText.trim() !== '') {
      console.log("Transcripción completada:", transcribedText);
      append({ role: 'user', content: transcribedText });
      console.log("Mensajes después de append:", messages);
    }
  };

  const handleDataSend = (data: any) => {
    console.log("Llegó:", data)
    // fetch('/api/saveEvent', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log('Éxito:', data);
    //     // Opcional: Proporcionar retroalimentación al usuario o actualizar el estado
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });
  };

  const handleEditEventWrapper = async (transcribedText: string) => {
    try {
      const message = {
        role: "user" as const, // Aseguramos el tipo estático
        content: transcribedText,
      };
      await handleEditEvent(message, async (msg) => {
        await append(msg); // Espera la promesa devuelta por append
      });
    } catch (error) {
      console.error("Error en handleEditEventWrapper:", error);
    }
  };

  const handleDeleteEventWrapper = async (transcribedText: string) => {
    try {
      const message = {
        role: "user" as const,
        content: transcribedText,
      };
      await handleDeleteEvent(message, async (msg) => {
        await append(msg); // Maneja correctamente el retorno
      });
    } catch (error) {
      console.error("Error en handleDeleteEventWrapper:", error);
    }
  };

  const handleConsultEventsWrapper = async (transcribedText: string) => {
    try {
      const message = {
        role: "user" as const,
        content: transcribedText,
      };
      await handleConsultEvents(message, async (msg) => {
        await append(msg); // Maneja correctamente el retorno
      });
    } catch (error) {
      console.error("Error en handleConsultEventsWrapper:", error);
    }
  };

  // Función para procesar el contenido del mensaje de la API
  const processAssistantMessage = (messageContent: string): ProcessedContent => {
    try {

      const jsonStart = messageContent.indexOf("JSON:");
      const jsonEnd = messageContent.indexOf("}", jsonStart) + 1;
      const jsonPart = messageContent.slice(jsonStart + 5, jsonEnd).trim();
      const parsedJson = JSON.parse(jsonPart);

      const userMessageStart = messageContent.indexOf("Respuesta al usuario:") + 22;
      const userMessage = messageContent.slice(userMessageStart).trim();

      const isComplete = parsedJson.completo;

      // Retornar los datos procesados sin actualizar el estado
      return { json: parsedJson, userMessage, isComplete };
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

      if (processedContent.isComplete && processedContent.json) {
        const dataSend = {
          // id: processedContent.json.id,
          // agendaId: processedContent.json.agendaId,
          titulo: processedContent.json.titulo,
          tipoEventoId: processedContent.json.tipoEventoId,
          descripcion: processedContent.json.descripcion,
          fechaInicio: processedContent.json.fechaInicio,
          fechaFin: processedContent.json.fechaFin,
          modalidad: processedContent.json.modalidad,
          // completo: processedContent.json.completo,
        };
        handleDataSend(dataSend);
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


              // Ahora TypeScript reconoce las propiedades opcionales
              return (
                <div key={m.id} className={`flex ${isAssistant ? "justify-start" : "justify-end"} mb-2`}>
                  <div className={`max-w-[75%] p-2 rounded-md ${isAssistant ? "bg-gray-800" : "bg-[#D9D9D9]"}`}>
                    <span className={`text-xs block ${isAssistant ? "text-right" : "text-left"}`}>
                      {isAssistant ? "Nomi" : "Tú"}
                    </span>
                    <div className={`mt-1 ${isAssistant ? "text-white" : "text-black"}`}>
                      <p>{processedContent.userMessage}</p>
                      {/* {processedContent.json && (
                        <pre className="bg-gray-700 p-2 rounded-md text-xs mt-2">
                          {JSON.stringify(processedContent.json, null, 2)}
                        </pre>
                      )} */}
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
          onEditEvent={(transcribedText: string) => {
            handleEditEventWrapper(transcribedText)
              .then(() => console.log("Edición completada"))
              .catch((err) => console.error("Error en edición:", err));
          }}
          onDeleteEvent={(transcribedText: string) => {
            handleDeleteEventWrapper(transcribedText)
              .then(() => console.log("Eliminación completada"))
              .catch((err) => console.error("Error en eliminación:", err));
          }}
          onConsultEvents={(transcribedText: string) => {
            handleConsultEventsWrapper(transcribedText)
              .then(() => console.log("Consulta completada"))
              .catch((err) => console.error("Error en consulta:", err));
          }}
        />

      </div>
    </div >
  );
}
export default Home;
