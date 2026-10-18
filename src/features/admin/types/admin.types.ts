
export type VendedorEstado =
  | 'pendiente'
  | 'activo'
  | 'inactivo'
  | 'bloqueado';

export type VendedorAdmin = {
  id: string;
  nombre: string;
  apellido?: string | null;
  empresa?: string | null;
  email: string;
  telefono?: string | null;
  ciudad?: string | null;
  estado: VendedorEstado;
  createdAt: string;
};

export type CambiarEstadoVendedorRequest = {
  estado: 'activo' | 'inactivo' | 'bloqueado';
};

export type VendedoresListResponse = {
  data: VendedorAdmin[];
  pagination: PaginationResponse;
};

export type PaginationResponse = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};