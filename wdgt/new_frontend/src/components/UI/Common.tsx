import styled from 'styled-components';

type ErrorMessageContainer = {
  visible?: boolean;
}
export const ErrorMessageContainer = styled.div<ErrorMessageContainer>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 24px;
  margin-bottom: -17px;
  visibility: ${props => props.visible ? null : 'hidden' };
`;

export const ErrorMessage = styled.div`
  ${props => props.theme.typography.fnRegular};
  ${props => props.theme.typography.fnInputError};
  color: ${props => props.theme.colorValues.error};
  margin: 0 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;