import style from './header.module.scss'

export function Header() {
  return(
    <header className={style.headerContainer}>
      <nav className={style.headerContent}>
        <a href="/">
          <img src="/images/logo.svg" alt="logo"/>
        </a>
      </nav>
    </header>
  )
}
