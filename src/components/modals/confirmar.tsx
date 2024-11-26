import React from "react";

interface ModalConfirmacionProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    mensaje: string;
}

const ModalConfirmacion: React.FC<ModalConfirmacionProps> = ({ isOpen, onClose, onConfirm, mensaje }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">Confirmación</h2>
                <p className="mb-6">{mensaje}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 rounded-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 rounded-sm"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmacion;
