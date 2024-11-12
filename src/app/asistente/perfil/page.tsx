"use client";
import Reloj from "@/components/reloj/reloj";
import { Usuario } from "../../data";
import { UserData } from "@/interfaces/userInterface";
import MicrofonoBoton from '@/components/microfono/microfono';
import { useEffect, useState } from "react";

const Perfil = () => {
    const [storedData, setStoredData] = useState<UserData | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
          const storedDataString = localStorage.getItem('userData');
          if (storedDataString) {
            const parsedData: UserData = JSON.parse(storedDataString);
            setStoredData(parsedData);
          }
        }
      }, []);
      
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
                    <p>Miembro desde: {Usuario.fechaIngreso}</p>
                    <p>Usos: Haz usado el asistente 10 veces</p>
                </div>

                <div className="my-2 p-2">
                    <h3 className="text-lg font-bold my-4">Cuenta:</h3>
                    <div className="flex justify-between space-x-2">
                        <button className="bg-white py-2 px-4 rounded-lg">Borrar Cuenta</button>
                        {/* <button className="bg-white py-2 px-4 rounded">Restablecer Contraseña</button> */}
                        <button className="bg-white py-2 px-4 rounded-lg">Solicitar Ayuda</button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center mt-12">
                <MicrofonoBoton />
            </div>


        </div >
    );
}

export default Perfil;
