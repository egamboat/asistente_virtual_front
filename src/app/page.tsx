"use client";
import 'regenerator-runtime/runtime';
import Login from "@/components/Login";
import { CLIENT_ID } from "@/consts/clientId";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Users, BookOpen, Menu, X } from 'lucide-react';
import Cargando from '@/components/loading';
import Image from 'next/image';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const features = [
    {
      icon: <Calendar className="text-blue-600" size={24} />,
      title: 'Gestión Horarios',
      description: 'Organiza tus clases, horarios de consulta y reuniones académicas.'
    },
    // {
    //   icon: <Clock className="text-blue-600" size={24} />,
    //   title: 'Resolución de Conflictos',
    //   description: 'Detecta y resuelve instantáneamente conflictos entre clases y eventos.'
    // },
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

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>

      <div className="min-h-screen bg-white">
        {/* Navegación */}
        <nav className="fixed w-full bg-white shadow-sm z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-[#234AB7]">Assitente Virtual</h1>
              </div>

              {/* Navegación Escritorio */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-600 hover:text-[#234AB7]">Características</a>
                {/* <a href="#demo" className="text-gray-600 hover:text-[#234AB7]">Demostración</a>
                <button className="bg-[#234AB7] text-white px-4 py-2 rounded-md hover:bg-[#234AB7]">
                  Prueba Gratis
                </button> */}
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
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-[#234AB7]">Características</a>
                <a href="#demo" className="block px-3 py-2 text-gray-600 hover:text-[#234AB7]">Demostración</a>
                <button className="w-full text-left px-3 py-2 text-gray-600 hover:text-[#234AB7]">
                  Inicia Sesión
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Sección Hero */}
        <div className="pt-32 pb-20 text-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#234AB7] mb-4 flex justify-center items-center">
              <Image
                src="/logo_negro.png"
                width={250}
                height={100}
                alt="Logo Nomi Asistente Virtual"
                className="mr-2"
              />
              <span className="text-gray-900 text-3xl">¡Gestiona tu Agenda!</span>
            </h1>

            {(loading) && <Cargando />}

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Optimiza tu agenda y gestiona tus horarios académicos con nuestro asistente virtual inteligente.
              ¡Diseñado específicamente para docentes!
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button onClick={handleLoginClick}>
                <Login />
              </button>
              <button className="border border-[#dee0e3] text-[#54575a] px-8 py-2 rounded-sm hover:bg-gray-50 text-[.85rem] font-normal">
                Ver Tutorial
              </button>
            </div>
          </div>
        </div>

        {/* Sección Características */}
        <div id="features" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Funciones Inteligentes para Educadores</h2>
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
      </div>
    </GoogleOAuthProvider>

  );
}

