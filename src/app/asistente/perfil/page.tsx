"use client";
import Reloj from "@/components/reloj/reloj";
import { Usuario } from "../../data";
import { UserData } from "@/interfaces/userInterface";
import MicrofonoBoton from '@/components/microfono/microfono';
import { useEffect, useState } from "react";
import { customFetch } from "@/components/refresh_token";
import { toast } from "react-toastify";
import ModalAyuda from "./modal_ayuda";
import { Building, Mail } from "lucide-react";
import { googleLogout } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import ModalConfirmacion from "@/components/modals/confirmar";
import Image from "next/image";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";

const Perfil = () => {
    const router = useRouter();
    const [storedData, setStoredData] = useState<UserData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [accessToken, setAccessToken] = useState<string>("");
    const [imageSrc, setImageSrc] = useState(storedData?.picture || '/images/user_foto.jpg');

    const handleImageError = () => {
        setImageSrc('/images/user_foto.jpg'); // Imagen por defecto
    };

    useEffect(() => {
        const token = localStorage.getItem("access_token") || "";
        setAccessToken(token);
    }, []); // Solo se ejecuta en el cliente

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

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleEnviarAyuda = async (mensaje: string) => {
        console.log("Mensaje recibido:", mensaje);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}usuario/solicitudes/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    correo: storedData?.email,
                    texto: mensaje
                })
            });

            if (response.ok) {
                toast.success('¡Solicitud de ayuda enviada con éxito!');
                setIsModalOpen(false);
            } else {
                const errorData = await response.json();
                console.error('Error en la respuesta del servidor:', errorData);
                toast.error(`Hubo un error al enviar la solicitud: ${errorData.message || 'Intenta nuevamente.'}`);
            }
        } catch (error) {
            console.error('Error al enviar solicitud:', error);
            toast.error('No se pudo conectar al servidor. Verifica tu conexión.');
        }
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
                                <Image
                                    src={imageSrc}
                                    alt="Foto de perfil"
                                    className="w-16 h-16 rounded-full border border-gray-300"
                                    width={16}
                                    height={16}
                                    unoptimized={!!storedData?.picture && !storedData?.picture.startsWith('/')}
                                    onError={handleImageError}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="my-2 p-2">
                    <h3 className="text-lg font-bold my-4">Cuenta:</h3>
                    <div className="flex justify-between space-x-2">
                        <button className="bg-white py-2 px-4 rounded-lg" onClick={openDeleteModal} >Borrar Cuenta</button>
                        <button onClick={handleOpenModal} className="bg-white py-2 px-4 rounded-lg">Solicitar Ayuda</button>
                    </div>
                </div>
            </div>

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
