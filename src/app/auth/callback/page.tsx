// app/auth/callback/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      console.log(params)
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        console.error('Error en la autenticación:', error);
        // Maneja el error según sea necesario
        return;
      }

      if (code) {
        try {
          const response = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });

          const data = await response.json();
          console.log(data)

          if (data.error) {
            console.error('Error al obtener tokens:', data.error);
            // Maneja el error según sea necesario
          } else {
            // Almacenar los tokens de forma segura
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            // Redirigir a tu aplicación principal
            router.push('/asistente/');
          }
        } catch (err) {
          console.error('Error al intercambiar el código:', err);
        }
      }
    };

    handleAuth();
  }, [router]);

  return <div>Cargando...</div>;
}
