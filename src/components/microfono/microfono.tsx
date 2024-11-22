"use client";
import 'regenerator-runtime/runtime';
import React, { useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Image from 'next/image';
interface MicrofonoBotonProps {
    onTranscriptionComplete?: (transcribedText: string) => void;
    onEditEvent?: (transcribedText: string) => void;
    onDeleteEvent?: (transcribedText: string) => void;
    onConsultEvents?: (transcribedText: string) => void;
}

const MicrofonoBoton: React.FC<MicrofonoBotonProps> = ({
    onTranscriptionComplete,
    onEditEvent,
    onDeleteEvent,
    onConsultEvents
}) => {
    const {
        // transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        finalTranscript
    } = useSpeechRecognition();

    type CommandKey = 'agregar' | 'editar' | 'eliminar' | 'consultar' | 'cerrar menú' | 'reiniciar' | 'parar escucha';

    const [isClient, setIsClient] = useState(false);
    const lastTranscriptRef = useRef('');


    useEffect(() => {
        setIsClient(true);
    }, []);

    // Define los comandos y sus palabras clave asociadas con el tipo CommandKey
    const commandKeywords: Record<CommandKey, string[]> = {
        agregar: ["agregar", "agrega", "añadir", "adicionar"],
        editar: ["editar", "modificar", "cambiar"],
        eliminar: ["eliminar", "borrar", "quitar"],
        consultar: ["consultar", "buscar", "ver"],
        "cerrar menú": ["cerrar menú", "cierra el menú", "ocultar menú"],
        reiniciar: ["reiniciar", "limpiar", "resetear"],
        "parar escucha": ["parar escucha", "detener escucha", "stop"]
    };

    // Mapeo de funciones para cada comando
    const commands: Record<CommandKey, () => Promise<void>> = {
        agregar: async () => {
          if (onTranscriptionComplete) {
            await onTranscriptionComplete(finalTranscript);
            resetTranscript();
          }
        },
        editar: async () => {
          if (onEditEvent) {
            await onEditEvent(finalTranscript);
            resetTranscript();
          }
        },
        eliminar: async () => {
          if (onDeleteEvent) {
            await onDeleteEvent(finalTranscript);
            resetTranscript();
          }
        },
        consultar: async () => {
          console.log("Consultar")
          if (onConsultEvents) {
            await onConsultEvents(finalTranscript);
            resetTranscript();
          }
        },
        "cerrar menú": async () => {
          // Implementar si es necesario
          alert("Comando detectado: Cerrar menú");
          resetTranscript();
        },
        reiniciar: async () => {
          resetTranscript();
        },
        "parar escucha": async () => {
          handleStopListening();
          resetTranscript();
        }
      };
      

    const handleButtonClick = () => {
        if (listening) {
            handleStopListening();
        } else {
            // resetTranscript();
            SpeechRecognition.startListening({ language: 'es-EC', continuous: true, interimResults: false });
        }
    };


    const handleStopListening = () => {
        SpeechRecognition.stopListening();
    };

    useEffect(() => {
        if (finalTranscript !== '' && finalTranscript !== lastTranscriptRef.current) {
          lastTranscriptRef.current = finalTranscript;
          const lowerTranscript = finalTranscript.toLowerCase();
          let commandFound = false;
      
          (async () => {
            for (const [command, keywords] of Object.entries(commandKeywords)) {
              for (const keyword of keywords) {
                if (lowerTranscript.includes(keyword)) {
                  await commands[command as CommandKey]();
                  commandFound = true;
                  break;
                }
              }
              if (commandFound) break;
            }
      
            if (!commandFound && onTranscriptionComplete) {
              await onTranscriptionComplete(finalTranscript);
              resetTranscript();
            }
          })();
        }
      }, [finalTranscript, commandKeywords, commands, onTranscriptionComplete, onEditEvent, onDeleteEvent, onConsultEvents, resetTranscript]);
      

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

    if (!isClient) {
        return <div>Cargando...</div>;
    }

    if (!browserSupportsSpeechRecognition) {
        return <span> Hemos detectado que tu navegador no soporta la transformación de voz. ¡Lo sentimos!</span>;
    }

    return (
        <div>
            <button
                onClick={handleButtonClick}
                className={`p-4 rounded-lg shadow-lg transition duration-300 border-dashed border-2 ${listening ? 'bg-[#e8d3d3] border-[#2F0000]' : 'bg-gray-300 border-black'
                    }`}
                title={listening ? 'Detener escucha' : 'Iniciar escucha'}
            >
                <Image
                    src={listening ? "/icons/mic_white.png" : "/icons/mic.png"}
                    alt="mic icon"
                    width={50}
                    height={50}
                />
            </button>
        </div>
    );
};

export default MicrofonoBoton;