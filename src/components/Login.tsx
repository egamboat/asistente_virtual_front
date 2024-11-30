import decodeJwt from "@/utils/decodeJwt";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState<string | null>(null);

  async function sendTokenToBackend(token: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}usuario/api/google-login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      console.error('Data', data);

      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        window.location.href = '/asistente/';

      } else {
        console.error('Error al autenticar con el backend:',response);
      }
    } catch (error) {
      console.error('Error al enviar el token al backend:', error);
    }
  }

  async function handleSuccess(credentialResponse: any) {

    if (credentialResponse.credential) {
      const { payload } = decodeJwt(credentialResponse.credential);
      const token=(credentialResponse.credential);
      localStorage.setItem('token', credentialResponse.credential);

      const { email, picture, name } = payload;

      const response = await fetch("/api/google", {
        method: "POST",
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });
      const json = await response.json();

      await sendTokenToBackend(token);

      // localStorage.setItem('userData', JSON.stringify(json));
      localStorage.setItem("userData", JSON.stringify({ ...json, picture, name }));

      window.location.href = '/asistente/'
      setEmail(json.email);
    }
  }

  function handleError() {
    console.log("Login failed");
  }


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
