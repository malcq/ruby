import React from 'react';
import styled from 'styled-components';

import {
  CallIcon,
  CallIconOutlined
} from '../../../UI/icons/CallIcon';

import { IAction, ISelectedAction, ISelectedState } from '../../../../models/chat';
import { Button } from '../../../UI/Buttons';
import { CommonActionLayout } from '../../Common';

type CallIconOptions = {
  outlined?: boolean;
  hovering?: boolean;
}
function getCallIcon(options: CallIconOptions): React.FC {
  const {
    hovering = false,
    outlined = false,
  } = options;

  if (!hovering) {
    return outlined ? CallIconOutlined : CallIcon;
  } else {
    return outlined ? CallIcon : CallIconOutlined;
  }
}

type Props = {
  action: IAction;
  selected?: ISelectedAction;
  onActionReply: (action: IAction, state: ISelectedState) => Promise<any>;
  onRollbackAction: (action: IAction) => void;
  outlined?: boolean;
};
const CallButton: React.FC<Props> = (props) => {
  const { action, outlined } = props;
  const { title, phone_call: phone } = action.options;
  const phoneRef = `tel:${phone}`;

  return (
    <StyledContainer>
      <StyledLink
        href={phoneRef}
        target="_parent"
      >
        <StyledButton outlined={outlined}>
          <IconContainer>
            <CallIconOutlined className="callbutton__call-icon-green" />
            <CallIcon className="callbutton__call-icon" />
          </IconContainer>
          {' '}
          {title}
        </StyledButton>
      </StyledLink>
    </StyledContainer>
  )
}

CallButton.defaultProps = {
  outlined: true,
};

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 29px;
  padding-right: 29px;

  &:hover .callbutton__call-icon-green {
    display: none;
  }

  &:hover .callbutton__call-icon {
    display: block;
  }


  .callbutton {
    &__call-icon-green {
      display: block;
    }

    &__call-icon {
      display: none;
    }
  }
`;

const StyledContainer = styled(CommonActionLayout)`
  display: flex;
  justify-content: flex-end;
`;

const IconContainer = styled.div`
  width: 18px;
  height: 18px;
  display: block;
  margin-right: 10px;
`;

const StyledLink = styled.a`
  text-decoration: none;
`;

export default CallButton;
