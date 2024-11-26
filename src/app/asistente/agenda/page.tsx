"use client";

import Reloj from "@/components/reloj/reloj";
import React, { useEffect, useState } from 'react';
import { DataEvento } from "@/app/data";
import MicrofonoBoton from '@/components/microfono/microfono';
import { customFetch } from "@/components/refresh_token";
import { Evento } from "@/interfaces/interfaceEventos";
import DataTable from "react-data-table-component"
import { editarEvento, eliminarEvento } from "@/utils/funciones";
import { toast } from "react-toastify";
import ModalEditarEvento from "./modal_editar";
import ModalConfirmacion from "@/components/modals/confirmar";

const Agenda: React.FC = () => {
    const [dataEvent, setEvents] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<Evento | null>(null);

    const modalidades = [
        { id: 1, descripcion: "Presencial" },
        { id: 2, descripcion: "Remota" },
    ];

    useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await customFetch(`${process.env.NEXT_PUBLIC_BASE_URL}asistente/api/eventos/`,
                    {
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
    // console.log("Eventos", dataEvent)

    const formatDate = (dateString: string | Date) => {
        if (typeof dateString === "string") {
            dateString = dateString.replace("Z", "+00:00");
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Fecha inválida";
        }
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        };
        return date.toLocaleString("es-ES", options);
    };

    const handleEdit = (event: Evento) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleSaveEdit = async (updatedEvent: Evento) => {
        const savedEvent = await editarEvento(updatedEvent.id, updatedEvent);
        if (savedEvent) {
            setEvents(dataEvent.map(event => event.id === savedEvent.id ? savedEvent : event));
            setIsModalOpen(false);
            toast.success("Evento actualizado con éxito");
        }
    };

    const handleOpenDeleteModal = (event: Evento) => {
        setEventToDelete(event);
        setIsDeleteModalOpen(true); // Abre el modal de confirmación
    };

    const handleConfirmDelete = async () => {
        if (eventToDelete) {
            const success = await eliminarEvento(eventToDelete.id);
            if (success) {
                setEvents(dataEvent.filter((event) => event.id !== eventToDelete.id));
                toast.success("Evento eliminado con éxito");
            } else {
                toast.error("No se pudo eliminar el evento");
            }
            setIsDeleteModalOpen(false); // Cierra el modal de confirmación
            setEventToDelete(null); // Limpia el evento a eliminar
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false); // Cierra el modal de confirmación
        setEventToDelete(null); // Limpia el evento a eliminar
    };

    const columns = [
        {
            name: "Descripción",
            selector: (row: any) => row.descripcion,
            sortable: true,
        },
        {
            name: "Fecha Inicio",
            selector: (row: any) => formatDate(row.fecha_inicio),
            sortable: true,
        },
        {
            name: "Fecha Fin",
            selector: (row: any) => formatDate(row.fecha_fin),
            sortable: true,
        },
        {
            name: "Modalidad",
            selector: (row: any) => row.modalidad_descripcion,
        },
        {
            name: "Acciones",
            cell: (row: Evento) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 rounded-sm"
                    >
                        <i className="ri-edit-2-line"></i>
                    </button>
                    <button
                        onClick={() => handleOpenDeleteModal(row)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 rounded-sm"
                    >
                        <i className="ri-delete-bin-6-line"></i>
                    </button>
                </div>
            ),
        },
    ];

    const paginationOptions = {
        rowsPerPageText: "Filas por página",
        rangeSeparatorText: "de",
        selectAllRowsItem: true,
        selectAllRowsItemText: "Todos",
    };

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: "#3960D0",
                color: "white",
                fontWeight: "bold",
                fontSize: "14px",
                textAlign: "center",
            },
        },
        rows: {
            style: {
                backgroundColor: "white",
                "&:nth-of-type(odd)": {
                    backgroundColor: "#f5f5f5",
                },
                "&:hover": {
                    backgroundColor: "#e2e8f0",
                },
            },
        },
        cells: {
            style: {
                padding: "8px",
                textAlign: "center",
            },
        },
    };

    return (
        <div className="h-full bg-white flex flex-col justify-between">
            <div className="flex justify-between mt-4">
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
                <div className="overflow-x-auto p-4 mt-8 md:mt-26">
                    <DataTable
                        columns={columns}
                        data={dataEvent}
                        progressPending={loading}
                        noDataComponent="No hay eventos disponibles."
                        pagination
                        paginationComponentOptions={paginationOptions}
                    // customStyles={customStyles}

                    />
                </div>
            </div>

            <ModalEditarEvento
                isOpen={isModalOpen}
                eventData={selectedEvent}
                modalidades={modalidades}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEdit}
            />

            <ModalConfirmacion
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                mensaje={`¿Estás seguro que deseas eliminar el evento "${eventToDelete?.descripcion}"?`}
            />

            {/* <div className="flex justify-center items-center">
                <MicrofonoBoton />
            </div> */}
        </div>
    );
}

export default Agenda;
