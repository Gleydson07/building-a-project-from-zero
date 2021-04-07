import styles from './header.module.scss'

export function Header() {
  return(
    <header className={styles.headerContainer}>
      <nav className={styles.headerContent}>
        <a href="/">
          <img src="/images/logo.svg" alt="logo"/>
        </a>
      </nav>
    </header>
  )
}
