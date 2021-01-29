import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

function Legend(props) {
  return (
    <StyledContainer>
      <StyledUl>
        {props.legend.map((el) => (
          <StyledLi key={`legendItem${el.title}`}>
            <SmallSquare border={el.border} background={el.backgroundColor} />
            <p>{el.title}</p>
          </StyledLi>
        ))}
      </StyledUl>
    </StyledContainer>
  );
}

Legend.propTypes = {
  legend: PropTypes.arrayOf(
    PropTypes.shape({
      backgroundColor: PropTypes.string,
      border: PropTypes.string,
      title: PropTypes.string
    })
  ).isRequired
};

const SmallSquare = styled.div`
  background: ${(props) => props.background};
  border: 2px solid ${(props) => props.border || 'black'};
  width: 18px;
  height: 18px;
  border-radius: 4px;
`;

const StyledContainer = styled.div`
  width: 100%;
`;

const StyledUl = styled.ul`
  display: flex;
  flex-direction: row;
  margin-top: 30px;
  flex-wrap: wrap;
  justify-content: flex-start;
  justify-self: center;
  max-width: 1100px;
  margin-right: auto;
  margin-left: auto;
`;

const StyledLi = styled.li`
  display: flex;
  flex-direction: row;
  justify-self: flex-start;
  margin-right: 20px;
  min-width: 230px;
  margin-top: 20px;
  p {
    padding-left: 10px;
    margin: 0;
  }
`;

export default Legend;
