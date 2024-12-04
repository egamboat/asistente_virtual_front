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
          } else {
            localStorage.setItem('google_access_token', data.access_token);
            localStorage.setItem('google_refresh_token', data.refresh_token);
            localStorage.setItem('google_id_token', data.id_token);
            localStorage.setItem('google_expires_in', data.expires_in.toString());
            localStorage.setItem('google_token_type', data.token_type);

            // Envía el id_token al backend
            const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}usuario/api/google-login/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: data.id_token }),
            });

            const backendData = await backendResponse.json();

            if (backendResponse.ok) {
              localStorage.setItem('backend_access_token', backendData.access);
              localStorage.setItem('backend_refresh_token', backendData.refresh);

              router.push('/asistente/');
            } else {
              console.error('Error al autenticar con el backend:', backendData);
            }
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
