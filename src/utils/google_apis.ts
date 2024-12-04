// src/services/googleCalendarApi.ts

export interface EventDataGoogle {
  summary?: string;
  description?: string;
  start?: {
    dateTime: string;
    timeZone?: string;
  };
  end?: {
    dateTime: string;
    timeZone?: string;
  };
  // Agrega otros campos según tus necesidades
}

// Función para obtener eventos
export const getEvents = async (accessToken: string): Promise<any|null> => {
  try {
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error(`Error al crear evento: ${data.error.message}`);
      return null;
    }
  } catch (error) {
    console.error('Error al crear el evento:', error);
    return null;
  }
};

// Función para crear un evento
export const createEvent = async (accessToken: string, eventData: EventDataGoogle): Promise<any | null> => {
  try {
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();
    if (response.ok) {
      return data; // Retorna el evento creado
    } else {
      console.error(`Error al crear evento: ${data.error.message}`);
      return null;
    }
  } catch (error) {
    console.error('Error al crear el evento:', error);
    return null;
  }
};


// Función para actualizar un evento
export const updateEvent = async (accessToken: string, eventId: string, updatedEventData: EventDataGoogle): Promise<any | null> => {
  try {
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEventData),
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      // toast.error(`Error al actualizar evento: ${data.error.message}`);
      return null;
    }
  } catch (error) {
    console.error('Error al actualizar el evento:', error);
    return null;
  }
};

// Función para eliminar un evento
export const deleteEvent = async (accessToken: string, eventId: string): Promise<boolean> => {
  try {
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      return true;
    } else {
      const data = await response.json();
      console.error(`Error al eliminar evento: ${data.error.message}`);
      return false;
    }
  } catch (error) {
    console.error('Error al eliminar el evento:', error);
    return false;
  }
};
