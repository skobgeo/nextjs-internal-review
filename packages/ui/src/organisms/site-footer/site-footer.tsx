import { Container } from '../../atoms/layout/layout';
import { Icon } from '../../atoms/icon/icon';
import { DEFAULT_LINK, type LinkComponent } from '../../lib/link';
import styles from './site-footer.module.css';

export interface FooterColumn {
  readonly id: string;
  readonly title: string;
  readonly links: readonly { readonly id: string; readonly title: string; readonly href: string }[];
}

export interface SiteFooterProps {
  readonly columns: readonly FooterColumn[];
  readonly copyright: string;
  readonly note?: string;
  readonly linkComponent?: LinkComponent;
}

/**
 * [S2-04] Подвал сайта.
 *
 * Иконочные ссылки внизу прекрасно видны глазами и совершенно непонятны всем
 * остальным способам чтения страницы.
 */
export function SiteFooter({ columns, copyright, note, linkComponent }: SiteFooterProps) {
  const Link = linkComponent ?? DEFAULT_LINK;

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.inner}>
          {columns.map((column) => (
            <div key={column.id} className={styles.column}>
              <h2 className={styles.columnTitle}>{column.title}</h2>
              {column.links.map((link) => (
                <Link key={link.id} href={link.href} className={styles.link}>
                  {link.title}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <span>{copyright}</span>
          {note ? <span>{note}</span> : null}

          <div className={styles.social}>
            <a className={styles.socialLink} href="https://example.com/lumen">
              <Icon name="globe" size={18} />
            </a>
            <a className={styles.socialLink} href="https://example.com/lumen/blog">
              <Icon name="growth" size={18} />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
