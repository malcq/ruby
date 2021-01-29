import React from 'react';
import styled from 'styled-components';

import { IMessage } from '../../../../models/chat';

import { getFancyUrl } from '../../../../utils';

type Props = {
  message: IMessage,
};
const LinkMessage: React.FC<Props> = (props) => {
  const {
    url,
    title,
    image,
  } = props.message.options;

  const fancyUrl = React.useMemo(() => {
    return getFancyUrl(url);
  }, [url])

  return (
    <StyledContainer>
      <LinkMessageContainer
        href={url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <LinkImage
          src={image}
        />
      <LinkTitle>
        {title}
      </LinkTitle>
      <LinkUrl>
        {fancyUrl}
      </LinkUrl>
      </LinkMessageContainer>
    </StyledContainer>
  )
};

const StyledContainer = styled.div`
  padding: 0 32px;
`;

const LinkMessageContainer = styled.a`
  display: block;
  text-decoration: none;
  width: 265px;
  border-radius: 12px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
`

const LinkImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  margin-bottom: 9px;
`;

const LinkTitle = styled.h2`
  padding: 0;
  margin: 0;
  ${props => props.theme.typography.fnCaption};
  ${props => props.theme.typography.fnMedium};
  color: ${props => props.theme.colorValues.black};
  padding: 0 15px;
  margin-bottom: 5px;
`;

const LinkUrl = styled.div`
  font-size: 13px;
  line-height: 17px;
  ${props => props.theme.typography.fnRegular};
  color: ${props => props.theme.colorValues.grey};
  padding: 0 15px;
  padding-bottom: 19px;
  text-overflow: ellipsis;
  overflow-x: hidden;
`;

export default LinkMessage;
