"use client";
import 'regenerator-runtime/runtime';
import Link from 'next/link'
import React from 'react';
// import store from '@/shared/redux/store';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex items-center justify-between w-full max-w-4xl p-6">
        <div>
          <h1 className="text-4xl font-bold mb-4 text-white">
            Bienvenido a Tu Asistente Virtual
          </h1>
          <p className="text-lg mb-8 text-gray-300">
            Simplifica tus tareas diarias con nuestra ayuda.
          </p>
        </div>
        <a href="/login">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
            Iniciar Sesión
          </button>
        </a>
      </div>
    </div>
  );
}

