import styled from 'styled-components';
import avatarImg from '../../assets/avatar.png';

export const Avatar = styled.div`
  border-radius: 50%;
  /* border: 2px solid gray; */
  background-color: lightgray;
  z-index: 100;
  background-image: url(${avatarImg});
  background-size: cover;
`;

