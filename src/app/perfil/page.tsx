"use client";
import Reloj from "@/components/reloj/reloj";
import { Usuario } from "../data";

const Perfil = () => {
    return (
        <div className="bg-white flex flex-col justify-between">
            <div className="flex justify-between w-full">
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
                <h2 className="text-2xl font-semibold mb-4">Hola {Usuario.nombre}!</h2>
                
                <div className="mb-4">
                    <h3 className="text-lg font-bold my-2">Tus datos:</h3>
                    <p>Email: {Usuario.correoElectronico}</p>
                    <p>Institución: {Usuario.docente.facultad}</p>
                    <p>Miembro desde: {Usuario.fechaIngreso}</p>
                    <p>Usos: Haz usado el asistente 10 veces</p>
                </div>

                <div className="my-2 p-2">
                    <h3 className="text-lg font-bold my-4">Cuenta:</h3>
                    <div className="flex justify-between space-x-2">
                        <button className="bg-white py-2 px-4 rounded">Borrar Cuenta</button>
                        <button className="bg-white py-2 px-4 rounded">Restablecer Contraseña</button>
                        <button className="bg-white py-2 px-4 rounded">Solicitar Ayuda</button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center mt-24">
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


        </div >
    );
}

export default Perfil;
