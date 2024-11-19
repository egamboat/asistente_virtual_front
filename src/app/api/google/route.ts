import { CLIENT_ID } from "@/consts/clientId";
import { OAuth2Client } from "google-auth-library";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const client = new OAuth2Client(CLIENT_ID);
  if (!body) {
    const response = NextResponse.json(
      {
        message: "Invalid body",
      },
      {
        status: 400,
      }
    );
    return response;
  }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function verify(body: any) {
    const ticket = await client.verifyIdToken({
      idToken: body.token,
      audience: CLIENT_ID,
    });
    console.log("lool");
    const payload = ticket.getPayload();
    return payload;
  }

  try {
    const payload = await verify(body).catch(console.error);
    return NextResponse.json(payload);

    // try {
    //   const payload = await verify(body);
  
    //   // Enviar el payload verificado al backend
    //   const backendResponse = await fetch("http://localhost:8000/auth/google/", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ payload }),
    //   });
  
    //   if (!backendResponse.ok) {
    //     return NextResponse.json(
    //       { message: "Backend authentication failed" },
    //       { status: backendResponse.status }
    //     );
    //   }
  
    //   const tokens = await backendResponse.json();
    //   return NextResponse.json(tokens);
  } catch (error) {
    const response = NextResponse.json(
      {
        code: 400,
        message: error instanceof Error ? error.message : "Unknown",
      },
      {
        status: 400,
      }
    );
    return response;
  }
}
