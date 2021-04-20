import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { GetStaticProps } from 'next';
import Link from 'next/link';
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

export default function Home({ posts }): JSX.Element {
  return (
    <>
      <div>
        {posts.map(post => (
          <a>
            <strong>{post.title}</strong>
            <p>{post.subtitle}</p>
            <time>{post.updatedDate}</time>
            <p>{post.author}</p>
          </a>
        ))}
      </div>
    </>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['post.title', 'post.content'],
      pageSize: 100,
    }
  );

  console.log('postsResponse:', postsResponse);
  console.log('postsResponse:', JSON.stringify(postsResponse, null, 2));

  const posts = postsResponse.results.map(post => {
    return {
      slug: post.uid,
      // slug: 'slug',
      // author: 'author',
      author: post.data.author,
      // author: RichText.asText(post.data.author),
      title: RichText.asText(post.data.title),
      // title: RichText.asText(post.data.title),
      summary:
        post.data?.content?.find(content => content.type === 'paragraph')
          ?.text ?? '',
      updatedDate: new Date(post.last_publication_date).toLocaleDateString(
        'en-AU',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }
      ),
    };
  });

  console.log('posts:', posts);

  return {
    props: {
      posts,
    },
  };
};
