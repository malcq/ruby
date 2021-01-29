import React, { StatelessComponent, ReactElement } from 'react';
import { Link } from 'react-router-dom'
import './styles.scss';

import logo from '../../assets/images/logo.svg';

const LoginHeader: StatelessComponent<any> = (props:any): ReactElement<any> =>  (
  <header className="header login--header">
    <div className="header__block">
      <Link to='/dashboard' className="header__logo">
        <img src={logo} className="header__logo-image" alt="logo" />
      </Link>
    </div>
    <div className="header__phone-number">
      <span className="phone-number__text">
        Need help? Call us at
      </span>
      <a className="phone-number__link" href="tel: +31-85-066-0000">
        +31 85 066 0000
      </a>
    </div>
  </header>
);

export default LoginHeader;
