import styles from './header.module.scss'
import Link from 'next/link';

export function Header() {
  return(
    <header className={styles.headerContainer}>
        <Link href="/">
          <a >
            <img src='/logo.svg' alt='logo'/>
          </a>
        </Link>
    </header>
  )
}
