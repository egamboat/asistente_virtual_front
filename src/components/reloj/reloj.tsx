"use client";
import 'regenerator-runtime/runtime';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const Reloj = () => {
  const [hora, setHora] = useState<Date | null>(null);
  useEffect(() => {
    // Establecer el tiempo al montar
    setHora(new Date());

    const timer = setInterval(() => {
      setHora(new Date());
    }, 1000);

    return () => clearInterval(timer); // Limpiar el intervalo al desmontar
  }, []);

  if (!hora) {
    // Renderizar un marcador de posición mientras se inicializa
    return <p className="font-bold">Cargando...</p>;
  }

  return (
    <div>
      <p className="font-bold">{format(hora, 'HH:mm:ss')}</p>
    </div>
  );
};

export default Reloj;
