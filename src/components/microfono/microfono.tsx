"use client";
import 'regenerator-runtime/runtime';
import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Define la interfaz de las props
interface MicrofonoBotonProps {
    onTranscriptionComplete?: (transcribedText: string) => void;
}

const MicrofonoBoton: React.FC<MicrofonoBotonProps> = ({ onTranscriptionComplete }) => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    type CommandKey = 'agregar' | 'editar' | 'eliminar' | 'consultar' | 'cerrar menú' | 'reiniciar' | 'parar escucha';

    const [isListening, setIsListening] = useState(false);

    // Define los comandos y sus palabras clave asociadas con el tipo CommandKey
    // const commandKeywords: Record<CommandKey, string[]> = {
    //     agregar: ["agregar", "agrega", "añadir", "adicionar"],
    //     editar: ["editar", "modificar", "cambiar"],
    //     eliminar: ["eliminar", "borrar", "quitar"],
    //     consultar: ["consultar", "buscar", "ver"],
    //     "cerrar menú": ["cerrar menú", "cierra el menú", "ocultar menú"],
    //     reiniciar: ["reiniciar", "limpiar", "resetear"],
    //     "parar escucha": ["parar escucha", "detener escucha", "stop"]
    // };

    // // Mapeo de funciones para cada comando
    // const commands: Record<CommandKey, () => void> = {
    //     agregar: () => alert("Comando detectado: Agregar"),
    //     editar: () => alert("Comando detectado: Editar"),
    //     eliminar: () => alert("Comando detectado: Eliminar"),
    //     consultar: () => alert("Comando detectado: Consultar"),
    //     "cerrar menú": () => alert("Comando detectado: Cerrar menú"),
    //     reiniciar: resetTranscript,
    //     "parar escucha": () => handleStopListening()
    // };

    const handleButtonClick = () => {
        if (isListening) {
            handleStopListening();
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ language: 'es-EC', continuous: true });
            setIsListening(true);
        }
    };
    const handleStopListening = () => {
        SpeechRecognition.stopListening();
        setIsListening(false);
        // No enviamos la transcripción aquí
    };

    useEffect(() => {
        if (!listening && !isListening && transcript.trim() !== '') {
            if (onTranscriptionComplete) {
                onTranscriptionComplete(transcript);
            }
            resetTranscript();
        }
    }, [listening, isListening, transcript, onTranscriptionComplete, resetTranscript]);

    // Efecto para verificar comandos en la transcripción en tiempo real
    // useEffect(() => {
    //     // Verificar y ejecutar comandos
    //     (Object.keys(commandKeywords) as CommandKey[]).forEach((command) => {
    //         commandKeywords[command].forEach((keyword) => {
    //             if (transcript.toLowerCase().includes(keyword)) {
    //                 commands[command]();
    //                 resetTranscript();
    //             }
    //         });
    //     });

    //     // Notificar al componente padre sobre la transcripción actual
    //     if (onTranscriptionChange) {
    //         onTranscriptionChange(transcript);
    //     }
    // }, [transcript]);

    if (!browserSupportsSpeechRecognition) {
        return <span> Hemos detectado que tu navegador no soporta la transformación de voz. ¡Lo sentimos!</span>;
    }

    return (
        <div>
            <button
                onClick={handleButtonClick}
                className={`p-4 rounded-lg shadow-lg transition duration-300 border-dashed border-2 ${isListening ? 'bg-[#e8d3d3] border-[#2F0000]' : 'bg-gray-300 border-black'
                    }`}
                title={isListening ? 'Detener escucha' : 'Iniciar escucha'}
            >
                <img
                    src={isListening ? "/icons/mic_white.png" : "/icons/mic.png"}
                    alt="mic icon"
                    width={50}
                    height={50}
                />
            </button>
            {/* Puedes mostrar la transcripción en tiempo real si lo deseas */}
            {/* <p>Transcripción: {transcript}</p> */}
        </div>
    );
};

export default MicrofonoBoton;