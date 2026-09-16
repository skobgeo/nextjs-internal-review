'use client';

import { Button, Container } from '@repo/ui';
import { useEffect } from 'react';

/** Граница ошибок приложения. Рендерится на клиенте. */
export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container>
      <div className="centered">
        <h1 className="pageTitle">Something went wrong</h1>
        <p className="pageSubtitle">{error.digest ? `Digest: ${error.digest}` : error.message}</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </Container>
  );
}
