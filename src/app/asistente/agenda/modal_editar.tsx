import React, { useEffect, useState } from "react";
import { Evento } from "@/interfaces/interfaceEventos";

interface ModalEditarEventoProps {
    isOpen: boolean;
    eventData: Evento | null;
    modalidades: { id: number; descripcion: string }[]; // Recibimos las modalidades disponibles
    onClose: () => void;
    onSave: (updatedEvent: Evento) => void;
}

const ModalEditarEvento: React.FC<ModalEditarEventoProps> = ({ isOpen, eventData, modalidades, onClose, onSave }) => {
    if (!isOpen || !eventData) return null;

    const [editedEvent, setEditedEvent] = useState<Evento>(eventData);

    useEffect(() => {
        if (eventData) {
            setEditedEvent(eventData);
        }
    }, [eventData]);

    const formatToLocalDatetime = (dateString: string | null) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, -1);
    };

    const handleSave = () => {
        onSave({
            ...editedEvent,
            modalidad: editedEvent.modalidad, // Solo enviamos el id de la modalidad
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
              <div className="bg-white p-6 rounded-lg w-full max-w-3xl md:w-3/4 lg:w-1/2">
                <h2 className="text-xl font-bold mb-4">Editar Evento</h2>
                <label className="block mb-2">
                    Descripción:
                    <input
                        type="text"
                        value={editedEvent.descripcion || ""}
                        onChange={(e) => setEditedEvent({ ...editedEvent, descripcion: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </label>
                <label className="block mb-2">
                    Fecha Inicio:
                    <input
                        type="datetime-local"
                        value={formatToLocalDatetime(editedEvent.fecha_inicio)}
                        onChange={(e) => setEditedEvent({ ...editedEvent, fecha_inicio: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </label>
                <label className="block mb-2">
                    Fecha Fin:
                    <input
                        type="datetime-local"
                        value={formatToLocalDatetime(editedEvent.fecha_fin)}
                        onChange={(e) => setEditedEvent({ ...editedEvent, fecha_fin: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </label>
                <label className="block mb-4">
                    Modalidad:
                    <select
                        value={editedEvent.modalidad}
                        onChange={(e) => setEditedEvent({ ...editedEvent, modalidad: parseInt(e.target.value) })}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        {modalidades.map((mod) => (
                            <option key={mod.id} value={mod.id}>
                                {mod.descripcion}
                            </option>
                        ))}
                    </select>
                </label>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 rounded-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 rounded-sm"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalEditarEvento;
