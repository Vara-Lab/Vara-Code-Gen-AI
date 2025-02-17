import { Logo } from './logo';
import { Option } from './Option';
import { Button } from '@gear-js/vara-ui';
import styles from './header.module.scss';

interface Props {
};

export function Header({ }: Props) {
  return (
    <header className={styles.header}>
      <Logo />
      <div className={styles.list}>
        <Option label='Discover' />
        <Option label='Build' />
        <Option label='Join' />
        <Option label='Contact us' />
      </div>
      <Button color='contrast'>
        hola
      </Button>
    </header>
  );

  
}
