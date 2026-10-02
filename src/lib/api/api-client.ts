import { API_CONFIG } from './api.config';
import {
  ApiError,
  type ApiErrorResponse,
} from './api.types';

type ApiRequestOptions = RequestInit & {
  token?: string;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { token, headers, ...requestOptions } = options;

  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}${endpoint}`,
      {
        ...requestOptions,

        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',

          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),

          ...headers,
        },
      }
    );

    if (!response.ok) {
      let errorData: ApiErrorResponse | null = null;

      try {
        errorData = await response.json();
      } catch {
        // La respuesta del backend no contiene JSON válido.
      }

      const backendMessage = errorData?.message;

      const message = Array.isArray(backendMessage)
        ? backendMessage.join(', ')
        : backendMessage ??
          `Error HTTP ${response.status}`;

      throw new ApiError({
        type: 'HTTP_ERROR',
        statusCode: response.status,
        message,
        details: errorData?.details,
      });
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new ApiError({
        type: 'API_UNAVAILABLE',
        message:
          'No se pudo establecer conexión con el servidor.',
      });
    }

    throw new ApiError({
      type: 'UNKNOWN',
      message: 'Ocurrió un error inesperado.',
    });
  }
}