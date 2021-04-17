import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser } from "react-icons/fi"
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
  content: {
    heading: string;
    body: {
      text: string;
    }
  }
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}


export default function Home({postsPagination}: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  useEffect(() => {
    postsPagination.next_page = nextPage;
  }, [posts])

  async function handleLoadPosts(): Promise<void>{
    const response = await fetch(postsPagination.next_page).then(response => 
      response.json())

    const loadedPosts = response.results.map((post:Post) => ({
      uid:post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      }
    }))
    setPosts([...posts, ...loadedPosts]);
    setNextPage(response.next_page);
  }

  return (
    <>
      <Head>
        <title>Posts | Space traveling</title>
      </Head>
      <main className={styles.homeContainer}>
        <Header />
        {posts.map(post => {
          return (
            <section key={post.uid} className={styles.homeContent}>
              <Link href={`/post/${post.uid}`}>
                <a>
                  <h3 > { post.data.title } </h3 >
                  <p>{post.data.subtitle}</p>
                  <div className={commonStyles.info}>
                    <FiCalendar />
                    <time>
                      {format(
                        new Date(post.first_publication_date),
                        'dd MMM yyyy',
                        { locale: ptBR }
                      )}
                    </time>
                    <FiUser/>
                    <span>{post.data.author}</span>
                  </div>
                </a>
              </Link>
            </section>            
          )
        })}

        {nextPage && 
          <button 
            type="button"
            onClick={ handleLoadPosts}
          >
            Carregar mais posts
          </button>
        }
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ],{
    fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
    orderings: '[document.first_publication_date desc]',
    pageSize: 2,
  });
  
  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author
        }
      }
    })
  }

  return {
    props: {
      postsPagination
    },
    revalidate: 60 * 30, // 30min
  }
};
