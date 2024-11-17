"use client";

import Reloj from "@/components/reloj/reloj";
import React from 'react';
// import { Evento } from "@/interfaces/interfaceEventos";
import { DataEvento } from "@/app/data";
import MicrofonoBoton from '@/components/microfono/microfono';

const Agenda: React.FC = () => {
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


            <div className="overflow-x-auto p-4 mt-8 md:mt-26">
                <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
                    <thead className="bg-[#3960D0] text-white">
                        <tr>
                            <th className="p-4 text-left font-semibold border-b-2">Evento</th>
                            <th className="p-4 text-left font-semibold border-b-2">Información</th>
                            <th className="p-4 text-left font-semibold border-b-2">Fecha Inicio</th>
                            <th className="p-4 text-left font-semibold border-b-2">Fecha Fin</th>
                        </tr>
                    </thead>

                    <tbody>
                        {DataEvento.length > 0 ? (
                            DataEvento.map((event, index) => (
                                <tr
                                    key={index}
                                    className="odd:bg-gray-50 even:bg-white hover:bg-blue-100 transition-colors"
                                >
                                    <td className="p-4 text-gray-700 border-b">{event.titulo}</td>
                                    <td className="p-4 text-gray-700 border-b">{event.descripcion}</td>
                                    <td className="p-4 text-gray-700 border-b">{formatDate(event.fechaInicio)}</td>
                                    <td className="p-4 text-gray-700 border-b">{formatDate(event.fechaFin)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="p-4 text-center text-gray-600 font-semibold italic border-b"
                                >
                                    No hay eventos disponibles.
                                </td>
                            </tr>
                        )}
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
