export interface Programa {
  id: string | number;
  nombre: string;
  tipo_programa: string;
  facultad: string;
  descripcion: string;
  url_detalle: string;
  imagen_url: string;
}

export interface Evento {
  id: string | number;
  nombre: string;
  fecha: string;
  descripcion: string;
}

export interface Lead {
  id: string | number;
  nombre: string;
  tipo_documento: string;
  documento: string;
  email: string;
  telefono: string;
  programa_interes: string;
  facultad: string;
  fecha_inscripcion: string;
  evento_inscrito?: string;
}