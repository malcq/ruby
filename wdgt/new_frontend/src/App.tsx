import React from 'react';
import styled from 'styled-components';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import memoize from 'memoize-one';
import { connect } from 'react-redux';
import { compose } from 'redux';

import {
  themeDefaultDesktop,
  themeDefaultMobile,
} from './theme/default';
import GlobalStyles from './theme/globalStyles';

import ChatContainer from './containers/Chat';
import SplashScreen from './containers/SplashScreen';

import Navbar from './components/UI/Navbar';

import { widgetService } from './api/widget';

import { IAppStore } from './store/types';

interface Props {
  isMobile: boolean,
  initialized: boolean,
};
interface State {
  initialized: boolean;
}

class App extends React.Component<Props, State> {
  componentDidMount() {
    /**
     * DOM IS LOADED
     * you can add here any side effects you want
     */
    widgetService.onLoad();
  }

  componentWillUnmount() {
    /**
     * If you need to unsubscribe, you can do it here
     */
  }

  getTheme = memoize(
    (isMobile: boolean): DefaultTheme => {
      if (isMobile) { return themeDefaultMobile; }
      return themeDefaultDesktop;
    }
  )

  render() {
    const { initialized } = this.props;

    const theme = this.getTheme(this.props.isMobile);

    return (
      <Container>
        <ThemeProvider theme={theme}>
          <>
            {/* <Test /> */}
            <Navbar
              onClose={() => widgetService.close()}
            />
            {!initialized
              ? <SplashScreen />
              : <ChatContainer />
            }
            <GlobalStyles />
          </>
        </ThemeProvider>
      </Container>
    );
  }
}

const Container = styled.div`
  max-width: 376px;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
`;

const mapStateToProps = (state: IAppStore) => ({
  isMobile: state.widgetStore.isMobile,
  initialized: state.widgetStore.initialized,
});

const reduxConnect = connect(
  mapStateToProps
);

export default compose(
  reduxConnect,
)(App);

