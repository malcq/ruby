import React, { ReactNode, ReactNodeArray, StatelessComponent } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';

import './styles.scss';

interface ILoadableContainerProps{
  loading?: boolean,
  className?: string,
  children?: ReactNode | ReactNodeArray,
}

// Wraps content and renders loader spinner in it's place if loading prop is true
const LoadableContainer: StatelessComponent<any> = (props: ILoadableContainerProps) => {
  if (!props.loading) {
    return <>{props.children || null}</>;
  }
  return (
    <section className={`loader-container ${props.className}`}>
      <CircularProgress
        variant="indeterminate"
        classes={{
          svg: 'loader-container__spinner mui-override',
        }}
      />
    </section>
  );
};

LoadableContainer.propTypes = {
  loading: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ])
};

LoadableContainer.defaultProps = {
  loading: false,
  className: '',
  children: '',
};

export default LoadableContainer;