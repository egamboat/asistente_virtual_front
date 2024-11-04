"use client";
import Reloj from "@/components/reloj/reloj";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventApi } from '@fullcalendar/core';
import esLocale from "@fullcalendar/core/locales/es";
import { FC } from "react";
import { DataEvento } from "@/app/data";
import { Evento } from "@/interfaces/interfaceEventos";
import MicrofonoBoton from '@/components/microfono/microfono';

const transformEvents = (event: Evento[]) => {
    return event.map(event => ({
        title: event.titulo,
        start: event.fechaInicio,
        end: event.fechaFin,
    }));
};

const Calendario: FC = () => {
    const events = transformEvents(DataEvento);

    const renderEventContent = (eventInfo: { timeText: string; event: EventApi }) => {
        return (
            <>
                <b>{eventInfo.timeText}</b>
                <i className="break-words overflow-hidden text-ellipsis whitespace-nowrap">{eventInfo.event.title}</i>
            </>
        );
    };

    return (
        <div className="h-full bg-white flex flex-col justify-between">
            <div className="flex justify-between w-full mt-4">
                <div className="ml-4">
                    <h1 className="text-3xl font-bold">
                        Calendario
                    </h1>
                </div>
                <div className="text-2xl mr-4">
                    <Reloj />
                </div>
            </div>
            <div className="flex items-center justify-center rounded-lg p-2  w-full">
                <div className="bg-gray-100 rounded-lg p-4 w-full max-w-2xl">
                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        weekends={true}
                        events={events}
                        locale={esLocale}
                        eventContent={renderEventContent}
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
