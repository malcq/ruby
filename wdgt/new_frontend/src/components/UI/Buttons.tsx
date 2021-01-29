import styled, { css } from 'styled-components';

import sendIcon from '../../assets/icons/send.svg';

type ButtonProps = {
  outlined?: boolean;
  disabled?: boolean;
  color?: 'primary' | 'selected';
};
export const Button = styled.button<ButtonProps>`
  color: ${props => props.theme.colorValues.white};
  border-color: ${props => props.theme.colorValues.primary};
  background-color: ${props => props.theme.colorValues.primary};
  border-radius: 26px;
  border-width: 1px;
  ${props => props.theme.typography.fnMedium};
  ${props => props.theme.typography.fnCaption};
  padding: 13px 15px;
  transition: 0.2s;
  word-wrap: break-word;
  -webkit-tap-highlight-color: rgba(0,0,0,0);

  &:hover {
    cursor: pointer;
  }
  
  &,
  &:hover,
  &:active,
  &:focus {
    border-style: solid;
    outline: none;
  }

  ${props => props.outlined
    ? css`
      color: ${props => props.theme.colorValues.primary};
      background-color: ${props => props.theme.colorValues.white};
      border-color: ${props => props.theme.colorValues.primary};
    `
    : css`
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
    `
  };

  ${props => props.disabled
    ? css`
      color: ${props => props.theme.colorValues.grey};
      border-color: ${props => props.theme.colorValues.lightgrey};

      &:hover {
        cursor: not-allowed;
      }
    `
    : null
  }

  ${props => {
    switch (props.color) {
      case 'selected':
        return css`
          color: ${props => props.theme.colorValues.grey};
          border-color: ${props => props.theme.colorValues.lightgrey};
          opacity: 0.5;
        `;
      case 'primary':
        return css`
          &:hover {
            border-color: ${props => props.theme.colorValues.primary};
            background-color: ${props => props.theme.colorValues.primary};
            color: ${props => props.theme.colorValues.white};
          }
        `;
      default:
        return null;
    }
  }};
`;

Button.defaultProps = {
  color: 'primary',
};

export const SendButton = styled.div`
  background-image: url(${sendIcon});
  background-repeat: no-repeat;
  background-size: contain;
  background-color: transparent;
  border: none;
  background-position: center;
  width: 24px;
  height: 24px;
  display: inline-block;

  &:hover {
    cursor: pointer;
  }
`;

export const ContinueButton = styled(Button)`
  position: absolute;
  z-index: 100;
  bottom: 40px;
  right: 24px;
  width: 180px;

  &.continue-button-enter {
    opacity: 0;
    transform: scale(0.9);
  }
  &.continue-button-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 200ms, transform 200ms;
  }
  &.continue-button-exit {
    opacity: 1;
  }
  &.continue-button-exit-active {
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 200ms, transform 200ms;
  }
`;
