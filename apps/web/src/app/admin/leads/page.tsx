import { Container, Text } from '@repo/ui';
import type { Metadata } from 'next';

import { getLeads } from '@/lib/api/leads';
import { API_PUBLIC_URL } from '@/lib/env';
import { formatDateTime } from '@/lib/format';
import styles from './leads.module.css';

export const metadata: Metadata = {
  title: 'Submitted requests',
  robots: { index: false, follow: false },
};

/**
 * Служебная страница стенда: что реально сохранила форма обратной связи.
 *
 * Данные берутся из `GET /api/leads` и кэшируются на 60 секунд с тегом `leads`
 * (см. `lib/api/leads.ts`). Если после отправки формы новая заявка здесь
 * не появилась — либо она не сохранилась, либо кэш никто не сбросил.
 * Сырые данные без кэша всегда доступны в Swagger.
 */
export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <Container>
      <div className="pageHeader">
        <h1 className="pageTitle">Submitted requests</h1>
        <p className="pageSubtitle">Everything the contact form has saved, newest first.</p>
        <Text tone="muted">
          This list is cached for 60 seconds under the tag “leads”.{' '}
          <a href={`${API_PUBLIC_URL}/api/leads`} target="_blank" rel="noreferrer">
            Raw data from the API →
          </a>
        </Text>
      </div>

      {leads === null || leads.items.length === 0 ? (
        <p className={styles.empty}>No requests yet. Submit the contact form and come back.</p>
      ) : (
        <>
          <p className={styles.total}>{leads.total} requests in total</p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Received</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Company</th>
                  <th scope="col">Budget</th>
                  <th scope="col">Message</th>
                </tr>
              </thead>
              <tbody>
                {leads.items.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.id}</td>
                    <td>
                      <time dateTime={lead.createdAt.toISOString()}>{formatDateTime(lead.createdAt)}</time>
                    </td>
                    <td>{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>{lead.company ?? '—'}</td>
                    <td>
                      <code>{lead.budget}</code>
                    </td>
                    <td className={styles.message}>{lead.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Container>
  );
}
