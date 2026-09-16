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
import { healthRoutes } from './routes/health';
import { leadRoutes } from './routes/leads';

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
          'Бэкенд стенда для интернал-ревью. Отдаёт статьи блога,',
          'принимает заявки из формы и показывает, что сохранилось.',
          '',
          '**Соглашения**',
          '- поля ответов — `snake_case`, даты — строки ISO 8601 в UTC;',
          '- списки приходят конвертом `{ items, total, page, per_page }`.',
        ].join('\n'),
      },
      servers: [{ url: `http://localhost:${env.port}`, description: 'Локальная разработка' }],
      tags: [
        { name: 'articles', description: 'Блог: список с поиском и пагинацией, статья' },
        { name: 'leads', description: 'Форма обратной связи: приём и просмотр заявок' },
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
        message: 'Request body failed validation',
        statusCode: 422,
        errors: error.validation.map((issue) => ({
          path: toFieldPath(issue.instancePath),
          message: issue.message ?? 'Something is wrong with this field.',
        })),
      });
    }

    if (isResponseSerializationError(error)) {
      request.log.error({ issues: error.cause.issues }, 'Ответ не соответствует собственной схеме');

      return reply.code(500).send({
        error: 'response_serialization_error',
        message: 'Response does not match its schema',
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
      message: statusCode >= 500 ? 'Internal server error' : fastifyError.message,
      statusCode,
    });
  });

  app.setNotFoundHandler((request, reply) =>
    reply.code(404).send({
      error: 'not_found',
      message: `Route ${request.method} ${request.url} does not exist`,
      statusCode: 404,
    }),
  );

  await app.register(healthRoutes);
  await app.register(articleRoutes);
  await app.register(leadRoutes);

  return app;
}
