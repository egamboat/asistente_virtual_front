"use client";
import 'regenerator-runtime/runtime';
import Reloj from "@/components/reloj/reloj";
import React, { useEffect, useState } from 'react';
import MicrofonoBoton from '@/components/microfono/microfono';
import { useChat } from "ai/react";
import { handleEditEvent, handleDeleteEvent, handleConsultEvents } from "@/utils/servicios"
import { customFetch } from '@/components/refresh_token';
import { toast } from 'react-toastify';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';
import { formatInTimeZone } from 'date-fns-tz'
import { updateEventWithGoogleId } from '@/utils/funciones';

interface ProcessedContent {
  userMessage: string;
  json?: any;
  isComplete: boolean;
}

const Home: React.FC = () => {
  const { messages, append } = useChat();
  const [isComplete, setIsComplete] = useState(false);
  const [dataSent, setDataSent] = useState(false);
  const [currentAction, setCurrentAction] = useState<number | null>(null);
  const { addEvent, timeZone } = useGoogleCalendar();
  const [idEventoAgregado, setIdEventoAgregado] = useState<number>(0)

  const handleTranscriptionComplete = async (transcribedText: string) => {
    if (transcribedText && transcribedText.trim() !== '') {
      console.log("Transcripción completada:", transcribedText);
      setDataSent(false);

      await append({ role: 'user', content: transcribedText });
    }
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel(); // Detiene cualquier síntesis en curso
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-419';
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };


  const handleDataSend = async (data: any) => {
    if (!data.fecha_fin || data.fecha_fin.trim() === '') {
      data.fecha_fin = data.fecha_inicio;
    }

    // Función para enviar datos a tu backend
    async function sendDataToBackend() {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}asistente/api/eventos/`;

      try {
        const response = await customFetch(url, {
          method: 'POST',
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const dataResponse = await response.json();
          setIdEventoAgregado(dataResponse.id)
          toast.success('Reunión agendada con éxito');
        } else {
          const errorData = await response.json();
          console.error('Error del backend:', errorData);
          toast.error('Error al enviar los datos al backend');
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        toast.error('Ocurrió un error al realizar la solicitud.');
      }
    }

    // Llamada a la función para enviar datos al backend
    await sendDataToBackend();

    const eventData = {
      summary: data.titulo || 'Evento',
      location: data.modalidad || '',
      description: data.descripcion || '',
      start: {
        dateTime: data.fecha_inicio,
        timeZone: timeZone,
      },
      end: {
        dateTime: data.fecha_fin,
        timeZone: timeZone,
      },
    };

    // Enviar evento a Google Calendar
    try {
      const result = await addEvent(eventData);
      console.log('Evento agregado a Google Calendar:', result);
      toast.success('Evento agregado a Google Calendar');

      const googleEventId = result.id;
      data.google_event_id = googleEventId;

      await updateEventWithGoogleId(idEventoAgregado, googleEventId);
    } catch (error) {
      console.error('Error al agregar evento a Google Calendar:', error);
      toast.error('Error al agregar evento a Google Calendar');
    }
  };

  const processAssistantMessage = (messageContent: string): ProcessedContent => {
    try {
      const jsonMatch = messageContent.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const jsonPart = jsonMatch[0];
        const parsedJson = JSON.parse(jsonPart);
        const isComplete = parsedJson.completo;
        const userMessage = messageContent.slice(jsonMatch.index! + jsonPart.length).trim();

        return { json: parsedJson, userMessage, isComplete };
      } else {
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

      setIsComplete(processedContent.isComplete);

      if (processedContent.userMessage) {
        const delay = 500;
        setTimeout(() => {
          speak(processedContent.userMessage);
        }, delay);
      }


      if (processedContent.isComplete && processedContent.json && !dataSent && currentAction === 1) {
        const dataSend = {
          titulo: processedContent.json.titulo,
          descripcion: processedContent.json.descripcion,
          fecha_inicio: processedContent.json.fecha_inicio,
          fecha_fin: processedContent.json.fecha_fin,
          tipo_evento: processedContent.json.tipo_evento,
          modalidad: processedContent.json.modalidad,
        };
        handleDataSend(dataSend);
        setDataSent(true);
      }
    }
  }, [messages]);

  const handleAccion = (identifier: number) => {
    setCurrentAction(identifier);
    switch (identifier) {
      case 1:
        console.log("Comando: Crear");
        break;
      case 2:
        console.log("Comando: Consultar");
        break;
      case 3:
        console.log("Comando: Editar");
        break;
      case 4:
        console.log("Comando: Eliminar");
        break;
      default:
        console.log("Otros");
        break;
    }
  };
  console.log("Accion actual", currentAction)
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

            <div className="bg-gray-800 text-white p-2 rounded-md shadow-lg mb-6 text-right">
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
          DataEnviada={setDataSent}
          accionIdentificada={handleAccion}
        />
      </div >
    </div >
  );
}
export default Home;
