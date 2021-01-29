import React from 'react';
import Picker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';

import arrowNextIcon from '../../assets/icons/arrow-next.svg';
import arrowBackIcon from '../../assets/icons/arrow-back.svg';

type Props = {
  selectedDate?: Date | null,
  onChange: (
    date: Date,
    event: React.SyntheticEvent<any, Event> | undefined
  ) => any,
};
const Datepicker: React.FC<Props> = (props) => {
  const {
    selectedDate,

  } = props;

  return (
    <StyledContainer>
      <Picker
        selected={selectedDate}
        onChange={props.onChange}
        formatWeekDay={(dayOfWeekLabel) => dayOfWeekLabel.substring(0, 1)}
        inline
      />
    </StyledContainer>
  )
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;

  .react-datepicker {
    border: none;

    &__header {
      border: none;
      background-color: transparent;
      padding-top: 0;
    }

    &__current-month {
      ${props => props.theme.typography.fnMedium};
      font-size: 13px;
      line-height: 17px;
      min-height: 24px;
    }

    &__navigation {
      top: 2px;
      mask-repeat: no-repeat;
      mask-size: contain;
      width: 12px;
      height: 12px;
      background-color: ${props => props.theme.colorValues.grey};
      border: none;
      -webkit-tap-highlight-color: rgba(0,0,0,0);

      &--previous {
        left: 5px;
        mask-image: url(${arrowBackIcon});
      }

      &--next {
        right: 5px;
        mask-image: url(${arrowNextIcon});
      }
    }

    &__day,
    &__day-name,
    &__time-name {
        width: 40px;
        height: 40px;
        margin: 0;
        ${props => props.theme.typography.fnRegular};
        font-size: 13px;
        line-height: 17px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        user-select: none;
    }

    &__day {
      -webkit-tap-highlight-color: rgba(0,0,0,0);

      &:hover {
        border-radius: 100px;
        background-color: transparent;
      }

      &--selected,
      &--in-selecting-range,
      &--in-range,
      &--selected:hover,
      &--in-selecting-range:hover,
      &--in-range:hover {
        border-radius: 100px;
        background-color: ${props => props.theme.colorValues.primary};
      }
    }

    &__day-name {
      color: ${props => props.theme.colorValues.grey};
    }

    &__month {
      margin: 0;
    }

    &__day--outside-month {
      visibility: hidden;
    }

  }
  


`;

export default Datepicker;