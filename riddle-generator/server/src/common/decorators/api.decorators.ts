import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

// Декоратор для authenticated endpoints
export function ApiAuthEndpoint(summary: string, description?: string) {
  return applyDecorators(
    ApiOperation({ summary, description }),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({ status: 401, description: 'Не автентифікований користувач' }),
    ApiResponse({ status: 403, description: 'Недостатньо прав доступу' }),
  );
}

// Декоратор для public endpoints
export function ApiPublicEndpoint(summary: string, description?: string) {
  return applyDecorators(ApiOperation({ summary, description }));
}

// Декоратор для CRUD операцій
export function ApiCrudEndpoint(
  operation: 'create' | 'read' | 'update' | 'delete',
  resource: string,
  options?: {
    requireAuth?: boolean;
    summary?: string;
    description?: string;
  },
) {
  const defaultSummaries = {
    create: `Створити ${resource}`,
    read: `Отримати ${resource}`,
    update: `Оновити ${resource}`,
    delete: `Видалити ${resource}`,
  };

  const defaultDescriptions = {
    create: `Створює новий запис ${resource}`,
    read: `Повертає інформацію про ${resource}`,
    update: `Оновлює існуючий запис ${resource}`,
    delete: `Видаляє запис ${resource}`,
  };

  const decorators = [
    ApiOperation({
      summary: options?.summary ?? defaultSummaries[operation],
      description: options?.description ?? defaultDescriptions[operation],
    }),
  ];

  if (options?.requireAuth !== false) {
    decorators.push(
      ApiBearerAuth('JWT-auth'),
      ApiResponse({ status: 401, description: 'Не автентифікований користувач' }),
    );
  }

  // Додаємо специфічні для операції responses
  switch (operation) {
    case 'create':
      decorators.push(
        ApiResponse({ status: 201, description: `${resource} успішно створено` }),
        ApiResponse({ status: 400, description: 'Невірні дані запиту' }),
      );
      break;
    case 'read':
      decorators.push(
        ApiResponse({ status: 200, description: `${resource} знайдено` }),
        ApiResponse({ status: 404, description: `${resource} не знайдено` }),
      );
      break;
    case 'update':
      decorators.push(
        ApiResponse({ status: 200, description: `${resource} успішно оновлено` }),
        ApiResponse({ status: 404, description: `${resource} не знайдено` }),
        ApiResponse({ status: 400, description: 'Невірні дані запиту' }),
      );
      break;
    case 'delete':
      decorators.push(
        ApiResponse({ status: 200, description: `${resource} успішно видалено` }),
        ApiResponse({ status: 404, description: `${resource} не знайдено` }),
      );
      break;
  }

  return applyDecorators(...decorators);
}

// Декоратор для pagination endpoints
export function ApiPaginationEndpoint(
  resource: string,
  options?: {
    requireAuth?: boolean;
    filters?: string[];
  },
) {
  const decorators = [
    ApiOperation({
      summary: `Отримати список ${resource} з пагінацією`,
      description: `Повертає пагінований список ${resource} з можливістю фільтрації`,
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Номер сторінки',
      type: 'number',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Кількість елементів на сторінці',
      type: 'number',
      example: 10,
    }),
    ApiQuery({ name: 'search', required: false, description: 'Пошуковий запит', type: 'string' }),
    ApiResponse({
      status: 200,
      description: `Список ${resource}`,
      schema: {
        type: 'object',
        properties: {
          data: { type: 'array', items: { type: 'object' } },
          total: { type: 'number', example: 100 },
          page: { type: 'number', example: 1 },
          limit: { type: 'number', example: 10 },
          totalPages: { type: 'number', example: 10 },
        },
      },
    }),
  ];

  // Додаємо фільтри якщо вони є
  if (options?.filters) {
    options.filters.forEach(filter => {
      decorators.push(
        ApiQuery({
          name: filter,
          required: false,
          description: `Фільтр за ${filter}`,
          type: 'string',
        }),
      );
    });
  }

  if (options?.requireAuth !== false) {
    decorators.push(
      ApiBearerAuth('JWT-auth'),
      ApiResponse({ status: 401, description: 'Не автентифікований користувач' }),
    );
  }

  return applyDecorators(...decorators);
}

// Декоратор для file upload endpoints
export function ApiFileUploadEndpoint(
  summary: string,
  options?: {
    fileType?: string;
    maxSize?: string;
  },
) {
  return applyDecorators(
    ApiOperation({
      summary,
      description: `Завантаження файлу${options?.fileType ? ` типу ${options.fileType}` : ''}${options?.maxSize ? `. Максимальний розмір: ${options.maxSize}` : ''}`,
    }),
    ApiBearerAuth('JWT-auth'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: `Файл для завантаження${options?.fileType ? ` (${options.fileType})` : ''}`,
          },
        },
      },
    }),
    ApiResponse({ status: 201, description: 'Файл успішно завантажено' }),
    ApiResponse({ status: 400, description: 'Невірний формат файлу або розмір' }),
    ApiResponse({ status: 401, description: 'Не автентифікований користувач' }),
  );
}
