'use client';

import { debounce } from '@repo/core';
import { Input } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import styles from './search-box.module.css';

export interface SearchBoxProps {
  readonly initialQuery: string;
}

/**
 * [T-02] Поиск по заголовкам.
 *
 * Идея простая: пока человек печатает, мы с задержкой переписываем `?q=`
 * в адресе, а серверный компонент списка перерисовывается с новыми данными.
 *
 * Работает, но откройте вкладку Network (или логи `pnpm dev`) и наберите
 * слово из шести букв. Потом наберите что-нибудь и сразу кликните по статье.
 * Оба симптома — про то, как живут таймеры внутри React-компонента.
 *
 * [T-08] Заодно: чем этот блок является для скринридера и что произойдёт
 * с поиском при выключенном JavaScript?
 */
export function SearchBox({ initialQuery }: SearchBoxProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  const navigate = debounce((query: string) => {
    const search = new URLSearchParams();
    if (query.trim()) search.set('q', query.trim());
    const suffix = search.toString();

    router.replace(`/blog${suffix ? `?${suffix}` : ''}`, { scroll: false });
  }, 300);

  return (
    <div className={styles.search}>
      <Input
        type="search"
        value={value}
        placeholder="Search by title…"
        autoComplete="off"
        onChange={(event) => {
          setValue(event.target.value);
          navigate(event.target.value);
        }}
      />
    </div>
  );
}
