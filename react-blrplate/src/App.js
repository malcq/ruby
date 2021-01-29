import React, { PureComponent } from 'react';

import { Spinner } from 'ui';
import Router from 'routes';

class App extends PureComponent {
  state = { isAuthorized: false }

  componentDidMount() {
    this.setState({ isAuthorized: true });
  }

  render() {
    const { isAuthorized } = this.state;
    if (!isAuthorized) { return <Spinner forseShow />; }

    return (
      <>
        <Spinner />

        <Router />
      </>
    );
  }
}

export default App;
