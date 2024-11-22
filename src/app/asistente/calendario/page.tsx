"use client";
import Reloj from "@/components/reloj/reloj";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventApi } from '@fullcalendar/core';
import esLocale from "@fullcalendar/core/locales/es";
import { FC, useEffect, useState } from "react";
import { Evento } from "@/interfaces/interfaceEventos";
import MicrofonoBoton from '@/components/microfono/microfono';
import { customFetch } from "@/components/refresh_token";

const Calendario: FC = () => {
  const [dataEvent, setEvents] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

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
        descripcionCompleta: event.descripcion, // Agregamos la descripción completa aquí
      },
    }));
  };

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await customFetch(`${process.env.NEXT_PUBLIC_BASE_URL}asistente/api/eventos/`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          const errorData = await response.json();
          setError(errorData);
          console.error('Error al obtener los eventos:', errorData);
        }
      } catch (error) {
        setError(error);
        console.error('Error al realizar la solicitud:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const renderEventContent = (eventInfo: { timeText: string; event: EventApi }) => {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i className="break-words overflow-hidden text-ellipsis whitespace-nowrap">
          {eventInfo.event.title}
        </i>
      </>
    );
  };

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
        <div className="bg-gray-100 rounded-lg p-2 w-full max-w-xl md:max-w-2xl">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            events={transformEvents(dataEvent)}
            locale={esLocale}
            eventContent={renderEventContent}
            eventDidMount={(info) => {
              // Agregamos el tooltip aquí
              const tooltip = document.createElement('div');
              tooltip.innerHTML = info.event.extendedProps.descripcionCompleta;
              info.el.setAttribute('title', tooltip.textContent || '');
            }}
            dayHeaderClassNames="capitalize"
            buttonText={{
              today: 'Hoy',
            }}
            titleFormat={{ year: 'numeric', month: 'long' }}
          />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <MicrofonoBoton />
      </div>
    </div>
  );
};

export default Calendario;
