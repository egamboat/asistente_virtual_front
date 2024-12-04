"use client";
import Reloj from "@/components/reloj/reloj";
import { Usuario } from "../../data";
import { UserData } from "@/interfaces/userInterface";
import MicrofonoBoton from '@/components/microfono/microfono';
import { useEffect, useState } from "react";
import { customFetch } from "@/components/refresh_token";
import { toast } from "react-toastify";
import ModalAyuda from "./modal_ayuda";
import { eliminarEvento, editarEvento } from "@/utils/funciones";
import { Building, Mail } from "lucide-react";
import { googleLogout } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import ModalConfirmacion from "@/components/modals/confirmar";

const Perfil = () => {
    const router = useRouter();
    const [storedData, setStoredData] = useState<UserData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [accessTokenGoogle, setAccessTokenGoogle] = useState<string | null>(null);

    const openDeleteModal = () => setIsDeleteModalOpen(true);

    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    const handleOpenModal = () => {
        const canOpenModal = true;
        if (canOpenModal) {
            setIsModalOpen(true);
        } else {
            toast.error('No puedes abrir el modal en este momento.');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("google_access_token");
        setAccessTokenGoogle(token);
    }, []);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleEnviarAyuda = () => {
        // Aquí puedes agregar la lógica que se ejecutará al presionar "Enviar"
        toast.success('¡Solicitud de ayuda enviada con éxito!');
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
            const storedDataString = localStorage.getItem('userData');
            if (storedDataString) {
                const parsedData: UserData = JSON.parse(storedDataString);
                setStoredData(parsedData);
            }
        }
    }, []);

    const handleDeleteAccount = async () => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}usuario/api/delete-account/`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const result = await response.json();

            if (response.ok) {
                toast.warning("Cuenta eliminada exitosamente.");

                setTimeout(() => {
                    logOut();
                }, 5000);
            } else {
                toast.error(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("Error al eliminar la cuenta:", error);
            toast.error("Hubo un problema al eliminar la cuenta.");
        } finally {
            closeDeleteModal();
        }
    };

    const logOut = () => {
        try {
            googleLogout();
            if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
                localStorage.removeItem('userData');
                localStorage.removeItem('token');
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                setStoredData(null);

                router.push('/');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const handleGetEvents = async () => {
        if (!accessTokenGoogle) return;

        try {
            const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessTokenGoogle}`,
                },
            });

            const data = await response.json();
            console.log('Eventos:', data.items);
        } catch (error) {
            console.error('Error obteniendo eventos:', error);
        }
    };

    const handleCreateEvent = async () => {
        if (!accessTokenGoogle) return;

        const eventData = {
            summary: 'Reunión de equipo',
            location: 'Oficina',
            description: 'Reunión mensual de planificación',
            start: {
                dateTime: '2024-12-03T09:00:00-07:00', // Fecha y hora de inicio
                timeZone: 'America/Los_Angeles',
            },
            end: {
                dateTime: '2024-12-04T10:00:00-07:00', // Fecha y hora de fin
                timeZone: 'America/Los_Angeles',
            },
        };

        try {
            const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessTokenGoogle}`,
                },
                body: JSON.stringify(eventData),
            });

            const data = await response.json();
            console.log('Evento creado:', data);
        } catch (error) {
            console.error('Error creando evento:', error);
        }
    };

    const handleUpdateEvent = async (eventId: any, updatedEventData: any) => {
        if (!accessTokenGoogle) return;

        try {
            const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
                method: 'PATCH', // También puedes usar 'PATCH' para actualizaciones parciales
                headers: {
                    'Authorization': `Bearer ${accessTokenGoogle}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEventData),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Evento actualizado:', data);
                toast.success("Actualizado")
            } else {
                console.error('Error al actualizar el evento:', data);
            }
        } catch (error) {
            console.error('Error al actualizar el evento:', error);
        }
    };
    const eventId = "879argep71m1kli77r5mj0ot54"; // Reemplaza con el ID real del evento
    const updatedEventData = {
        summary: 'Prueba de actualizacion',
        description: 'Actualizacion del evento para el 3',
        // Puedes agregar más campos a actualizar
    };


    const handleDeleteEvent = async (eventId:any) => {
        if (!accessTokenGoogle) return;

        try {
            const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessTokenGoogle}`,
                },
            });

            if (response.ok) {
                console.log('Evento eliminado exitosamente');
            } else {
                const errorData = await response.json();
                console.error('Error al eliminar el evento:', errorData);
            }
        } catch (error) {
            console.error('Error al eliminar el evento:', error);
        }
    };
    
    // handleDeleteEvent(eventIddlt);
    return (
        <div className="bg-white flex flex-col justify-between">
            <div className="flex justify-between w-full mt-4">
                <div className="ml-4">
                    <h1 className="text-3xl font-bold">
                        Perfil
                    </h1>
                </div>
                <div className="text-2xl mr-4">
                    <Reloj />
                </div>
            </div>

            <div className="p-8 mt-28 bg-[#D9D9D9] rounded-xl mx-4">
                <h2 className="text-2xl font-semibold mb-4">
                    {storedData && storedData.name ? `Hola ${storedData.name}!` : "Hola!"}
                </h2>

                <div className="space-y-4">
                    <div className="bg-white/70 p-4 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">
                            Tus Datos
                        </h3>

                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
                            {/* Información de Usuario */}
                            <div className="space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-4 sm:space-y-0">
                                    {/* Email */}
                                    <div className="flex items-center">
                                        <Mail className="mr-2 text-blue-500" size={20} />
                                        <div>
                                            <p className="text-gray-600 font-semibold">Email:</p>
                                            <p className="font-normal">
                                                {storedData?.email || "No disponible"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Institución */}
                                    <div className="flex items-center">
                                        <Building className="mr-2 text-blue-500" size={20} />
                                        <div>
                                            <p className="text-gray-600 font-semibold">Institución:</p>
                                            <p className="font-normal">
                                                {storedData?.email
                                                    ? storedData.email.split("@")[1].split(".")[0].toUpperCase()
                                                    : "No especificada"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Foto de perfil */}
                            <div className="flex justify-center md:justify-end">
                                <img
                                    src={storedData?.picture}
                                    alt="Foto de perfil"
                                    className="w-16 h-16 rounded-full border border-gray-300"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="my-2 p-2">
                    <h3 className="text-lg font-bold my-4">Cuenta:</h3>
                    <div className="flex justify-between space-x-2">
                        <button className="bg-white py-2 px-4 rounded-lg" onClick={openDeleteModal} >Borrar Cuenta</button>
                        {/* <button className="bg-white py-2 px-4 rounded">Restablecer Contraseña</button> */}
                        <button onClick={handleOpenModal} className="bg-white py-2 px-4 rounded-lg">Solicitar Ayuda</button>
                    </div>
                </div>
            </div>
            <button onClick={handleGetEvents}> Cargar Eventos </button>
            <button onClick={handleCreateEvent}> Crear Eventos </button>
            <button onClick={() => handleUpdateEvent(eventId, updatedEventData)}>Editar</button>
            <button onClick={() => handleDeleteEvent(eventId)}>Eliminar</button>
            {/* <div className="flex justify-center items-center mt-12">
                <MicrofonoBoton />
            </div> */}
            {isModalOpen && (
                <ModalAyuda
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onEnviar={handleEnviarAyuda}
                />
            )}
            <ModalConfirmacion
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteAccount}
                mensaje="¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible."
            />
        </div >

    );
}

export default Perfil;
