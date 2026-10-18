import { apiRequest } from '@/lib/api/api-client';

type GetOrdersParams = {
  token: string;
};

export function getOrders({
  token,
}: GetOrdersParams): Promise<unknown[]> {
  return apiRequest<unknown[]>(
    '/api/v1/orders/list',
    {
      method: 'GET',
      token,
    }
  );
}