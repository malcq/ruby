import React from 'react';
import styled, { keyframes } from 'styled-components';

const TypingAnimation: React.FC = () => {
  return (
    <Container>
      <span></span>
      <span></span>
      <span></span>
    </Container>
  )
}

const waveKeyframes = keyframes`
  0%, 60%, 100% {
    transform: initial;
  }

  30% {
    transform: translateY(-8px);
  }
`;

const Container = styled.div`
  & > span {
    font-size: 60px;
    width: 6px;
    height: 6px;
    margin: 0 3px;
    background-color: black;
    border-radius: 50%;
    display: inline-block;
    animation: ${waveKeyframes} 1.3s linear infinite;
  }

  & > span:nth-child(1) {
    margin-left: 0px;
  }

  & > span:nth-child(2) {
    animation-delay: -1.1s;
  }

  & > span:nth-child(3) {
    animation-delay: -0.9s;
    margin-right: 0px;
  }
`;

export default TypingAnimation;
