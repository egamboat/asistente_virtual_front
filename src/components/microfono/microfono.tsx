"use client";
import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const MicrofonoBoton = () => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const [isListening, setIsListening] = useState(false);

    // Define los comandos y sus funciones asociadas
    const commands: { [key: string]: () => void } = {
        "abrir menú": () => alert("Comando detectado: Abrir menú"),
        "cerrar menú": () => alert("Comando detectado: Cerrar menú"),
        "reiniciar": resetTranscript,
        "parar escucha": () => handleStopListening()
    };

    // Función para manejar el botón y alternar la escucha
    const handleButtonClick = () => {
        if (isListening) {
            handleStopListening();
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ language: 'es-EC' });
            setIsListening(true);
        }
    };

    // Función para detener la escucha y actualizar el estado
    const handleStopListening = () => {
        SpeechRecognition.stopListening();
        setIsListening(false);
    };

    // Efecto para verificar comandos en la transcripción en tiempo real
    useEffect(() => {
        Object.keys(commands).forEach((command) => {
            if (transcript.toLowerCase().includes(command)) {
                commands[command as keyof typeof commands](); // Ejecuta la función asociada al comando
                resetTranscript();   // Limpia la transcripción después de detectar un comando
            }
        });
    }, [transcript]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Hemos detectado que tu navegador no soporta la transformación de voz. ¡Lo sentimos!</span>;
    }

    return (
        <div>
            <button
                onClick={handleButtonClick}
                className={`p-4 border rounded-lg shadow-lg transition duration-300 border-dashed border-2 ${isListening ? 'bg-[#8B0000] border-[#2F0000]' : 'bg-gray-300 border-black'
                    }`}
                disabled={listening} // Deshabilita el botón mientras está escuchando
                title={isListening ? 'Detener escucha' : 'Iniciar escucha'}
            >
                <img
                    src={isListening ? "/icons/mic_white.png" : "/icons/mic.png"}
                    alt="mic icon"
                    width={50}
                    height={50}
                />
            </button>
            <p>Transcripción: {transcript}</p>
        </div>
    );
};

export default MicrofonoBoton;
