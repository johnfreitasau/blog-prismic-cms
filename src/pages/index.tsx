import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { FiUser, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
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

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<PostPagination>(postsPagination);

  // console.log('POSTS_PAGINATION:', postsPagination);
  // console.log('NEXT_PAGE:', postsPagination.next_page);

  const handleLoadMorePosts = useCallback(async () => {
    const data = await fetch(posts.next_page).then(response => response.json());

    const results = data.results.map(post => ({
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy'
      ),

      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    }));

    setPosts({
      next_page: data.next_page ?? '',
      results: [...posts.results, ...results],
    });
  }, [posts]);

  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <div className={styles.container}>
        <img src="/logo.svg" alt="logo" />
        {posts.results.map(post => (
          <Link href={`/post/${post.uid}`} key={post.uid}>
            <a className={styles.post}>
              <strong>{post.data?.title}</strong>
              <p>{post.data?.subtitle}</p>
              <div>
                <FiCalendar size={20} />
                <time>
                  {format(new Date(post.first_publication_date), 'dd MMM yyyy')}
                </time>
                <FiUser size={20} />
                <p>{post.data?.author}</p>
              </div>
            </a>
          </Link>
        ))}
        {posts.next_page && (
          <button
            type="button"
            className={styles.loadMoreButton}
            onClick={handleLoadMorePosts}
          >
            Carregar mais posts
          </button>
        )}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 1,
    }
  );

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results,
      },
    },
  };
};
function useMemo(arg0: () => string, arg1: any[]) {
  throw new Error('Function not implemented.');
}
