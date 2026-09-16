'use client';

import { throttle } from '@repo/core';
import { useEffect, useState } from 'react';

import styles from './reading-progress.module.css';

/**
 * Полоска прогресса чтения под шапкой. Обработчик `scroll` пропущен через
 * `throttle` из `@repo/core` — пока это заглушка (задание T-07): откройте консоль
 * и полистайте статью.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = throttle(() => {
      const root = document.documentElement;
      const scrollable = root.scrollHeight - window.innerHeight;
      const value = scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 100;

      if (process.env.NODE_ENV === 'development') {
        console.debug('[reading-progress] обработчик scroll →', value);
      }

      setProgress(value);
    }, 100);

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      update.cancel();
    };
  }, []);

  return <progress className={styles.bar} value={progress} max={100} aria-label="Reading progress" />;
}
