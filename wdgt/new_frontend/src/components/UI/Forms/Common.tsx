import styled from 'styled-components';

export const ErrorMessage = styled.p`
  margin: 0;
  padding: 0;
  display: block;
  color: ${props => props.theme.colorValues.error};
  ${props => props.theme.typography.fnRegular};
  ${props => props.theme.typography.fnInputError};
`;

export const FieldContainer = styled.div`
  & > p {
    margin-top: 3px;
    padding: 0 20px;
  }
`;
