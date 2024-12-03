import jwt_decode from 'jwt-decode';
import { NextRequest, NextResponse } from "next/server";

interface JwtPayload {
  email: string;
  name: string;
  picture: string;
}


export async function POST(req: NextRequest) {
  const { code } = await req.json();

  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
  const REDIRECT_URI = "http://localhost:3000/auth/callback"; // Asegúrate de que el URI esté registrado

  if (!CLIENT_ID || !CLIENT_SECRET || !code) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }
  console.log("Llega a la peticion")
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("Error al obtener tokens:", tokenData.error);
      return NextResponse.json({ error: tokenData.error }, { status: 400 });
    }

    const decoded: JwtPayload = jwt_decode(tokenData.id_token);
    const { email, name, picture } = decoded;

    // Guardar los datos en localStorage
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem('userData', JSON.stringify({ email, name, picture }));
      localStorage.setItem('access_token', tokenData.access_token);
      localStorage.setItem('refresh_token', tokenData.refresh_token);
      localStorage.setItem('id_token', tokenData.id_token);
    }


    // Si todo es correcto, devolvemos los tokens
    return NextResponse.json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type,
      id_token: tokenData.id_token,
    });
  } catch (error) {
    console.error("Error en la solicitud de tokens:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
