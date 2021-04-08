import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { GetStaticProps } from 'next';
import Head from 'next/head';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { FiCalendar, FiUser } from "react-icons/fi"



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


export default function Home(props:HomeProps) {
  return (
    <>
      <Head>
        <title>Posts | Space traveling</title>
      </Head>
      <main className={styles.homeContainer}>
        {props.postsPagination.results.map(post => {
          return (
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
          )
        })}

        <button type="button">
          Carregar mais posts
        </button>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ],{
    fetch: ['posts.title', 'posts.subtitle', 'posts.first_publication_date', 'posts.author'],
        pageSize: 2,
  });

  const posts = postsResponse.results.map(post => {
    return {
      slug: post.uid,
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
      updateAt: new Date(post.first_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })
  console.log(posts)
  return {
    props: {
      posts
    }
  }
};
