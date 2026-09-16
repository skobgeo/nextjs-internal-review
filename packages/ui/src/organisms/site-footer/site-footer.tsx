import { Container } from '../../atoms/layout/layout';
import { DEFAULT_LINK, type LinkComponent } from '../../lib/link';
import styles from './site-footer.module.css';

export interface FooterLink {
  readonly id: string;
  readonly title: string;
  readonly href: string;
  /** Внешняя ссылка (например, Swagger) — открывается обычным `<a>`. */
  readonly external?: boolean;
}

export interface FooterColumn {
  readonly id: string;
  readonly title: string;
  readonly links: readonly FooterLink[];
}

export interface SiteFooterProps {
  readonly columns: readonly FooterColumn[];
  readonly copyright: string;
  readonly note?: string;
  readonly linkComponent?: LinkComponent;
}

export function SiteFooter({ columns, copyright, note, linkComponent }: SiteFooterProps) {
  const Link = linkComponent ?? DEFAULT_LINK;

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.inner}>
          {columns.map((column) => (
            <nav key={column.id} className={styles.column} aria-labelledby={`footer-${column.id}`}>
              <h2 id={`footer-${column.id}`} className={styles.columnTitle}>
                {column.title}
              </h2>
              <ul className={styles.list}>
                {column.links.map((link) =>
                  link.external ? (
                    <li key={link.id}>
                      <a href={link.href} className={styles.link} target="_blank" rel="noreferrer">
                        {link.title}
                      </a>
                    </li>
                  ) : (
                    <li key={link.id}>
                      <Link href={link.href} className={styles.link}>
                        {link.title}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>
          ))}
        </div>

        <div className={styles.bottom}>
          <span>{copyright}</span>
          {note ? <span>{note}</span> : null}
        </div>
      </Container>
    </footer>
  );
}
