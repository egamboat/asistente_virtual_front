import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

const promptBase = (currentDateTime: string) => `
  Eres un asistente de agenda. Tu tarea es convertir las solicitudes de los usuarios en eventos con el siguiente formato JSON:

  {
    "titulo": "",
    "descripcion": "",
    "fecha_inicio": "",
    "fecha_fin": "",
    "tipo_evento": "",
    "modalidad": "",
    "completo": false
  }

  Reglas:
  1. Si todos los campos requeridos (titulo, descripcion, fecha_inicio, tipo_evento y modalidad) están presentes, marca "completo": true.
  2. Si falta algún dato, marca "completo" como bool "false" ("completo": false) y pregunta al usuario por los campos que faltan.
  3. Devuelve el JSON en el formato indicado, seguido de una respuesta al usuario.
  4. Para modalidad debes regresar un id tipo number, 1 para "Presencial" y 2 para "Remoto".
  5. Para tipo_evento debes regresar un id tipo number, 1 para "Reunión", 2 para "Clases", 3 para "Recordatorio", 4 para "Tutoría" y 5 para "Otros"
  6. Recuerda transformar de manera correcta las horas de formato am o pm a 24 horas, y procesar palabras como medio día y media noche.
  7. Respeta la zona horaria de "America/Guayaquil".
  8. No es necesario que muestres al usuario todas las opciones ni los Id de tipo de evento ni de modalidad, solo preguntale cual desea colocar.
  9. Tus respuestas para el usuario no deben ser tan largas.
  La hora actual al momento de realizar la solicitud es: ${currentDateTime}

  Ejemplo:
  Usuario: Agendar reunión para mañana a las 10pm
  Respuesta:
  JSON:
  {
    "titulo": "Evento de presentación",
    "descripcion": "Evento a las 10pm sobre ....",
    "fecha_inicio": "2024-11-22T10:00:00",
    "fecha_fin": "",
    "tipo_evento": "Reunión",
    "modalidad": "Presencial",
    "completo": false
  }
  Respuesta al usuario: ¿La reunión será presencial o remota?
  Cuando la respuesta sea completa, da un mensaje de que el evento ha sido enviado. 
  Si se hace una solicitud despues que se haya completado los datos, haz que completo sea "completo": false otra vez.
  Si el usuario menciona algo de acciones como EDITAR o ELIMINAR, menciona que actualmente esas acciones no se encuentran disponibles.
  `;

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const currentDateTime = new Date().toISOString();

  const systemMessage = {
    role: "system",
    content: promptBase(currentDateTime),
  };

  const allMessages = [systemMessage, ...messages];

  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    stream: true,
    messages: allMessages,
  })


  const stream = OpenAIStream(response)
  console.log("respuesta gpt", stream)

  return new StreamingTextResponse(stream)
}
