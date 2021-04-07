import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss'
import styles from './post.module.scss';

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

export default function Post() {
  return (
    <>
      <Head>
        <title>Post | SpaceTraveling</title>
      </Head>
      <main className={commonStyles.postContainer}>
        <img src="/images/banner.png" alt=""/>
        <section>
            <h1>Como utilizar Hooks</h1>
            <div className={commonStyles.info}>
              <FiCalendar />
              <time>15/03/2021</time>
              <FiUser/>
              <span>Joseph Oliveira</span>
              <FiClock/>
              <span>5 min</span>
            </div>
          <article className={commonStyles.postContent}>
            <h2>Lorem ipsum dolor sit </h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, saepe? Libero deleniti sapiente eveniet qui asperiores ea eum quisquam? Laborum rem rerum incidunt eligendi esse quos. Veniam ad obcaecati unde!lor
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat laudantium beatae assumenda sit similique veritatis praesentium, ea repudiandae, laborum placeat corrupti ipsa earum. Officiis molestiae ipsa debitis beatae corrupti. Ducimus.
            </p>

            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat eos ducimus incidunt consequatur beatae, vero aut voluptas, accusantium cupiditate iure odio veniam quae qui explicabo! Omnis autem amet rerum hic? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequuntur accusantium obcaecati, enim sunt ullam, iure repellat perferendis voluptate commodi amet laudantium distinctio nostrum cumque excepturi sed alias omnis corrupti delectus.</p>

          </article>
        </section>
      </main>
    </>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
