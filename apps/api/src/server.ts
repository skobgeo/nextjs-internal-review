import { buildApp } from './app';
import { seed } from './db/seed';
import { env } from './env';

async function main(): Promise<void> {
  // Схема и демо-контент создаются при первом запуске — отдельная команда не нужна.
  const { seeded } = seed();

  const app = await buildApp();

  if (seeded) {
    app.log.info('База создана и засеяна демо-контентом');
  }

  await app.listen({ port: env.port, host: env.host });

  app.log.info(`Swagger UI: http://localhost:${env.port}/docs`);
}

main().catch((error: unknown) => {
  console.error('Не удалось запустить API:', error);
  process.exit(1);
});
