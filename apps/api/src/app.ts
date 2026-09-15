import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import Fastify, { type FastifyError, type FastifyInstance } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import { env, isProduction } from './env';
import { articleRoutes } from './routes/articles';
import { contentRoutes } from './routes/content';
import { experimentRoutes } from './routes/experiments';
import { healthRoutes } from './routes/health';
import { i18nRoutes } from './routes/i18n';
import { leadRoutes } from './routes/leads';
import { navigationRoutes } from './routes/navigation';

/** `/name` → `name`, `/utm/source` → `utm.source` */
function toFieldPath(instancePath: string): string {
  return instancePath.replace(/^\//, '').replace(/\//g, '.');
}

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: isProduction
      ? true
      : {
          level: 'info',
          transport: {
            target: 'pino-pretty',
            options: { translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
          },
        },
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(cors, {
    origin: env.corsOrigins,
    credentials: true,
    exposedHeaders: ['Content-Language'],
  });

  await app.register(rateLimit, {
    global: false,
    max: 60,
    timeWindow: '1 minute',
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Lumen Content API',
        version: '1.0.0',
        description: [
          'Бэкенд стенда для интернал-ревью. Отдаёт контент страниц, статьи блога,',
          'навигацию, словарь интерфейса и принимает заявки из формы.',
          '',
          '**Соглашения**',
          '- поля ответов — `snake_case`, даты — строки ISO 8601 в UTC;',
          '- списки приходят конвертом `{ items, total, page, per_page }`;',
          '- локаль выбирается через `?locale=`, затем `Accept-Language`, затем дефолт `en`;',
          '- фактический язык ответа всегда указан в заголовке `Content-Language`,',
          '  ответы помечены `Vary: Accept-Language`.',
        ].join('\n'),
      },
      servers: [{ url: `http://localhost:${env.port}`, description: 'Локальная разработка' }],
      tags: [
        { name: 'content', description: 'Контент страниц и навигация' },
        { name: 'articles', description: 'Блог' },
        { name: 'i18n', description: 'Словарь интерфейса' },
        { name: 'growth', description: 'Эксперименты' },
        { name: 'leads', description: 'Форма обратной связи' },
        { name: 'system', description: 'Служебные ручки' },
      ],
    },
    transform: jsonSchemaTransform,
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'list', deepLinking: true },
  });

  app.setErrorHandler((error, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.code(422).send({
        error: 'validation_error',
        message: 'Тело запроса не прошло валидацию',
        statusCode: 422,
        errors: error.validation.map((issue) => ({
          path: toFieldPath(issue.instancePath),
          message: issue.message ?? 'validation.unknown',
        })),
      });
    }

    if (isResponseSerializationError(error)) {
      request.log.error({ issues: error.cause.issues }, 'Ответ не соответствует собственной схеме');

      return reply.code(500).send({
        error: 'response_serialization_error',
        message: 'Ответ не соответствует схеме',
        statusCode: 500,
      });
    }

    const fastifyError = error as FastifyError;
    const statusCode = fastifyError.statusCode ?? 500;

    if (statusCode >= 500) {
      request.log.error({ err: fastifyError }, 'Необработанная ошибка');
    }

    return reply.code(statusCode).send({
      error: fastifyError.code ?? 'internal_error',
      message: statusCode >= 500 ? 'Внутренняя ошибка сервиса' : fastifyError.message,
      statusCode,
    });
  });

  app.setNotFoundHandler((request, reply) =>
    reply.code(404).send({
      error: 'not_found',
      message: `Маршрут ${request.method} ${request.url} не существует`,
      statusCode: 404,
    }),
  );

  await app.register(healthRoutes);
  await app.register(contentRoutes);
  await app.register(navigationRoutes);
  await app.register(articleRoutes);
  await app.register(i18nRoutes);
  await app.register(experimentRoutes);
  await app.register(leadRoutes);

  return app;
}
