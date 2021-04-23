import { useRouter } from 'next/router';
import { useCallback } from 'react';
import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  // TODO

  const router = useRouter();

  const handleLogoClick = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <div className={styles.container}>
      <Link href="/">
        <a>
          <img src="/logo.svg" alt="logo" />
        </a>
      </Link>
    </div>
  );
}
