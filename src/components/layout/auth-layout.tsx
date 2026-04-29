import { JSX } from 'react';
import styles from './auth-layout.module.scss';

type Props = {
  noLogo?: any;
  background?: any;
  children: JSX.Element | string;
};

export default function AuthLayout({ noLogo, ...props }: Props) {
  return (
    <div
      className={styles.container + ' scroll '}
      style={{ background: props.background }}
    >
      {props.children}
    </div>
  );
}
