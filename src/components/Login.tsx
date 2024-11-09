import decodeJwt from "@/utils/decodeJwt";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { googleLogout } from "@react-oauth/google";

export default function Login() {
  const [email, setEmail] = useState<string | null>(null);

  async function handleSuccess(credentialResponse: CredentialResponse) {
    console.log("credentialResponse", credentialResponse);
    if (credentialResponse.credential) {
      const { payload } = decodeJwt(credentialResponse.credential);

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
      window.location.href='/asistente/'
      setEmail(json.email);
    }
  }

  function handleError() {
    console.log("Login failed");
  }

  const logOut = () => {
    googleLogout();
    setEmail(null);
  };


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
