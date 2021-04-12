import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import styles from './post.module.scss';

import commonStyles from '../../styles/common.module.scss'

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

export default function Post({post}: PostProps) {


  return (
    <>
      <Head>
        <title>Post | SpaceTraveling</title>
      </Head>
      <main className={commonStyles.postContainer}>
        <img className={styles.banner} src={post.data.banner.url} alt="banner"/>
        <article>
            <h1>{post.data.title}</h1>
            <div className={commonStyles.info}>
              <FiCalendar />
              <time>{post.first_publication_date}</time>
              <FiUser/>
              <span>{post.data.author}</span>
              <FiClock/>
              <span>5 min</span>
            </div>
            {/* {
              post.data.content.map(paragraph => {
                console.log(paragraph)
                return (
                  <section>
                    <h3>{paragraph.heading}</h3>
                    <p>{paragraph.body}</p>

                  </section>
                )
              })
            } */}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query([
  //     Prismic.predicates.at('document.type', 'posts')
  // ], {
  //     fetch: ['posts.uid'],
  //     pageSize: 2,
  // });

  // console.log('paths')
  // console.log(posts.results)

  return {
    paths: [],
    fallback: 'blocking'
  }
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const {slug} = params;
  const prismic = getPrismicClient();
  const postResponse = await prismic.getByUID('posts', String(slug), {});

  const post = {
      first_publication_date: format(
        new Date(postResponse.first_publication_date),
        'dd MMM yyyy',
        { locale: ptBR }
      ),
      data: {
        title: postResponse.data.title,
        author: postResponse.data.author,
        banner: {
          url: postResponse.data.banner.url
        },
        // content: [{
        //   heading: postResponse.data.content?.heading,
        //   body: [postResponse.data.content.body?.text]
        // }]
      }
  }
  // [{
  //   text: RichText.asText(postResponse.data.content.body?.text),
  // }]

  return {
    props: {
      post
    }
  }
};
