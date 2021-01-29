import React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { compose, AnyAction } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import TypingAnimation from '../components/UI/TypingAnimation';
import { Button } from '../components/UI/Buttons';

import * as chatActions from '../store/chat/actions';
import * as widgetActions from '../store/widget/actions';

import { IAppStore, IWidgetStore } from '../store/types';

type Props = {
  hasSession: boolean;
  chatBlocks: string[];
  connectChat: chatActions.connectChatType;
  setConfig: (config: Partial<IWidgetStore>) => void;
}

const SplashScreen: React.FC<Props> = (props) => {
  const { hasSession, chatBlocks } = props;
  console.debug(`SplashScreen hasSession=${hasSession}`);

  const [startedInit, setInit] = React.useState(false);

  function onNewChat() {
    setInit(true);
    props.connectChat(true);
    console.debug(`SplashScreen onNewChat`);
  }

  function onContinueChat() {
    setInit(true);
    if (chatBlocks.length) {
      props.setConfig({initialized: true});
    } else {
      props.connectChat(false);
    }
  }

  React.useEffect(() => {
    if(!hasSession) {
      onNewChat();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  const showTypingAnimation = !hasSession || (hasSession && startedInit);

  return (
    <StyledContainer>
      {hasSession && !startedInit && (
        <TopContainer>
          <ButtonPlace>
            <StyledButton
              outlined
              color='primary'
              onClick={onContinueChat}
            >
              Continue chat
            </StyledButton>
          </ButtonPlace>
          <ButtonPlace>
            <StyledButton
              outlined
              color='primary'
              onClick={onNewChat}
            >
              Start new conversation
            </StyledButton>
          </ButtonPlace>
        </TopContainer>
      )}
      {showTypingAnimation && <TypingAnimation />}
    </StyledContainer>
  )
};

const ButtonPlace = styled.div`
  padding-bottom: 10px;
`;

const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 0 24px 52px 24px;
  height: 100%;
`;

const StyledButton = styled(Button)`
`;

const mapStateToProps = (state: IAppStore) => ({
  hasSession: state.widgetStore.hasSession,
  chatBlocks: state.chatStore.chatBlocks,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    connectChat: (
      startNewChat: boolean
    ) => dispatch(chatActions.connectChat(startNewChat)),
    setConfig: (
      config: Partial<IWidgetStore>
    ) => dispatch(widgetActions.setConfig(config)),
  }
}

const reduxConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default compose(
  reduxConnect,
)(SplashScreen);
