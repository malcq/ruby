import React from 'react';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { createDummyBlock, createDummyBlockType } from '../../../store/chat/actions';

type Props = {
  createDummyBlock: createDummyBlockType,
};
const CheatMode: React.FC<Props> = (props) => {
  const {
    createDummyBlock
  } = props;
  const [visible, setVisible] = React.useState(false);

  function onToggleClick() {
    setVisible(prevState => !prevState);
  }

  function onAddNewBlockA() {
    createDummyBlock('A');
  }

  function onAddNewBlockB() {
    createDummyBlock('B');
  }

  function onAddNewBlockC() {
    createDummyBlock('C');
  }

  return (
    <StyledContainer>
      <button onClick={onToggleClick}>
        {visible 
          ? 'x'
          : 'o (cheat mode)'
        }
      </button>

      {visible && (
        <StyledCheatContainer>
          <button onClick={onAddNewBlockA}>
            Add new dummy (A)
          </button>
          <button onClick={onAddNewBlockB}>
            Add new dummy (B)
          </button>
          <button onClick={onAddNewBlockC}>
            Add new dummy (C, selected input)
          </button>
        </StyledCheatContainer>
      )}
    </StyledContainer>
  )
};

const StyledContainer = styled.div`
`;

const StyledCheatContainer = styled.div`
`;

const reduxConnect = connect(
  undefined,
  {
    createDummyBlock,
  }
)

export default compose(
  reduxConnect,
)(CheatMode);
