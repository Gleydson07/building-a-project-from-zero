import { GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser } from "react-icons/fi"

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}


export default function Home() {
  return (
    <>
      <Head>
        <title>Space traveling</title>
      </Head>
      <main className={styles.homeContainer}>
        <section className={styles.homeContent}>
          <a href="/post/1">Como utilizar Hooks</a >
          <p>Pensando em sincronização em vez de ciclo de vida</p>
          <div className={styles.info}>
            <div>
              <FiCalendar />
              <time>15/03/2021</time>
            </div>
            <div>
              <FiUser/>
              <p>Joseph Oliveira</p>
            </div>
          </div>
        </section>
        <section className={styles.homeContent}>
          <a href="">Como utilizar Hooks</a >
          <p>Pensando em sincronização em vez de ciclo de vida</p>
          <div className={styles.info}>
            <div>
              <FiCalendar />
              <time>15/03/2021</time>
            </div>
            <div>
              <FiUser/>
              <p>Joseph Oliveira</p>
            </div>
          </div>
        </section>
        <section className={styles.homeContent}>
          <a href="">Como utilizar Hooks</a>
          <p>Pensando em sincronização em vez de ciclo de vida</p>
          <div className={styles.info}>
            <div>
              <FiCalendar />
              <time>15/03/2021</time>
            </div>
            <div>
              <FiUser/>
              <p>Joseph Oliveira</p>
            </div>
          </div>
        </section>

        <button type="button">
          Carregar mais posts
        </button>
      </main>
    </>
  )
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
