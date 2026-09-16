import { Container } from '@repo/ui';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container>
      <div className="centered">
        <h1 className="pageTitle">404</h1>
        <p className="pageSubtitle">The page you were looking for does not exist or has moved.</p>
        <Link href="/">← Back to the homepage</Link>
      </div>
    </Container>
  );
}
