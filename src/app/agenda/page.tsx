"use client";

import Reloj from "@/components/reloj/reloj";
import React from 'react';
import { Evento } from "@/interfaces/interfaceEventos";
import { DataEvento } from "@/app/data";
import MicrofonoBoton from '@/components/microfono/microfono';

type EventsTableProps = {
    events: Evento[];
};

const Agenda: React.FC<EventsTableProps> = ({ events: any }) => {

    const formatDate = (date: string | Date) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    return (
        <div className="h-fulll bg-white flex flex-col justify-between">
            <div className="flex justify-between w-full mt-4">
                <div className="ml-4">
                    <h1 className="text-3xl font-bold">
                        Agenda
                    </h1>
                </div>
                <div className="text-2xl mr-4">
                    <Reloj />
                </div>
            </div>


            <div className="overflow-x-auto p-4  mt-32">
                <table className="min-w-full bg-[#D9D9D9]">
                    <thead className="">
                        <tr className="">
                            <th className="p-3 text-left font-semibold border-b">Evento</th>
                            <th className="p-3 text-left font-semibold border-b">Información</th>
                            <th className="p-3 text-left font-semibold border-b">Fecha Inicio</th>
                            <th className="p-3 text-left font-semibold border-b">Fecha Fin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataEvento.map((event: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="p-3 text-gray-800">{event.titulo}</td>
                                <td className="p-3 text-gray-800">{event.descripcion}</td>
                                <td className="p-3 text-gray-800">{formatDate(event.fechaInicio)}</td>
                                <td className="p-3 text-gray-800">{formatDate(event.fechaFin)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center">
                <MicrofonoBoton />
            </div>
        </div>
    );
}

export default Agenda;
