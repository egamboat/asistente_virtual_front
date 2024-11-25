"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { googleLogout } from "@react-oauth/google";
import { UserData } from "@/interfaces/userInterface";
import { Menu, X, Home, Calendar, BookOpen, User, LogOut } from 'lucide-react';
import { useRouter } from "next/navigation"; // Importamos el router de Next.js
import Image from "next/image";

const Sidebar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [storedData, setStoredData] = useState<UserData | null>(null);

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setIsOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Cargar datos del usuario
  useEffect(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const storedDataString = localStorage.getItem('userData');
      if (storedDataString) {
        const parsedData: UserData = JSON.parse(storedDataString);
        setStoredData(parsedData);
      }
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const clearMessages = () => {
    localStorage.removeItem('assistantMessages');
  };

  const logOut = () => {
    try {
      googleLogout();
      if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        setStoredData(null);

        router.push('/');
        clearMessages()
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  const menuItems = [
    { href: "/asistente/", label: "Inicio", icon: <Home size={20} /> },
    { href: "/asistente/calendario", label: "Calendario", icon: <Calendar size={20} /> },
    { href: "/asistente/agenda", label: "Agenda", icon: <BookOpen size={20} /> },
    { href: "/asistente/perfil", label: "Perfil", icon: <User size={20} /> },
  ];

  return (
    <div className="min-h-screen">
      {/* Botón de menú (siempre visible) */}
      <button
        className={`fixed ${isOpen ? 'left-52 text-white' : 'left-4 text-black'} top-4 z-50 p-2 rounded-md transition-all duration-300`}
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay para móvil */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed h-full ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out z-40`}
      >
        <div className={`bg-[#234AB7] text-white h-screen w-64 p-6 shadow-lg`}>
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <Image
              src="/logo_blanco.png"
              width={100}
              height={50}
              alt="Nomi Logo"
            />
            {/* <h2 className="text-xl font-bold">Nomi</h2> */}
          </div>

          {/* Navegación */}
          <nav>
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[#3960D0] transition-colors">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </Link>
                </li>
              ))}

              {/* Botón de cerrar sesión */}
              <li className="pt-8">
                <button
                  onClick={logOut}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-[#3960D0] transition-colors w-full"
                >
                  <LogOut size={30} />
                  <div>
                    {storedData && (
                      <div className="flex items-center space-x-2">
                        {/* <img
                          src={storedData.picture}
                          alt=""
                          className="w-[30px] h-[30px] rounded-full"
                        /> */}
                        <p className="text-[0.7rem] font-semibold break break-words" >{storedData.name}</p>
                      </div>
                    )}
                  </div>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <main className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-0'}`}>
      </main>
    </div>
  );
};

export default Sidebar;