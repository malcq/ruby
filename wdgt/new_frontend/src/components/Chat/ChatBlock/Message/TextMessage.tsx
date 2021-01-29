import React from 'react';
import styled from 'styled-components';

import { IMessage } from '../../../../models/chat';

import { MessageTitle } from '../../Common';

import { LINE_HEIGHTS_BY_SIZE } from '../../../../utils/constants';

type Props = {
  message: IMessage,
};

const TextMessage: React.FC<Props> = (props) => {
  const { options } = props.message;
  const {
    text,
    color,
    font_size,
  } = options;

  const fontColorStyles = React.useMemo(() => {
    if (color) {
      return `color: ${color};`;
    }
    return null;
  }, [color]);

  const fontSizeStyles = React.useMemo(() => {
    const fontSize = parseInt(font_size) || null;

    if (font_size && fontSize) {
      const lineHeight = LINE_HEIGHTS_BY_SIZE[`${fontSize}`] || `${fontSize * 1.25}px`;

      return `
        font-size: ${fontSize}px;
        line-height: ${lineHeight};
      `;
    }
    return null;
  }, [font_size]);

  return (
    <StyledContainer>
      <StyledMessageTitle
        fontColorStyles={fontColorStyles}
        fontSizeStyles={fontSizeStyles}
      >
        {text}
      </StyledMessageTitle>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`

`;

type StyledMessageTitleProps = {
  fontColorStyles?: string | null;
  fontSizeStyles?: string | null;
};
const StyledMessageTitle = styled(MessageTitle)<StyledMessageTitleProps>`
  padding: 0 32px;
  ${props => props.fontColorStyles};
  ${props => props.fontSizeStyles};
  white-space: pre-wrap;
`;

export default TextMessage;