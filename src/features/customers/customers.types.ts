export type CustomerVendor = {
  id: string;
  nombre: string;
  apellido: string;
  empresa: string | null;
};

export type CustomerPortfolioCount = {
  cartera: number;
};

export type UpdateCustomerData = {
  nombre?: string;
  apellido?: string;
  dni?: string;
  telefono?: string;
  tipoFactura?: string;

  direccionCalle?: string;
  direccionNumero?: string;
  direccionPiso?: string;
  direccionReferencia?: string;
  direccionBarrio?: string;
  direccionCiudad?: string;
  direccionProvincia?: string;
  direccionCp?: string;

  mismaDireccionEntrega?: boolean;

  entregaCalle?: string;
  entregaNumero?: string;
  entregaPiso?: string;
  entregaReferencia?: string;
  entregaBarrio?: string;
  entregaCiudad?: string;
  entregaProvincia?: string;
  entregaCp?: string;

  latitud?: number;
  longitud?: number;
};

export type Customer = {
  id: string;
  auth_user_id: string;

  nombre: string;
  apellido: string;

  dni: string;
  telefono: string;

  tipo_factura: string;

  direccion_calle: string;
  direccion_numero: string;
  direccion_piso: string | null;
  direccion_referencia: string | null;
  direccion_barrio: string;
  direccion_ciudad: string;
  direccion_provincia: string;
  direccion_cp: string;

  misma_direccion_entrega: boolean;

  entrega_calle: string | null;
  entrega_numero: string | null;
  entrega_piso: string | null;
  entrega_referencia: string | null;
  entrega_barrio: string | null;
  entrega_ciudad: string | null;
  entrega_provincia: string | null;
  entrega_cp: string | null;

  latitud: string | null;
  longitud: string | null;

  vendedor_id: string;

  created_at: string;
  updated_at: string;

  vendedor: CustomerVendor;

  _count: CustomerPortfolioCount;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CustomerPortfolioResponse = {
  data: Customer[];
  pagination: Pagination;
};