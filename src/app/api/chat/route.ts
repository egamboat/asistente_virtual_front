import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

const promptBase = `
  Eres un asistente de agenda. Tu tarea es convertir las solicitudes de los usuarios en eventos con el siguiente formato JSON:

  {
    "id": "1",
    "agendaId": "A001",
    "titulo": "",
    "tipoEventoId": "",
    "descripcion": "",
    "fechaInicio": "",
    "fechaFin": "",
    "modalidad": "",
    "completo": false
  }

  Reglas:
  1. Si todos los campos requeridos (titulo, descripcion, fechaInicio y modalidad) están presentes, marca "completo": true.
  2. Si falta algún dato, marca "completo": false y pregunta al usuario por los campos que faltan.
  3. Devuelve el JSON en el formato indicado, seguido de una respuesta al usuario.

  Ejemplo:
  Usuario: Agendar reunión para mañana a las 10
  Respuesta:
  JSON:
  {
    "id": "1",
    "agendaId": "A001",
    "titulo": "Reunión",
    "tipoEventoId": "",
    "descripcion": "",
    "fechaInicio": "2024-11-17T10:00:00",
    "fechaFin": "",
    "modalidad": "",
    "completo": false
  }
  Respuesta al usuario: ¿La reunión será presencial o virtual?
  `;

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const systemMessage = {
    role: "system",
    content: promptBase,
  };
  const allMessages = [systemMessage, ...messages];


  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: allMessages,
  })


  const stream = OpenAIStream(response)
  console.log("respuesta gpt", stream)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
