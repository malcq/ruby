import React, { Component } from 'react';

import './styles.scss';


class Footer extends Component {
  public render() {
    return (
      <footer className="footer">
        <p className="footer__text">
          <span>
            Copyright Shypple B.V. 2018. All rights reserved.
          </span>
          <a target="_blank" rel="noopener" href="https://app.shypple.com/generaltermsandconditions-english.pdf">
            General Conditions
          </a>
          <span> - </span>
          <a target="_blank" rel="noopener" href="https://app.shypple.com/fenexconditions-english.pdf">
            Fenex Conditions(EN)
          </a>
          <span> - </span>
          <a target="_blank" rel="noopener" href="https://app.shypple.com/fenexvoorwaarden-nederlands.pdf">
            Fenex Conditions(NL)
          </a>
        </p>
        <p className="footer__text">
          <a className="footer__link" href="tel:+31850660000">+31 85 066 0000</a>
          <span>&nbsp;•&nbsp;</span>
          <a className="footer__link" href="mailto:info@shypple.com">info@shypple.com</a>
          <span className="d-sm-hidden">&nbsp;•&nbsp;</span>
          <span className="d-sm-hidden">
            Schiedamse Vest 154, 3011 BH, Rotterdam
          </span>
        </p>
      </footer>
    );
  }
}

export default Footer