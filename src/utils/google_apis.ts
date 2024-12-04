// src/services/googleCalendarApi.ts

import { toast } from 'react-toastify';

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
export const getEvents = async (accessToken: string): Promise<any[]> => {
  try {
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      toast.success('Eventos cargados exitosamente');
      return data.items;
    } else {
      toast.error(`Error al obtener eventos: ${data.error.message}`);
      return [];
    }
  } catch (error) {
    toast.error('Error obteniendo eventos');
    console.error('Error obteniendo eventos:', error);
    return [];
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
      toast.success('Evento creado exitosamente');
      return data;
    } else {
      toast.error(`Error al crear evento: ${data.error.message}`);
      return null;
    }
  } catch (error) {
    toast.error('Error al crear el evento');
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
      toast.success('Evento actualizado exitosamente');
      return data;
    } else {
      toast.error(`Error al actualizar evento: ${data.error.message}`);
      return null;
    }
  } catch (error) {
    toast.error('Error al actualizar el evento');
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
      toast.success('Evento eliminado exitosamente');
      return true;
    } else {
      const data = await response.json();
      toast.error(`Error al eliminar evento: ${data.error.message}`);
      return false;
    }
  } catch (error) {
    toast.error('Error al eliminar el evento');
    console.error('Error al eliminar el evento:', error);
    return false;
  }
};
