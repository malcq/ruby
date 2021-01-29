import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

const GlobalStyle = createGlobalStyle`
  ${normalize};
  html,
  body,
  body > #root {
    height: 100%;
    width: 100%;
  }
  body {
    background-color: ${props => props.theme.bgColor};
    ${props => props.theme.typography.fnRegular};
    ${props => props.theme.typography.fnBody};
    color: ${props => props.theme.fontColor};
  }
  html {
    box-sizing: border-box;
  }
  
  *, *:before, *:after {
    box-sizing: inherit;
  }

  textarea,
  textarea:disabled {
    background-color: transparent;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
  }
`;

export default GlobalStyle;
