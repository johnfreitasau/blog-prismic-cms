import { GetStaticPaths, GetStaticProps } from 'next';

import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import Header from '../../components/Header';
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

export default function Post({ post }: PostProps) {
  // TODO
  console.log('POST CLIENT:', post);

  return (
    <>
      <Header />
      <div>
        <img src={post.data.banner.url} alt="banner" />
      </div>
      <main>
        <article>
          <div className={styles.info}>
            <h1>TITLE</h1>
            <time>15 march 2021</time>
            <span>John Freitas</span>
            <span>4 mins</span>
          </div>
          <p>
            <p>{post.data.content.heading}</p>
            {/* <div
              dangerouslySetInnerHTML={{ __html: post.data.content.heading }}
              className={styles.postContent}
            /> */}
          </p>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const posts = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      fetch: ['post.uid'],
      pageSize: 100,
    }
  );

  console.log('POSTS:', posts);

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  console.log('PAThs:', paths);

  return {
    paths,
    fallback: true,
  };
};
// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();

  const { slug } = params;

  const post = await prismic.getByUID('posts', String(slug), {});

  return {
    props: {
      post,
    },
  };
};

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
