import React from 'react';
import styled from 'styled-components';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const progressBarStyles = buildStyles({
  strokeLinecap: 'butt',
  pathColor: '#27C46A',
  trailColor: 'transparent',
});

type Props = {
  progress?: number;
  onCancel?: () => void;
  className?: string;
}
const LoadingBlock: React.FC<Props> = (props) => {
  const {
    onCancel,
    progress = 0
  } = props;

  return (
    <StyledContainer onClick={onCancel} className={props.className}>
      <div className="loading-block__spinner">
        <CircularProgressbar
          value={progress}
          styles={progressBarStyles}
          strokeWidth={10}
        />
      </div>

      <p className="loading-block__description">
        cancel upload
      </p>
    </StyledContainer>
  )
};

const StyledContainer = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 12px;
  background-color: ${props => props.theme.colorValues.athensgrey};
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  .loading-block__spinner {
    margin-top: 56px;
    width: 46px;
    height: 46px;
  }

  .loading-block__description {
    color: ${props => props.theme.colorValues.grey};
    ${props => props.theme.typography.fnRegular};
    font-size: 13px;
    line-height: 17px;
    margin: 0;
    padding: 0;
    margin-top: 43px;
    user-select: none;
  }
`;

LoadingBlock.defaultProps = {
  progress: 0,
  onCancel: () => null,
};

export default LoadingBlock;
