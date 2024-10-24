"use client";
import Reloj from "@/components/reloj/reloj";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventApi } from '@fullcalendar/core';
import { FC } from "react";

const events = [
    { title: 'Meeting', start: new Date() }
];

const Calendario: FC = () => {
    const renderEventContent = (eventInfo: { timeText: string; event: EventApi }) => {
        return (
            <>
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-between">
            <div className="flex justify-between w-full my-4">
                <div className="ml-4">
                    <h1 className="text-3xl font-bold">
                        Calendario
                    </h1>
                </div>
                <div className="text-2xl mr-4">
                    <Reloj />
                </div>
            </div>
            <div className="flex items-center justify-center rounded-lg p-2 max-h-[250px]">
                <div className="bg-gray-100 rounded-lg p-4 w-full max-w-2xl">
                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        weekends={false}
                        events={events}
                        locale="es"
                        eventContent={renderEventContent}
                        buttonText={{
                            today: 'Hoy',
                        }}
                        
                    />
                </div>
            </div>
            <div className="flex justify-center items-center">
                <button className="bg-gray-300 p-6 rounded-lg shadow-lg">
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
};

export default Calendario;
