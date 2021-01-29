import React from 'react';
import styled from 'styled-components';

import TravoltaGif from 'ui/images/travolta_2.gif';

import { Link } from 'react-router-dom';

const Travolta = () => (
  <StyledContainer>
    <div className="travolta">
      <div className="text">
        <h1>404</h1>
        <p>Похоже ты потерялся...</p>
        <Link to="/">На главную</Link>
      </div>
    </div>
  </StyledContainer>
);

const StyledContainer = styled.div`
  background: url(${TravoltaGif});
  background-repeat: no-repeat;
  background-position: bottom center;
  background-size: cover;
  width: 100%;
  height: calc(100vh - 58px);
  margin-bottom: -50px;

  & .travolta {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.65);
    min-height: calc(100vh - 58px);
    text-align: center;
    & .text {
      color: #fff;
      margin-bottom: 30px;

      a {
        color: #fff;
        border: 1px solid #fff;
        border-radius: 5px;
        padding: 8px;
        transition: 0.35s;

        :hover {
          filter: brightness(0.5);
        }
      }
    }
  }
`;

export default Travolta;
