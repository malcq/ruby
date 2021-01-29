import React from 'react';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';

import closeIcon from '../../assets/icons/close.svg';
import { IAppStore } from '../../store/types';

type Props = {
  onClose?: () => void,
  isMobile: boolean,
}

const Navbar: React.FC<Props> = (props) => {
  const {
    onClose,
    isMobile,
  } = props;

  return (
    <StyledContainer onClick={onClose}>
      {isMobile && (
        <CloseButton />
      )}
    </StyledContainer>
  )
}

Navbar.defaultProps = {
  onClose: () => null,
  isMobile: false,
};

const StyledContainer = styled.div`
  position: fixed;
  top: 0;
  min-height: 26px;
  padding: 21px;
  z-index: 11;
  width: auto;
`;

const CloseButton = styled.div`
  width: 14px;
  height: 14px;
  background-image: url(${closeIcon});
  display: block;
  background-size: contain;
  background-color: inherit;
  outline: none;
  border: none;
  cursor: pointer;
`;

const mapStateToProps = (state: IAppStore) => ({
    isMobile: state.widgetStore.isMobile,
});

const reduxConnect = connect(
  mapStateToProps
);

export default compose(
  reduxConnect,
)(Navbar);
