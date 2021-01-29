import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment, { Moment } from 'moment';
import bind from 'autobind-decorator';
import { DateRange, Range } from 'react-date-range';

import { DATE_FORMAT } from '../../config/constants';
import { MenuButton } from '../';
import './styles.scss';

interface IDateRangeSelectorProps {
  className?: string;
  buttonColor?: string;
  initialRangeStart?: string;
  initialRangeEnd?: string;
  title?: string;
  onSubmit?: (startDate: string, endDate: string) => void;
  onCancel?: () => void;
}

interface IDateRangeSelectorState {
  rangeStart?: Moment | null;
  rangeEnd?: Moment | null;
  step: number;
}

const initialState = {
  rangeStart: null,
  rangeEnd: null,
  step: 0,
};

const displayMoment = (date?: Moment | null): string => date ? date.format('DD MMM') : '';

const resolveDate = (date?: string | null): Moment | undefined =>
  date ? moment(date, DATE_FORMAT) : undefined;


class DateRangeSelector extends PureComponent<IDateRangeSelectorProps, IDateRangeSelectorState> {
  public static propTypes = {
    className: PropTypes.string,
    buttonColor: PropTypes.string,
    initialRangeStart: PropTypes.string,
    initialRangeEnd: PropTypes.string,
    title: PropTypes.string,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  };
  public static defaultProps = {
    className: '',
    buttonColor: 'grey-outline-green',
    initialRangeStart: '',
    initialRangeEnd: '',
    rangeEnd: '',
    title: '',
  };

  public readonly state = initialState;

  public render () {
    const {
      buttonColor,
      className,
      title,
      initialRangeStart,
      initialRangeEnd,
    } = this.props;

    const {
      rangeStart,
      rangeEnd,
      step,
    } = this.state;

    const isActive = !!(initialRangeStart || initialRangeEnd);

    let displayRange: string;

    if (initialRangeStart && initialRangeEnd) {
      displayRange = `(${displayMoment(moment(initialRangeStart))} - ${displayMoment(moment(initialRangeEnd))})`
    } else {
      displayRange = (rangeStart || rangeEnd)
        ? `(${displayMoment(rangeStart)} - ${displayMoment(rangeEnd)})`
        : '';
    }


    return (
      <MenuButton
        className={className}
        buttonColor={buttonColor}
        title={`${title} ${displayRange}`}
        isActive={isActive}
        isOpen={step > 0}
        onClick={this.handleClick}
        onCancel={this.handleCancel}
      >
        <DateRange
          onlyClasses={true}
          linkedCalendars={true}
          startDate={resolveDate(initialRangeStart)}
          endDate={resolveDate(initialRangeEnd)}
          onChange={this.handleChange}
        />
      </MenuButton>
    );
  }

  @bind
  private handleClick(): void {
    this.setState({
      rangeStart: null,
      rangeEnd: null,
    })
  }

  @bind
  private handleChange(range: Range): void {
    switch (this.state.step) {
      case 0:
      case 1:
        this.setState({
          rangeStart: range.startDate,
          step: 2,
        });
        return;
      case 2:
        this.setState({
          rangeStart: null,
          rangeEnd: null,
          step: 0
        });
        const { onSubmit } = this.props;
        if (onSubmit) {
          onSubmit(
            range.startDate ? range.startDate.format(DATE_FORMAT) : '',
            range.endDate ? range.endDate.format(DATE_FORMAT) : '',
          )
        }
        return;
      default: return;
    }
  }

  @bind
  private handleCancel(): void {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
    this.setState(initialState);
  }
}

export default DateRangeSelector;
