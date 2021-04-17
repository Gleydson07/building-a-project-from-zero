import { GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import styles from './post.module.scss';

import commonStyles from '../../styles/common.module.scss'
import { useMemo } from 'react';
import { Header } from '../../components/Header';
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({post}: PostProps): JSX.Element {
  const router = useRouter();

  const timeOfRead = useMemo(() => {
    const WORDS_READING_FOR_MINUTE = 200;
    const words = post.data.content.reduce((contentWords, content) => {
      contentWords.push(...content.heading.split(' '));

      const cleanWords = RichText.asText(content.body).split(' ');

      contentWords.push(...cleanWords);

      return contentWords;
    }, []);

    return Math.ceil(words.length / WORDS_READING_FOR_MINUTE);
  }, [post])

  return (
    <>
      <Head>
        <title>Post | SpaceTraveling</title>
      </Head>
      <Header />

      <main className={commonStyles.postContainer}>
        <img className={styles.banner} src={post.data.banner.url} alt="banner"/>
        <article className={styles.article}>
          <h1>
            {router.isFallback
              ? 'Carregando...'
              : post.data.title
            }
          </h1>
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
            <FiClock/>
            <span>{`${timeOfRead} min`}</span>
          </div>
          <section>
            {post.data.content.map((cont, key) => {
              return(
                <div key={key}>
                  <h2>{cont.heading} </h2>
                  {cont.body.map((bd, keytwo) => {
                    return (
                      <p key={keytwo}>{bd.text}</p>
                    )
                  })}
                </div>
              )
            })}
          </section>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
      Prismic.predicates.at('document.type', 'posts')
  ], {
      pageSize: 2,
  });

  const postPaths = posts.results.map(post => ({
    params: {
      slug: post.uid
    }
  }))

  return {
    paths: postPaths,
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const {slug} = params;
  const prismic = getPrismicClient();
  const postResponse = await prismic.getByUID('posts', String(slug), {});

  const post = {
    first_publication_date: postResponse.first_publication_date,
    data: {
      title: postResponse.data.title,
      author: postResponse.data.author,
      banner: {
        url: postResponse.data.banner.url
      },
      content: postResponse.data.content.map(content => {
        return {
          heading: RichText.asText(content.heading),
          body: [{
            text: RichText.asText(content.body)
          }]
        }
      })
    }
  }

  return {
    props: {
      post
    }
  }
};
