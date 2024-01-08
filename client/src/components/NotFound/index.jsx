import React from 'react';
import { Link } from 'react-router-dom';

import styles from './NotFound.module.scss';

export const NotFound = () => {
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>К сожаление, произошла ошибка :(</h1>
      <p className={styles.description}>
        Попробуйте перезагрузить страницу или проверить корректность ссылки.
      </p>
      <Link to="/" className={styles.button_redirect}>
        На главную
      </Link>
    </div>
  );
};
