import styles from './header.module.scss'
import Link, { LinkProps } from 'next/link';

export function Header() {
  return(
    <header className={styles.headerContainer}>
      <nav className={styles.headerContent}>
        <Link href="/">
          <a >
            <img src='/spacetraveling.svg' alt='logo'/>
          </a>
        </Link>
      </nav>
    </header>
  )
}
