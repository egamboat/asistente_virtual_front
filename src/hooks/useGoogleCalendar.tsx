// src/hooks/useGoogleCalendar.tsx

import { useState, useEffect } from 'react';

import { getEvents, createEvent, updateEvent, deleteEvent, EventDataGoogle } from '@/utils/google_apis';

export const useGoogleCalendar = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [accessTokenGoogle, setAccessTokenGoogle] = useState<string | null>(null);
  const timeZone = 'America/Guayaquil';

  useEffect(() => {
    const token = localStorage.getItem('google_access_token');
    setAccessTokenGoogle(token);
  }, []);

  const loadEvents = async () => {
    if (!accessTokenGoogle) return;
    const eventsData = await getEvents(accessTokenGoogle);
    setEvents(eventsData);
  };

  const addEvent = async (eventData: EventDataGoogle) => {
    if (!accessTokenGoogle) return;
    const newEvent = await createEvent(accessTokenGoogle, eventData);
    if (newEvent) {
      setEvents([...events, newEvent]);
    }
    return newEvent; // Retorna el evento creado
  };
  
  

  const modifyEvent = async (eventId: string, updatedEventData: EventDataGoogle) => {
    if (!accessTokenGoogle) return;
    const updatedEvent = await updateEvent(accessTokenGoogle, eventId, updatedEventData);
    if (updatedEvent) {
      setEvents(events.map(event => (event.id === eventId ? updatedEvent : event)));
    }
  };

  const removeEvent = async (eventId: string) => {
    if (!accessTokenGoogle) return;
    const success = await deleteEvent(accessTokenGoogle, eventId);
    if (success) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  return {
    events,
    loadEvents,
    addEvent,
    modifyEvent,
    removeEvent,
    timeZone,
  };
};
