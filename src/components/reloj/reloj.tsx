"use client";
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const Reloj = () => {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setHora(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <p className="font-bold">
        {format(hora, 'HH:mm:ss')}
      </p>
    </div>
  );
}

export default Reloj;
