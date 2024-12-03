"use client";

import Reloj from "@/components/reloj/reloj";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { EventApi } from '@fullcalendar/core';

import esLocale from "@fullcalendar/core/locales/es";
import { FC, useEffect, useState } from "react";
import { Evento } from "@/interfaces/interfaceEventos";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import interactionPlugin from "@fullcalendar/interaction";
import { createGoogleCalendarEvent } from "@/utils/google_apis";
import { customFetch } from "@/components/refresh_token";

const Calendario: FC = () => {
  const [dataEvent, setEvents] = useState<any[]>([]);
  const [calendarId, setCalendarId] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("access_token") || "";
    setAccessToken(token);
  }, []); // Solo se ejecuta en el cliente

  // Transformar eventos del backend para FullCalendar
  const transformEvents = (events: Evento[]) => {
    return events.map(event => ({
      title: event.descripcion,
      start: event.fecha_inicio,
      end: event.fecha_fin || undefined,
      id: event.id.toString(),
      extendedProps: {
        modalidad_descripcion: event.modalidad_descripcion,
        tipo_evento: event.tipo_evento,
        modalidad: event.modalidad,
        descripcionCompleta: event.descripcion,
      },
    }));
  };

  // Cargar eventos del backend
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await customFetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}asistente/api/eventos/`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          const data = await response.json();
          const transformedEvents = transformEvents(data);
          setEvents(transformedEvents); // Guardar eventos transformados
        } else {
          console.error("Error al obtener eventos del backend");
        }
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
      }
    }

    fetchEvents();
  }, []);

  // Obtener calendarId desde localStorage
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setCalendarId(parsedUserData.email);
    } else {
      console.error("No hay un ID de calendario");
    }
  }, []);


  // Crear evento en Google Calendar
  const handleDateSelect = async (info: { startStr: string; endStr: string }) => {
    const title = prompt("Introduce el título del evento:");
    const description = prompt("Introduce una descripción del evento:");
    const location = prompt("Introduce la ubicación del evento:");

    if (title) {
      const newEvent = {
        summary: title,
        description,
        location,
        start: {
          dateTime: info.startStr,
          timeZone: "America/Guayaquil",
        },
        end: {
          dateTime: info.endStr,
          timeZone: "America/Guayaquil",
        },
      };

      const response = await createGoogleCalendarEvent(calendarId, accessToken, newEvent);

      if (response.success) {
        alert(response.message);
      } else {
        alert(`Error al crear el evento: ${response.message}`);
      }
    } else {
      alert("No se puede crear un evento sin título.");
    }
  };
  
  // const googleCalendarApiKey = `${process.env.GOOGLE_CALENDAR_API_KEY}`;

  return (
    <div className="h-full bg-white flex flex-col justify-between">
      <div className="flex justify-between w-full mt-4">
        <div className="ml-4">
          <h1 className="text-3xl font-bold">Calendario</h1>
        </div>
        <div className="text-2xl mr-4">
          <Reloj />
        </div>
      </div>

      <div className="flex items-center justify-center rounded-lg pb-2 w-full">
        <div className="bg-gray-100 rounded-lg p-2 w-full mx-w-xl md:max-w-2xl">
          <FullCalendar
            plugins={[dayGridPlugin, googleCalendarPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            googleCalendarApiKey="AIzaSyCXuApDtC5wOYXXY6T2FYaceYG23tUAdV8"
            weekends={true}
            locale={esLocale}
            selectable={true}
            select={(dataEvent) => {
              handleDateSelect(dataEvent);
            }}
            // Configuración de múltiples fuentes de eventos
            eventSources={[
              {
                events: dataEvent, // Eventos del backend
              },
              {
                googleCalendarId: calendarId, // Eventos de Google Calendar
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendario;
