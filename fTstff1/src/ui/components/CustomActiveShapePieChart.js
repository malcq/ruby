import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import _find from 'lodash/find';

import {
  PieChart,
  Pie,
  Legend,
  Cell
} from 'recharts';

const LEGEND_OPTIONS_MODAL_ON = {
  layout: 'vertical',
  verticalAlign: 'top',
  align: 'left'
};
const LEGEND_OPTIONS_MODAL_OFF = { verticalAlign: 'bottom' };

const nonRequestsText = (
  <div className="requests_text">Вы еще не создавали заявок</div>
);
class CustomPieChar extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      colors: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#F5A3F5', '#33CCAD']
    };
  }

  createData = (data, type) => {
    let defaultData;
    const VACATION_DAYS_QUOTA = 20;
    switch (type) {
      case 'holidays':
        defaultData = [{ name: 'Отдохни', value: VACATION_DAYS_QUOTA }];
        break;
      case 'requests':
        defaultData = [{ name: 'Отдохни', value: 0 }];
        break;
      default:
        defaultData = [];
        break;
    }
    return data.length ? data : defaultData;
  };

  render() {
    const {
      data = [],
      type,
      parentWidth,
      height,
      title,
      text,
      x,
      y,
      isModal,
      cx
    } = this.props;
    const pieData = this.createData(data, type);
    const { colors } = this.state;
    const legendStyle = isModal
      ? LEGEND_OPTIONS_MODAL_ON
      : LEGEND_OPTIONS_MODAL_OFF;
    if (_find(data, ['name', 'Превышено'])) {
      colors[1] = '#f4511e';
    }
    return (
      <StyledDiv>
        {title && <h1 className="header">{title}</h1>}

        {data.length
          ? (
            <PieChart width={parentWidth} height={height}>
              {text && (
                <text x={x} y={y} textAnchor="middle" dominantBaseline="middle">
                  {text}
                </text>
              )}
              <Legend {...legendStyle} height={36} />
              <Pie
                dataKey="value"
                data={pieData}
                cy={130}
                cx={cx}
                innerRadius={80}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                label
              >
                {data.map((entry, index) => {
                  return (
                    <Cell
                      key={entry.name}
                      fill={this.state.colors[index % this.state.colors.length]}
                    />
                  );
                })}
              </Pie>
            </PieChart>
          )
          : (
            nonRequestsText
          )}
      </StyledDiv>
    );
  }
}

const StyledDiv = styled.div`
  .header {
    text-align: center;
  }
  .requests_text {
    padding: 0 0 20px 0;
  }
`;

CustomPieChar.propTypes = {
  parentWidth: PropTypes.number,
  height: PropTypes.number,
  text: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
      days: PropTypes.string
    })
  ),
  x: PropTypes.string,
  y: PropTypes.string,
  cx: PropTypes.number,
  isModal: PropTypes.bool
};

CustomPieChar.defaultProps = {
  height: 320,
  x: '50%',
  y: '146',
  title: '',
  isModal: false,
  parentWidth: 0,
  text: '',
  type: '',
  data: [],
  cx: null
};

export default CustomPieChar;
