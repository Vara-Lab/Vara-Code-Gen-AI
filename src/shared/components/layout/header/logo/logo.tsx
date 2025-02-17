import { Link } from 'react-router-dom';
import { VaraLogoIcon } from '@/shared/assets/images';
import './logo.module.scss';

function Logo() {
  return (
    <Link to="/">
      <VaraLogoIcon style={{ color: "gray" }}/>
    </Link>
  );
}

export { Logo };
