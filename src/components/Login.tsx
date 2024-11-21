import decodeJwt from "@/utils/decodeJwt";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
// import { googleLogout } from "@react-oauth/google";

export default function Login() {
  const [email, setEmail] = useState<string | null>(null);

  async function sendTokenToBackend(token: string) {
    try {
      const response = await fetch('http://localhost:8000/usuario/api/google-login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guarda los tokens JWT en el almacenamiento local
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        // Redirige o actualiza el estado de autenticación
        window.location.href = '/asistente/';
      } else {
        console.error('Error al autenticar con el backend:', data.error);
      }
    } catch (error) {
      console.error('Error al enviar el token al backend:', error);
    }
  }

  async function handleSuccess(credentialResponse: any) {
    // debugger;
    // console.log("credentialResponse", credentialResponse);
    if (credentialResponse.credential) {
      const { payload } = decodeJwt(credentialResponse.credential);
      const token=(credentialResponse.credential);
      localStorage.setItem('token', credentialResponse.credential);

      // Llamar a la función para enviar el token al backend
      await sendTokenToBackend(token);
      console.log("payload credential", payload);
      const response = await fetch("/api/google", {
        method: "POST",
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });
      const json = await response.json();


      localStorage.setItem('userData', JSON.stringify(json));
      console.log("Objeto JSON guardado en localStorage");
      window.location.href = '/asistente/'
      setEmail(json.email);
    }
  }

  function handleError() {
    console.log("Login failed");
  }

  // const logOut = () => {
  //   googleLogout();
  //   setEmail(null);
  // };
  useEffect(() => {
    console.log(GoogleLogin);
  }, []);

  return (
    <div>
      {!email && (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
        />
      )}
    </div>
  );
}
