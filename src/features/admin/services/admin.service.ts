
import { apiRequest } from '@/lib/api/api-client';

import type {
  VendedorAdmin,
  CambiarEstadoVendedorRequest,
  VendedoresListResponse,
} from '../types/admin.types';


export function getAdminVendedores({
  token,
  estado,
  page = 1,
  limit = 20,
  search,
}: {
  token: string;
  estado?: 'pendiente' | 'activo' | 'inactivo' | 'bloqueado';
  page?: number;
  limit?: number;
  search?: string;
}): Promise<VendedoresListResponse> {
  const params = new URLSearchParams();

  params.set('page', String(page));
  params.set('limit', String(limit));

  if (estado) {
    params.set('estado', estado);
  }

  if (search?.trim()) {
    params.set('search', search.trim());
  }

  return apiRequest<VendedoresListResponse>(
    `/api/v1/vendedores/list?${params.toString()}`,
    {
      method: 'GET',
      token,
    }
  );
}


export function getAdminVendedorById({
  token,
  vendedorId,
}: {
  token: string;
  vendedorId: string;
}): Promise<VendedorAdmin> {
  return apiRequest<VendedorAdmin>(
    `/api/v1/vendedores/get-by-id/${encodeURIComponent(vendedorId)}`,
    {
      method: 'GET',
      token,
    }
  );
}

export function cambiarEstadoVendedor({
  token,
  vendedorId,
  data,
}: {
  token: string;
  vendedorId: string;
  data: CambiarEstadoVendedorRequest;
}): Promise<VendedorAdmin> {
  return apiRequest<VendedorAdmin>(
    `/api/v1/vendedores/change-estado/${encodeURIComponent(vendedorId)}`,
    {
      method: 'PATCH',
      token,
      body: JSON.stringify(data),
    }
  );
}
