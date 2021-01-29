import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import _uniqBy from 'lodash/uniqBy';

import {
  editRequestRequest,
  deleteRequestRequest
} from 'api/userRequestApi';
import { getFullName } from 'utils';

import Timeline, {
  CustomMarker,
  TimelineMarkers
} from 'react-calendar-timeline';
import Button from '@material-ui/core/Button';
import { RequestModal } from 'ui';
import CalendarLegend from './CalendarLegend';

const groups = [
  { id: 1, title: 'Технические' },
  { id: 2, title: 'Бытовые' },
  { id: 3, title: 'Документы' },
  { id: 4, title: 'Отпуска' },
  { id: 5, title: 'Больничные' },
  { id: 6, title: 'Отгулы' }
];

const itemGroups = {
  technical: {
    group: 1,
    backgroundColor: 'rgb(51, 122, 183)',
    color: 'black',
    canResize: false,
    canMove: true
  },
  common: {
    group: 2,
    backgroundColor: 'rgb(255,153,255)',
    color: 'black',
    canResize: false,
    canMove: true
  },
  documents: {
    group: 3,
    backgroundColor: 'rgb(51, 204, 173)',
    color: 'black',
    canResize: false,
    canMove: true
  },
  vacation: {
    group: 4,
    backgroundColor: 'rgb(92, 184, 92)',
    color: 'black',
    canResize: true,
    canMove: true
  },
  medical: {
    group: 5,
    backgroundColor: 'rgb(217, 83, 79)',
    color: 'black',
    canResize: true,
    canMove: true
  },
  dayOff: {
    group: 6,
    backgroundColor: 'rgb(240, 173, 78)',
    color: 'black',
    canResize: false,
    canMove: false
  },
  timeOff: {
    group: 6,
    backgroundColor: 'rgb(240, 173, 78)',
    color: 'black',
    canResize: false,
    canMove: false
  }
};

const legend = [
  {
    backgroundColor: 'rgb(51, 122, 183)',
    border: 'none',
    title: 'Технические заявки'
  },
  {
    backgroundColor: 'rgb(255,153,255)',
    border: 'none',
    title: 'Бытовые заявки'
  },
  {
    backgroundColor: 'rgb(51, 204, 173)',
    border: 'none',
    title: 'Заявки на документы'
  },
  {
    backgroundColor: 'rgb(92, 184, 92)',
    border: 'none',
    title: 'Заявки на отпуск'
  },
  {
    backgroundColor: 'rgb(217, 83, 79)',
    border: 'none',
    title: 'Заявки о больничном'
  },
  {
    backgroundColor: 'rgb(240, 173, 78)',
    border: 'none',
    title: 'Заявки на отгул'
  },
  { backgroundColor: 'lightgray', border: 'yellow', title: 'Ожидают ответа' },
  {
    backgroundColor: 'lightgray',
    border: 'green',
    title: 'Выполняются/Выполнены'
  },
  { backgroundColor: 'lightgray', border: 'red', title: 'Отклонены' }
];

class CalendarTimeline extends Component {
  constructor(props) {
    super(props);

    const TimeStart = moment()
      .subtract(4, 'days')
      .startOf('day')
      .toDate();
    const TimeEnd = moment()
      .add(6, 'days')
      .startOf('day')
      .add(1, 'day')
      .toDate();

    this.state = {
      modal: false,
      selectedData: {},
      TimeStart,
      TimeEnd,
    };
  }

  mapRequestsArray = (requests) => {
    let mappedRequests = [];
    let groupsCurrent = [];

    if (requests) {
      requests.forEach((request) => {
        const {
          group,
          backgroundColor,
          color,
          canResize,
          canMove
        } = itemGroups[request.type];
        const { id, status } = request;
        const fullName = getFullName(request.users[0]);
        const title = `${request.title} от ${fullName}`;
        let start_time = moment(request.dateFrom).startOf('hour');
        let end_time = moment(request.dateTo).endOf('hour');

        if (!request.dateFrom && request.dateTo) {
          start_time = moment(request.dateTo).startOf('day');
          end_time = moment(request.dateTo).endOf('day');
        } else if (request.dates && request.dates.length) {
          request.dates.forEach((element, index) => {
            const splittedRequest = {
              canResize,
              canMove,
              idForModal: id,
              group,
              backgroundColor,
              id: `split ${id}.${index}`,
              color,
              status,
              title,
              start_time: moment(element).startOf('day'),
              end_time: moment(element).endOf('day'),
              request,
              itemTouchSendsClick: true
            };
            groupsCurrent.push(groups[group - 1]);
            mappedRequests = mappedRequests.concat(splittedRequest);
          });
          return;
        }

        const mappedRequest = {
          canResize,
          canMove,
          idForModal: id,
          group,
          backgroundColor,
          id,
          color,
          status,
          title,
          start_time,
          end_time,
          request,
          itemTouchSendsClick: true
        };
        groupsCurrent.push(groups[group - 1]);
        mappedRequests = mappedRequests.concat(mappedRequest);
      });
      groupsCurrent = _uniqBy(groupsCurrent, 'id');
      return { mappedRequests, groupsCurrent };
    }
    return [];
  };

