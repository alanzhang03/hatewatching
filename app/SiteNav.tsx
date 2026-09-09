'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import styles from './page.module.css';

const LINKS = [
  { href: '/', label: 'Accounts', match: (path: string) => path === '/' || !path.startsWith('/soloq-bet') },
  {
    href: '/soloq-bet',
    label: 'Soloq bet',
    match: (path: string) => path === '/soloq-bet' || path.startsWith('/soloq-bet/'),
  },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.siteNav} aria-label='Primary'>
      <Link href='/' className={styles.siteNavBrand}>
        chogwarts
      </Link>
      <div className={styles.siteNavLinks}>
        {LINKS.map((link) => {
          const active = link.match(pathname);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.siteNavLink} ${
                active ? styles.siteNavLinkActive : ''
              }`}
              aria-current={active ? 'page' : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <ThemeToggle />
    </nav>
  );
}
