import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { GetStaticProps } from 'next';
import Head from 'next/head';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser } from "react-icons/fi"
import { useEffect, useState } from 'react';

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


export default function Home({postsPagination}: HomeProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  useEffect(() => {
    // console.log(nextPage)
  }, [posts])

  async function handleLoadPosts(){
    const response = await fetch(postsPagination.next_page).then(response => 
      response.json())

    const loadedPosts = response.results.map((post:Post) => ({
      uid:post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {locale: ptBR}),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      }
    }))
    setPosts([...posts, loadedPosts]);
    setNextPage(response.next_page);
  }

  return (
    <>
      <Head>
        <title>Posts | Space traveling</title>
      </Head>
      <main className={styles.homeContainer}>
        {postsPagination.results.map(post => {
          return (
            <section key={post.uid} className={styles.homeContent}>
              <a href={`/post/${post.uid}`}>{post.data.title}</a >
              <p>{post.data.subtitle}</p>
              <div className={styles.info}>
                <div>
                  <FiCalendar />
                  <time>{post.first_publication_date}</time>
                </div>
                <div>
                  <FiUser/>
                  <p>{post.data.author}</p>
                </div>
              </div>
            </section>            
          )
        })}

        {postsPagination.next_page && 
          <button 
            type="button"
            onClick={handleLoadPosts}
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
    fetch: ['posts.title', 'posts.subtitle', 'posts.first_publication_date', 'posts.author'],
    pageSize: 1,
    page: 1
  });

  
  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.first_publication_date),
          'dd MMM yyyy',
          { locale: ptBR }
        ),
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