  onTodayClick = () => {
    const TimeStart = moment()
      .subtract(3, 'days')
      .toDate();
    const TimeEnd = moment()
      .add(3, 'days')
      .toDate();
    this.setState({ TimeEnd, TimeStart });
  };

  itemRenderer = ({ item, getItemProps }) => {
    const borderColors = {
      completed: 'green',
      denied: 'red',
      inProgress: 'green',
      wait: 'yellow'
    };
    const background = item.backgroundColor;
    const color = 'black';
    const border = `2px 2px 2px 20px solid ${borderColors[item.status]}`;
    const borderColor = borderColors[item.status];
    const borderLeftWidth = 20;
    const borderRightWidth = 2;
    const borderTopWidth = 2;
    const borderBottomWidth = 2;
    const borderRadius = '25px';

    return (
      <div
        {...getItemProps({
          style: {
            background,
            border,
            borderColor,
            color,
            borderStyle: 'solid',
            borderRadius,
            paddingLeft: 5,
            borderLeftWidth,
            borderRightWidth,
            borderTopWidth,
            borderBottomWidth,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            lineHeight: '25px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            zIndex: '49',
          }
        })}
      >
        {item.title}
      </div>
    );
  };

  openModal = (itemId /* , e, time */) => {
    if (typeof itemId === 'string' && itemId.includes('split')) {
      // eslint-disable-next-line
      itemId = +itemId.split(' ')[1].split('.')[0];
    }
    const item =
      this.props.requests.find((request) => request.id === itemId) || {};
    const open = this.state.modal;
    this.setState({
      modal: !open,
      selectedData: item
    });
  };

  answer = async (answerStr, comment) => {
    try {
      await editRequestRequest({
        id: this.state.selectedData.id,
        status: answerStr,
        deniedComment: comment || null,
        updated_by: this.props.globalUser.id
      });
      this.openModal();
      this.props.statusChange();
    } catch (err) {
      console.log(err);
    }
  };

  deleteRequest = async () => {
    try {
      await deleteRequestRequest(this.state.selectedData.id);
      this.openModal();
      this.props.statusChange();
    } catch (err) {
      console.log(err);
    }
  };

  editRequest = async (data) => {
    try {
      // eslint-disable-next-line
      data.id = this.state.selectedData.id;
      await editRequestRequest(data);
      this.openModal();
      this.props.statusChange();
    } catch (err) {
      console.log(err);
    }
  };

