import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface ModalAyudaProps {
    isOpen: boolean;
    onClose: () => void;
    onEnviar: (mensaje: string) => void; // Pasamos el mensaje como argumento
}

const ModalAyuda: React.FC<ModalAyudaProps> = ({ isOpen, onClose, onEnviar }) => {
    const [mensaje, setMensaje] = useState(''); // Estado para el mensaje

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMensaje(e.target.value);
    };


    const handleEnviar = () => {
        if (mensaje.trim() === '') {
            toast.warning('El mensaje no puede estar vacío'); // Puedes cambiar esto por un toast
            return;
        }
        onEnviar(mensaje);
        setMensaje('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                <h2 className="text-xl font-bold mb-4">Solicitar Ayuda</h2>
                <div className="mb-4">
                    <div className='mt-2'>
                        <i className="ri-alarm-warning-line"></i>
                        <p>Por favor ingresa los detalles de tu solicitud de ayuda, pronto el administrador se contactará contigo.</p>
                    </div>
                    <textarea
                        value={mensaje}
                        onChange={handleInputChange}
                        placeholder="Escribe tu solicitud aquí..."
                        className="w-full border border-gray-300 rounded-lg p-2 mt-2 resize-none h-32"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 py-2 px-4 rounded-lg mr-2"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleEnviar}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAyuda;
