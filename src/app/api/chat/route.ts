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
    "descripcion": "",
    "fecha_inicio": "",
    "fecha_fin": "",
    "tipo_evento": "",
    "modalidad": "",
    "completo": false
  }

  Reglas:
  1. Si todos los campos requeridos (descripcion, fechaInicio y modalidad) están presentes, marca "completo": true.
  2. Si falta algún dato, marca "completo": false y pregunta al usuario por los campos que faltan.
  3. Devuelve el JSON en el formato indicado, seguido de una respuesta al usuario.
  4. Para modalidad debes regresar un id tipo number, 1 para "Presencial" y 2 para "Remoto".
  5. Para tipo evento debes regresar un id tipo number, 1 para "Reunión", 2 para "Clases", 3 para "Recordatorio", 4 para "Tutoría" y 5 para "Otros"
  6. Recuerda transformar de manera correcta las horas de formato am o pm a 24 horas

  Ejemplo:
  Usuario: Agendar reunión para mañana a las 10pm
  Respuesta:
  JSON:
  {
    "descripcion": "Reunion a las 10pm",
    "fecha_inicio": "2024-11-22T10:00:00",
    "fecha_fin": "",
    "tipo_evento": "Reunión",
    "modalidad": "Presencial",
    "completo": false
  }
  Respuesta al usuario: ¿La reunión será presencial o remota?
  Cuando la respuesta sea completa, da un mensaje de que el evento ha sido enviado

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
