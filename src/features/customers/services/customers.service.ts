import { apiRequest } from '@/lib/api/api-client';

import type {
  CustomerPortfolioResponse,
} from '../customers.types';

type GetCustomerPortfolioParams = {
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