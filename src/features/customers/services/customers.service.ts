import { apiRequest } from '@/lib/api/api-client';

import type {
  Customer,
  CustomerPortfolioResponse,
} from '../customers.types';

type GetCustomerPortfolioParams = {
  token: string;
};

type GetCustomerByIdParams = {
  id: string;
  token: string;
};

export function getCustomerPortfolio({
  token,
}: GetCustomerPortfolioParams): Promise<CustomerPortfolioResponse> {
  return apiRequest<CustomerPortfolioResponse>(
    '/api/v1/clientes/cartera',
    {
      method: 'GET',
      token,
    }
  );
}

export function getCustomerById({
  id,
  token,
}: GetCustomerByIdParams): Promise<Customer> {
  return apiRequest<Customer>(
    `/api/v1/clientes/own/get-by-id/${encodeURIComponent(id)}`,
    {
      method: 'GET',
      token,
    }
  );
}