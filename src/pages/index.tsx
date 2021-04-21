import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { POINT_CONVERSION_HYBRID } from 'node:constants';
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

  console.log('POSTS_PAGINATION:', postsPagination);
  console.log('NEXT_PAGE:', postsPagination.next_page);

  const handleLoadMorePosts = useCallback(async () => {
    const data = await fetch(posts.next_page).then(response => response.json());

    const results = data.results.map(post => ({
      uid: post.uid,
      first_publication_date: new Date(
        post.first_publication_date
      ).toLocaleDateString('en-AU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
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
      {posts.results.map(post => (
        <Link href={`/posts/${post.uid}`} key={post.uid}>
          <div>
            <a>
              <strong>{post.data?.title}</strong>
              <p>{post.data?.subtitle}</p>
              <time>{post.first_publication_date}</time>
              <p>{post.data?.author}</p>
            </a>
          </div>
        </Link>
      ))}
      {posts.next_page && (
        <button type="button" onClick={handleLoadMorePosts}>
          Carregar mais
        </button>
      )}
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
      first_publication_date: new Date(
        post.first_publication_date
      ).toLocaleDateString('en-AU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
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
