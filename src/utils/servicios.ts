export const handleEditEvent = async (
  message: any, // Se usa any para ignorar la validación estricta
  append: (message: any) => Promise<void>
) => {
  console.log("Editar evento:", message.content);

  await append({
    role: "assistant",
    content: "He editado tu evento exitosamente.",
  });
};

export const handleDeleteEvent = async (
  message: any,
  append: (message: any) => Promise<void>
) => {
  console.log("Eliminar evento:", message.content);

  await append({
    role: "assistant",
    content: "He eliminado tu evento exitosamente.",
  });
};

export const handleConsultEvents = async (
  message: any,
  append: (message: any) => Promise<void>
) => {
  console.log("Consultar eventos:", message.content);

  await append({
    role: "assistant",
    content: "Aquí están los eventos consultados.",
  });
};
