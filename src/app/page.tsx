"use client";
import 'regenerator-runtime/runtime';
import Login from "@/components/Login";
import { CLIENT_ID } from "@/utils/clientId";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Users, BookOpen, Menu, X } from 'lucide-react';
import Cargando from '@/components/loading';
import Image from 'next/image';
import { useRouter } from "next/navigation";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const features = [
    {
      icon: <Calendar className="text-blue-600" size={24} />,
      title: 'Gestión Horarios',
      description: 'Organiza tus clases, horarios de consulta y reuniones académicas.'
    },
    {
      icon: <Clock className="text-blue-600" size={24} />,
      title: 'Crea Eventos con la Voz',
      description: 'Mediante comandos de voz, crea eventos con los detalles que necesites.'
    },
    {
      icon: <Users className="text-blue-600" size={24} />,
      title: 'Horarios de Consulta',
      description: 'Gestión sencilla de horarios de consulta y citas con estudiantes'
    },
    // {
    //   icon: <BookOpen className="text-blue-600" size={24} />,
    //   title: 'Integración con Calendario Académico',
    //   description: 'Sincronización perfecta con el calendario académico y fechas límite universitarias'
    // }
  ];

  const handleLoginClick = () => {
    setLoading(true);
  };

  useEffect(() => {
    const checkUserData = () => {
      const userData = localStorage.getItem("userData");
      if (userData) {
        setLoading(false);
      }
    };

    window.addEventListener("storage", checkUserData);

    checkUserData();

    window.addEventListener("focus", checkUserData);

    return () => {
      // Limpieza del evento
      window.removeEventListener("focus", checkUserData);
    };
  }, []);

  const goToAdmin = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL; // Obtiene la variable de entorno
    if (baseUrl) {
      router.push(`${baseUrl}admin/`); // Redirige a la URL construida
    } else {
      console.error("NEXT_PUBLIC_BASE_URL no está definida en el entorno local.");
    }
  };

  const tutorialUrl = process.env.NEXT_PUBLIC_TUTORIAL_VIDEO;

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>

      <div className="min-h-screen bg-white">
        {/* Navegación */}
        <nav className="fixed w-full bg-white shadow-sm z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-[#234AB7]">Asistente Virtual</h1>
              </div>

              {/* Navegación Escritorio */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-600 hover:text-[#234AB7]">Características</a>
                <a href={tutorialUrl || "#"} className="btn text-gray-600 hover:text-[#234AB7]">Demostración</a>
                <button onClick={goToAdmin} className="bg-[#234AB7] text-white px-4 py-2 rounded-md hover:bg-[#234AB7]">
                  Ir al Administrador
                </button>
              </div>

              {/* Botón menú móvil */}
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Navegación Móvil */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="flex flex-col px-2 pt-2 pb-3 space-y-4 sm:px-3">
                <a href="#features" className="text-gray-600 hover:text-[#234AB7]">Características</a>
                <a href={tutorialUrl || "#"} className="btn text-gray-600 hover:text-[#234AB7]">Demostración</a>
                <button
                  onClick={goToAdmin}
                  className="bg-[#234AB7] text-white px-2 py-2 rounded-md hover:bg-[#234AB7]"
                >
                  Ir al Administrador
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Sección Hero */}
        <div className="pt-32 pb-20 text-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="flex justify-center items-center">
              <Image
                src="/logo_negro.png"
                width={250}
                height={100}
                alt="Logo Nomi Asistente Virtual"
                className="mr-2"
              />

            </h1>
            <div className='mb-4 text-4xl sm:text-5xl md:text-6xl font-extrabold'>
              <span className="text-gray-900 text-3xl">¡Gestiona tu Agenda!</span>

            </div>
            {(loading) && <Cargando />}

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Gestiona tu agenda y tus horarios académicos mediante comandos de voz, con nuestro asistente virtual inteligente.<br />
              ¡Diseñado para docentes!
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button onClick={handleLoginClick}>
                <Login />
              </button>
              {/* <button className="border border-[#dee0e3] text-[#54575a] px-8 py-2 rounded-sm hover:bg-gray-50 text-[.85rem] font-normal">
                Ver Tutorial
              </button> */}
            </div>
          </div>
        </div>

        {/* Sección Características */}
        <div id="features" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Funciones para Educadores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col p-6 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    {feature.icon}
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sección Sobre Nomi */}
        <div id="about-nomi" className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">¿Por qué "Nomi"?</h2>
            <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto mb-10">
              El nombre "Nomi" surge de la idea de tener un asistente virtual amigable, eficiente y siempre disponible para
              ayudarte con la gestión y creación de eventos en tu agenda académica. Inspirado en la palabra "NOMINAR" y "UNEMI", representa nuestra misión:
              gestionar la organización de actividades académicas.
            </p>
            <div className="flex justify-center">
              <Image
                src="/logo_negro.png"
                alt="Icono de Nomi"
                width={150}
                height={150}
              />
            </div>
          </div>
        </div>


      </div>
    </GoogleOAuthProvider>

  );
}

