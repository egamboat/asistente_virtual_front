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

const Perfil = () => {
    const [storedData, setStoredData] = useState<UserData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        // Aquí puedes agregar la lógica de validación
        const canOpenModal = true; // Cambia esta condición según tu lógica
        if (canOpenModal) {
            setIsModalOpen(true);
        } else {
            toast.error('No puedes abrir el modal en este momento.');
        }
    };

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

    const handleEliminarEvento = async () => {
        const id = 106; // ID del evento que deseas eliminar (puedes pasarlo dinámicamente)
        const isDeleted = await eliminarEvento(id);
    };

    const handleEditarEvento = async () => {
        const id:number = 110;
        const dataSend = {
            descripcion: "Actualización 110",
            fecha_inicio: "2024-12-08T14:00:00Z",
            fecha_fin: "2024-12-08T16:00:00Z",
            tipo_evento: 5,
            modalidad: 2,
        };

        await editarEvento(id, dataSend);
    };


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

            <div className="p-8 mt-32 bg-[#D9D9D9] rounded-xl mx-4">
                <h2 className="text-2xl font-semibold mb-4">
                    {storedData && storedData.name ? `Hola ${storedData.name}!` : "Hola!"}
                </h2>

                <div className="mb-4">
                    <h3 className="text-lg font-bold my-2">Tus datos:</h3>
                    <p>Email: {storedData && storedData.name ? `${storedData.email}` : ""} </p>
                    <p>Institución: {Usuario.docente.facultad}</p>
                    {/* <p>Miembro desde: {Usuario.fechaIngreso}</p> */}
                    {/* <p>Usos: Haz usado el asistente 10 veces</p> */}
                </div>

                <div className="my-2 p-2">
                    <h3 className="text-lg font-bold my-4">Cuenta:</h3>
                    <div className="flex justify-between space-x-2">
                        <button className="bg-white py-2 px-4 rounded-lg">Borrar Cuenta</button>
                        {/* <button className="bg-white py-2 px-4 rounded">Restablecer Contraseña</button> */}
                        <button onClick={handleOpenModal} className="bg-white py-2 px-4 rounded-lg">Solicitar Ayuda</button>
                    </div>
                </div>
            </div>
            {/* <button onClick={handleEditarEvento}>
               Update Data
            </button> 
            <button onClick={handleEliminarEvento}>
               Delete Data
            </button>  */}

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
        </div >

    );
}

export default Perfil;
