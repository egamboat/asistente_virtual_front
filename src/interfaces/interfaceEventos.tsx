export interface Evento {
  id: number;
  modalidad_descripcion: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  tipo_evento: number;
  modalidad: number;
}
