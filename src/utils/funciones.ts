import { customFetch } from "@/components/refresh_token";
import { toast } from "react-toastify";

// Función para editar un evento
export const editarEvento = async (id: number, dataSend: any) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/asistente/api/eventos/${id}/`;
        const response = await customFetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataSend),
        });

        if (response.ok) {
            const updatedEvent = await response.json();
            // toast.success('Evento actualizado con éxito');
            return updatedEvent;
        } else {
            const errorData = await response.json();
            toast.error(`Error al actualizar el evento: ${errorData.detail || "Error desconocido"}`);
        }
    } catch (error) {
        console.error("Error al actualizar el evento:", error);
        toast.error("Error al actualizar el evento. Por favor, inténtalo de nuevo.");
    }
};

// Función para eliminar un evento
export const eliminarEvento = async (id: number) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/asistente/api/eventos/${id}/`;
        const response = await customFetch(url, { method: 'DELETE' });

        if (response.ok) {
            // toast.success("Evento eliminado con éxito");
            return true;
        } else {
            const errorData = await response.json();
            toast.error(`Error al eliminar el evento: ${errorData.detail || "Error desconocido"}`);
            return false;
        }
    } catch (error) {
        console.error("Error al eliminar el evento:", error);
        toast.error("Error al eliminar el evento. Por favor, inténtalo de nuevo.");
        return false;
    }
};

// Función para cargar eventos
export const cargarEventos = async () => {
    try {
        const response = await customFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/asistente/api/eventos/`, {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorData = await response.json();
            console.error('Error al obtener los eventos:', errorData);
            throw errorData;
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        throw error;
    }
};

// Función para crear evento
export const crearEvento = async (dataSend: any) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/asistente/api/eventos/`;
  
      const response = await customFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataSend),
      });
  
      if (response.ok) {
        const newEvent = await response.json();
        toast.success('Evento creado con éxito');
        return newEvent;
      } else {
        const errorData = await response.json();
        toast.error(`Error al crear el evento: ${errorData.detail || "Error desconocido"}`);
        throw new Error(errorData.detail || "Error desconocido");
      }
    } catch (error) {
      console.error("Error al crear el evento:", error);
      toast.error("Error al crear el evento. Por favor, inténtalo de nuevo.");
      throw error;
    }
  };