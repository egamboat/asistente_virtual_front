// import decodeJwt from "@/utils/decodeJwt";
// import { GoogleLogin } from "@react-oauth/google";
// import { useEffect, useState } from "react";

// export default function Login() {
//   const [email, setEmail] = useState<string | null>(null);

//   async function sendTokenToBackend(token: string) {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}usuario/api/google-login/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ token }),
//       });

//       const data = await response.json();
//       console.error('Data', data);

//       if (response.ok) {
//         localStorage.setItem('access_token', data.access);
//         localStorage.setItem('refresh_token', data.refresh);

//         window.location.href = '/asistente/';

//       } else {
//         console.error('Error al autenticar con el backend:',response);
//       }
//     } catch (error) {
//       console.error('Error al enviar el token al backend:', error);
//     }
//   }

//   async function handleSuccess(credentialResponse: any) {

//     if (credentialResponse.credential) {
//       const { payload } = decodeJwt(credentialResponse.credential);
//       const token=(credentialResponse.credential);
//       localStorage.setItem('token', credentialResponse.credential);

//       const { email, picture, name } = payload;

//       const response = await fetch("/api/google", {
//         method: "POST",
//         body: JSON.stringify({
//           token: credentialResponse.credential,
//         }),
//       });
//       const json = await response.json();

//       await sendTokenToBackend(token);

//       // localStorage.setItem('userData', JSON.stringify(json));
//       localStorage.setItem("userData", JSON.stringify({ ...json, picture, name }));

//       window.location.href = '/asistente/'
//       setEmail(json.email);
//     }
//   }

//   function handleError() {
//     console.log("Login failed");
//   }


//   useEffect(() => {
//     console.log(GoogleLogin);
//   }, []);

//   return (
//     <div>
//       {!email && (
//         <GoogleLogin
//           onSuccess={handleSuccess}
//           onError={handleError}
//           useOneTap
//         />
//       )}
//     </div>
//   );
// }

// Login.tsx
import { useEffect, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState<string | null>(null);

  // const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
  const CLIENT_ID = "523092773771-idoq5bggshdhd6n4njd9maqacitcpkll.apps.googleusercontent.com"
  const REDIRECT_URI = 'http://localhost:3000/auth/callback'; // Ajusta si es necesario

  function loginWithGoogle() {
    const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar');
    const responseType = 'code';
    const accessType = 'online';
    const includeGrantedScopes = 'true';
    const prompt = 'consent';

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${responseType}&scope=${scope}&access_type=${accessType}&include_granted_scopes=${includeGrantedScopes}&prompt=${prompt}`;

    window.location.href = authUrl;
  }

  return (
    <div>
      {!email && (
        <button onClick={loginWithGoogle}>Iniciar sesión con Google</button>
      )}
    </div>
  );
}
