import { Evento } from "@/interfaces/interfaceEventos";

export const DataEvento: Evento[] = [
  {
    id: 1,
    modalidad_descripcion: 'Virtual',
    descripcion: 'Reunión de coordinación y definición de avance.',
    fecha_inicio: '2024-11-01T09:00:00',
    fecha_fin: '2024-11-01T11:00:00',
    tipo_evento: 1,
    modalidad: 1,
  },
  {
    id: 2,
    modalidad_descripcion: 'Virtual',
    descripcion: 'Planificación de sprint 4',
    fecha_inicio: '2024-11-03T14:00:00',
    fecha_fin: '2024-11-03T16:00:00',
    tipo_evento: 2,
    modalidad: 1,
  },
  {
    id: 3,
    modalidad_descripcion: 'Presencial',
    descripcion: 'Presentación de demo',
    fecha_inicio: '2024-11-05T16:00:00',
    fecha_fin: '2024-11-05T17:00:00',
    tipo_evento: 3,
    modalidad: 2,
  },
  {
    id: 4,
    modalidad_descripcion: 'Presencial',
    descripcion: 'Reunión de coordinación y definición de avance.',
    fecha_inicio: '2024-11-01T09:00:00',
    fecha_fin: '2024-11-01T11:00:00',
    tipo_evento: 1,
    modalidad: 2,
  },
];

export const Usuario = {
  id: "1",
  nombre: "Juan Perez",
  correoElectronico: "juan.perez@example.com",
  celular: "1234567890",
  rol: "Admin",
  fechaIngreso: "2023-01-01",
  docente: {
    facultad: "Ingeniería",
    cargo: "Profesor Titular",
    titulo: "PhD en Ciencias Computacionales",
    zonaHoraria: "GMT-5",
  },
  
};

