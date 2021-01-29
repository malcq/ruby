import React from 'react';
import styled, { css } from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { IAppStore } from '../../../store/types';
import { IChatBlock, IAction, ISelectedState } from '../../../models/chat';
import MessageList from './MessageList';
import ActionList from './ActionList';
import { Avatar } from '../../UI/Avatar';
import { EActionHeightTypes } from '../../../utils/constants';

type Props = {
  chatBlock: IChatBlock;
  onActionReply: (
    action: IAction,
    blockId: string,
    state: ISelectedState,
  ) => Promise<any>;
  onRollbackAction: (
    action: IAction,
    blockId: string,
  ) => void;
  animate: any;
  className: string;
  showAvatar?: boolean;
  heightType: EActionHeightTypes;
  isMobile: boolean;
};
const ChatBlock: React.FC<Props> = (props) => {
  const { chatBlock, animate, isMobile } = props;
  const {
    messages,
    actions,
    selected,
  } = chatBlock;

  function onDivClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    /**
     * ⚠️⚠️🏋️‍ God damn magic and acrobatics
     * 
     * When user clicks on div above, we remove all pointer events
     * and search action behind this div
     * If button found, we generate click on it
     */

    const {
      clientX,
      clientY,
    } = event;
    
    const parent = document.getElementById('pristine_block');
    if (!parent) { return; }
    
    (parent as HTMLDivElement).style.pointerEvents = 'none';
    
    const clickTarget = document.elementFromPoint(clientX, clientY);
    (parent as HTMLDivElement).style.pointerEvents = 'unset';
    if (!clickTarget) { return; }
    (clickTarget as HTMLDivElement).click();
  }

  const messageState = chatBlock.selected ? 'selected' : 'pristine';

  return (
    <StyledContainer
      className={animate}
      heightType={props.heightType}
      isMobile={isMobile}
    >
      <ClickableArea
        withAvatar={props.showAvatar}
        fixClick={props.heightType === EActionHeightTypes.big && !isMobile}
        onClick={onDivClick}
      />
      {props.showAvatar && (
          <StyledAvatar />
      )}
      <ContentContainer
        heightType={props.heightType}
        isMobile={isMobile}
      >
        <MessageList
          messages={messages}
          animate={messageState}
        />
        <ActionList
          actions={actions}
          selected={selected}
          blockId={chatBlock.id}
          onActionReply={props.onActionReply}
          animate={animate}
          onRollbackAction={props.onRollbackAction}
        />
      </ContentContainer>
    </StyledContainer>
  )
}

ChatBlock.defaultProps = {
  showAvatar: false,
}

type ClickableAreaProps = {
  withAvatar?: boolean;
  fixClick?: boolean;
}

const ClickableArea = styled.div<ClickableAreaProps>`
  width: 100%;
  height: ${props => props.withAvatar ? props.theme.distances.clickableAreaHeightWithAvatar : '82px;'};
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  ${props => props.fixClick
    ? css`
      flex-grow: 1;
      `
      : css``
  }
`;

type StyledContainerProps = {
  heightType: EActionHeightTypes;
  isMobile: boolean;
}
const StyledContainer = styled.div<StyledContainerProps>`
  &.pristine {
    flex-direction: column;
    display: flex;
    ${props => props.heightType === EActionHeightTypes.fullWindow 
      ? css`
        min-height: 100%;
      `
      : props.heightType === EActionHeightTypes.big && !props.isMobile
      ? css`
        min-height: 520px;
        justify-content: flex-end;
      `
      : css`
        min-height: 400px;
        justify-content: flex-end;
      `
    };
  }

`;

type ContentContainerProps = {
  heightType: EActionHeightTypes;
  isMobile: boolean;
};
const ContentContainer = styled.div<ContentContainerProps>`
  min-height: ${props => props.heightType === EActionHeightTypes.fullWindow || (props.heightType === EActionHeightTypes.big && !props.isMobile) ? 'calc(100% - 82px)' : '270px'};
  display: flex;
  /* flex-grow: ${props => props.heightType === EActionHeightTypes.fullWindow ? '1' : 'unset'}; */
  flex-direction: column;
  justify-content: ${props => props.heightType === EActionHeightTypes.fullWindow ? 'unset' : 'space-between'};
  `;

type ButtonProps = {
  firstId?: boolean;
}
const StyledAvatar = styled(Avatar)<ButtonProps>`
  width: 50px;
  height: 50px;
  position: absolute;
  top: ${props => props.theme.distances.avatarTop};
  left: 16px;
`;

const mapStateToProps = (state: IAppStore) => ({
  isMobile: state.widgetStore.isMobile,
});

const reduxConnect = connect(
  mapStateToProps,
);

export default compose(
  reduxConnect,
)(ChatBlock);
