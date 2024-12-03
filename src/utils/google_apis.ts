export const createGoogleCalendarEvent = async (
    calendarId: string,
    accessToken: string,
    eventData: {
      summary: string;
      description?: string | null; // Permitir null
      location?: string | null; // Permitir null
      start: { dateTime: string; timeZone: string };
      end: { dateTime: string; timeZone: string };
    }
  ) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(eventData),
        }
      );
  
      if (response.ok) {
        console.log("Evento creado en Google Calendar");
        return { success: true, message: "Evento creado exitosamente" };
      } else {
        console.error("Error al crear el evento:", response.statusText);
        return { success: false, message: response.statusText };
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return { success: false, message: "Error en la solicitud al servidor" };
    }
  };
  