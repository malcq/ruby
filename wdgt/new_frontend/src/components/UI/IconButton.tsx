import React from 'react';
import styled from 'styled-components';

type FileButtonProps = {
  title?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};
export const FileButton: React.FC<FileButtonProps> = (props) => {
  const {
    title,
    children,
  } = props;

  return (
    <StyledContainer onClick={props.onClick}>
      {title && (
        <Title>{title}</Title>
      )}
      <Icon>{children}</Icon>
    </StyledContainer>
  );
}

const StyledContainer = styled.button`
  display: flex;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  background-color: none;
  align-items: center;
  cursor: pointer;
  background-color: unset;
`;

const Title = styled.div`
  color: ${props => props.theme.colorValues.primary};
  margin-right: 16px;
  ${props => props.theme.typography.fnCaption};
  ${props => props.theme.typography.fnMedium};
`;

const Icon = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  align-content: center;
  justify-content: center;
  padding: 15px;
  border-radius: 1000px;
  border: 1px solid;
  border-color: ${props => props.theme.colorValues.primary};
`;

FileButton.defaultProps = {
  onClick: () => null,
}

export default FileButton;
