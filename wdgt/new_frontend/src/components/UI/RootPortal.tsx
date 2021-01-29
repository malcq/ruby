import React from 'react';
import ReactDOM from 'react-dom';

type Props = {

};
class ModalPortal extends React.Component<Props> {
  private container: HTMLDivElement;

  constructor(props: Props) {
    super(props);
    this.container = document.createElement('div');
    this.container.classList.add('fancy-modal');
  }

  componentDidMount() {
    document.body.appendChild(this.container);
  }

  componentWillUnmount() {
    this.container.remove();
  }

  render() {
    const { children } = this.props;

    return ReactDOM.createPortal(
      children,
      this.container,
    );
  }
}

export default ModalPortal;
