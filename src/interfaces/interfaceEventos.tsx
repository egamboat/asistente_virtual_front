export interface Evento {
  id: number;
  modalidad_descripcion: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  tipo_evento: number;
  modalidad: number;
}

export interface EventoCalendar {
  id: number;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin?: string;
  modalidad: number;
  tipo_evento: number;
  modalidad_descripcion: string;
  title?: string; // Propiedad opcional para FullCalendar
  start?: string; // Propiedad opcional para FullCalendar
  end?: string; // Propiedad opcional para FullCalendar
  extendedProps?: {
    modalidad_descripcion: string;
    tipo_evento: number;
    modalidad: number;
    descripcionCompleta: string;
  };
}