  animateScroll = (invert) => {
    const width = (invert ? -1 : 1) * parseFloat(this.scrollRef.style.width);
    const duration = 2000;

    const startTime = performance.now();
    let lastWidth = 0;
    const animate = () => {
      let normalizedTime = (performance.now() - startTime) / duration;
      if (normalizedTime > 1) {
        // not overanimate
        normalizedTime = 1;
      }

      const calculatedWidth = Math.floor(
        width * 0.5 * (1 + Math.cos(Math.PI * (normalizedTime - 1)))
      );
      if (this.scrollRef) {
        this.scrollRef.scrollLeft += calculatedWidth - lastWidth;
        lastWidth = calculatedWidth;
      }

      if (normalizedTime < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  onPrevClick = () => {
    this.animateScroll(true);
  };

  onNextClick = () => {
    this.animateScroll(false);
  };

  onItemMove = async (itemId, newStartDate) => {
    const { globalUser } = this.props;
    if (globalUser.role === 'admin') {
      let newEndDate;
      const item = this.props.requests.find((request) => request.id === itemId);
      const { dateFrom, dateTo } = item;
      const actualDifference = moment(dateTo).diff(moment(dateFrom), 'days');
      if (!item.dateFrom) {
        newEndDate = moment(newStartDate)
          .endOf('day')
          .toISOString();
        // eslint-disable-next-line
        newStartDate = null;
      } else {
        // eslint-disable-next-line
        newStartDate = moment(newStartDate)
          .startOf('dat')
          .toISOString();
        newEndDate = moment(newStartDate)
          .add(actualDifference, 'days')
          .endOf('day')
          .toISOString();
      }

      try {
        await editRequestRequest({
          id: itemId,
          dateFrom: newStartDate,
          dateTo: newEndDate
        });
        this.props.statusChange();
      } catch (err) {
        console.log(err);
      }
    }
  };

  onItemResize = async (itemId, newDates, way) => {
    const { globalUser } = this.props;
    if (globalUser.role === 'admin') {
      const item = this.props.requests.find((request) => request.id === itemId);
      let newStart;
      let newEnd;

      if (way === 'left') {
        newStart = moment(newDates)
          .startOf('day')
          .toISOString();
        newEnd = item.dateTo;
      } else {
        newStart = item.dateFrom;
        newEnd = moment(newDates)
          .endOf('day')
          .toISOString();
      }
      try {
        await editRequestRequest({
          id: itemId,
          dateFrom: newStart,
          dateTo: newEnd
        });
        this.props.statusChange();
      } catch (err) {
        console.log(err);
      }
    }
  };

  render() {
    const { modal, selectedData } = this.state;
    // TODO RESELECT !IMPORTANT
    const { groupsCurrent, mappedRequests } = this.mapRequestsArray(this.props.requests);

    selectedData.from = selectedData.users ? selectedData.users[0] : '';

    const { TimeEnd, TimeStart } = this.state;

    // const weekMilliseconds = 7 * 24 * 60 * 60 * 1000;
    const dayMilliseconds = 38 * 60 * 60 * 1000;
    const yearMilliseconds = 52 * 7 * 24 * 60 * 60 * 1000;

    return (
      <div>
        <RequestModal
          data={selectedData}
          show={modal}
          onHide={this.openModal}
          delete={this.deleteRequest}
          answer={this.answer}
          statusChange={this.props.statusChange}
          type="view"
        />
        <Timeline
          scrollRef={(el) => {
            this.scrollRef = el;
          }}
          groups={groupsCurrent}
          items={mappedRequests}
          itemHeightRatio={0.75}
          defaultTimeStart={TimeStart}
          defaultTimeEnd={TimeEnd}
          stackItems
          lineHeight={40}
          minZoom={dayMilliseconds}
          maxZoom={yearMilliseconds}
          itemRenderer={this.itemRenderer}
          onItemClick={this.openModal}
          onItemMove={this.onItemMove}
          onItemResize={this.onItemResize}
          canChangeGroup={false}
        >
          <TimelineMarkers>
            <CustomMarker
              date={moment()
                .hour(12)
                .toDate().getTime()}
            >
              {({ styles }) => {
                const newStyles = { ...styles, backgroundColor: 'red' };
                return <div style={newStyles} />;
              }}
            </CustomMarker>
          </TimelineMarkers>
        </Timeline>

        <CalendarButtonsBar>
          <Button variant="outlined" onClick={this.onPrevClick}>
            {'< Prev'}
          </Button>

          <Button variant="outlined" onClick={this.onNextClick}>
            {'Next >'}
          </Button>
        </CalendarButtonsBar>
        <CalendarLegend legend={legend} />
      </div>
    );
  }
}

CalendarTimeline.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      admin_who_updated_id: PropTypes.oneOfType([
        PropTypes.shape({
          firstName: PropTypes.string,
          id: PropTypes.number,
          lastName: PropTypes.string,
          login: PropTypes.string
        }),
        PropTypes.any
      ]),
      comment: PropTypes.string,
      dateFrom: PropTypes.string,
      dateTo: PropTypes.string,
      dates: PropTypes.arrayOf(PropTypes.string),
      deniedComment: PropTypes.string,
      from: PropTypes.shape({
        firstName: PropTypes.string,
        id: PropTypes.number,
        lastName: PropTypes.string,
        login: PropTypes.string,
        request_user: PropTypes.shape({
          createdAt: PropTypes.string,
          request_id: PropTypes.number,
          updatedAt: PropTypes.string,
          user_id: PropTypes.number
        })
      }),
      id: PropTypes.number,
      status: PropTypes.string,
      title: PropTypes.string,
      type: PropTypes.string,
      updated_by: PropTypes.number,
      users: PropTypes.arrayOf(PropTypes.shape({ some: PropTypes.string }))
    })
  ).isRequired,
  globalUser: PropTypes.shape({
    DoB: PropTypes.string,
    avatar: PropTypes.string,
    avatarThumbnail: PropTypes.string,
    createdAt: PropTypes.string,
    email: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.number,
    info: PropTypes.string,
    lastName: PropTypes.string,
    login: PropTypes.string,
    phone: PropTypes.string,
    repo: PropTypes.arrayOf(PropTypes.string),
    resetPasswordExpires: PropTypes.string,
    resetPasswordToken: PropTypes.oneOfType([PropTypes.string]),
    role: PropTypes.string,
    slack_conversational_id: PropTypes.string,
    slack_name: PropTypes.string,
    status: PropTypes.string
  }).isRequired,
  statusChange: PropTypes.func
};

CalendarTimeline.defaultProps = {
  statusChange: () => null
};

const CalendarButtonsBar = styled.div`
  display: flex;
  margin-left: 7px;
  margin-top: 30px;
  button {
    margin-right: 20px;
  }
`;

export default CalendarTimeline;
