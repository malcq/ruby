import React from 'react';
import styled from 'styled-components';

import Select from '../components/UI/Select';

type State = {
  multiselect: boolean;
}
class Test extends React.Component<{}, State> {

  state = {
    multiselect: true,
  }

  render() {
    // const variants = {
    //   open: {
    //     transition: { staggerChildren: 0.07, delayChildren: 0.2 }
    //   },
    //   closed: {
    //     transition: { staggerChildren: 0.05, staggerDirection: -1 }
    //   }
    // }

    return (
      <ParentContainer>
        <StyledContainer>
          <button onClick={() => this.setState(prevState => ({multiselect: !prevState.multiselect}))}>
            {`select is ${this.state.multiselect ? 'on' : 'off'}`}
          </button>
          {/* <Select
            items={[]}
            enableSearch={true}
            multiselect={this.state.multiselect}
          /> */}
          <div className="test-block"></div>
          <div className="test-block"></div>
          <div className="test-block"></div>
          <div className="test-block"></div>
        </StyledContainer>
      </ParentContainer>
    )
  }
}

const ParentContainer = styled.div`
  background-color: white;
  position: relative;
`;

const StyledContainer = styled.div`
  position: absolute;
  margin: 0 auto;
  width: 375px;
  height: 675px;
  border: 3px solid black;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  /* display: flex;
  flex-direction: column;
  justify-content: flex-end; */

  & > .test-block {
    width: 375px;
    margin-bottom: 10px;
    height: 340px;
    background-color: aqua;
  }
`;

export default Test;
