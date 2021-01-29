import React, { Component } from 'react';
import { toast } from 'react-toastify';
import _get from 'lodash/get';
import styled from 'styled-components';
import moment from 'moment';

import extraHourImage from 'ui/images/extraHours.png';
import { connectGlobalUser } from 'store/connections';
import { createPrettiedRange, getName } from 'utils';
import { UserType } from 'utils/types';
import {
  getExtraHours,
  postExtraHours,
  updateExtraHours,
  deleteExtraHours
} from 'api/extraHoursAPI';

import {
  WarningModal
} from 'ui';
import ExtraHoursModal from './components/ExtraHoursModal';
import FullTable from './components/FullTable';
import ExtraHoursButton from './components/ExtraHoursButton';

class ExtraHours extends Component {
  state = {
    rows: [],
    count: 0,
    order: 'desc',
    orderBy: 'createdAt',
    page: 0,
    rowsPerPage: 25,
    isFormModal: false,
    isDeleteModal: false,
    extraObject: undefined
  }

  componentDidMount() {
    this.getRows();
  }

  getRows = async () => {
    try {
      const { order, orderBy, page, rowsPerPage } = this.state;

      const {
        data: { count, rows }
      } = await getExtraHours({
        order,
        orderBy,
        page,
        rowsPerPage
      });

      const formattedRows = rows.map((el) => {
        return {
          ...el,
          range: createPrettiedRange(el.start, el.end),
          date: moment(el.date),
          author: {
            label: getName(el.user),
            value: el.user.id
          }
        };
      });

      this.setState({
        count,
        rows: formattedRows
      });
    } catch (e) {
      toast.error(`Ошибка получения списка с сервера! Ошибка: ${e}`);
    }
  };

  changeObjectParameters = (extra) => {
    this.setState({ extraObject: extra });
  }

  handleDeleteModal = () => {
    this.setState({ extraObject: undefined });
    this.setState(({ isDeleteModal }) => ({ isDeleteModal: !isDeleteModal }));
  }

  handleFormModal = () => {
    this.setState({ extraObject: undefined });
    this.setState(({ isFormModal }) => ({ isFormModal: !isFormModal }));
  }

  submitForm = async (data) => {
    try {
      const {
        author,
      } = data;
      const { extraObject } = this.state;
      const { role, id: currentUserId } = this.props.user;
      const payload = {
        ...data,
      };
      if (extraObject) {
        payload.user_id = author ? author.value : null;
        await updateExtraHours(extraObject.id, payload);
      } else {
        payload.user_id = role !== 'admin'
          ? currentUserId
          : data.author
            ? data.author.value
            : null;
        await postExtraHours(payload);
      }
      this.getRows();
      toast.success(`Заявка о переработке ${extraObject ? 'обновлена!' : 'отправлена администрации!'}`);
      this.handleFormModal();
    } catch (err) {
      if (_get(err, 'response.status', 500) === 400) {
        toast.error(_get(err, 'response.data', 'Ошибка валидации'));
        return;
      }
      toast.error('Внутренняя ошибка сервера');
    }
  };

  isDeliting = false

  deleteRow = async () => {
    if (this.isDeliting) { return; }
    this.isDeliting = true;
    try {
      const { id } = this.state.extraObject;
      await deleteExtraHours(id);
      this.getRows();
      toast.success('Заявка о переработке удалена!');
    } catch (e) {
      toast.error(`Ошибка: ${e}!`);
    }
    this.handleDeleteModal();
    this.isDeliting = false;
  };

  handleRequestSort = (orderBy, order) => {
    this.setState({
      orderBy,
      order
    }, this.getRows);
  };

  handleChangePage = (event, page) => {
    this.setState({ page }, this.getRows);
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      page: 0,
      rowsPerPage: event.target.value
    }, this.getRows);
  };

  render() {
    const {
      rows,
      extraObject,
      isFormModal,
      page,
      rowsPerPage,
      isDeleteModal,
      count,
      order,
      orderBy
    } = this.state;

    return (
      <StyledContainer>
        {!count &&
          <img
            src={extraHourImage}
            alt="human"
            className="container-image"
          />
        }

        <TableContainer className='container__table' count={count}>
          <ExtraHoursButton
            handleCreateModal={this.handleFormModal}
            count={count}
          />

          {count > 0 &&
            <FullTable
              globalUser={this.props.user}
              count={count}
              rows={rows}
              page={page}
              rowsPerPage={rowsPerPage}
              handleRequestSort={this.handleRequestSort}
              orderBy={orderBy}
              order={order}
              handleModal={this.handleFormModal}
              handleChangePage={this.handleChangePage}
              handleChangeRowsPerPage={this.handleChangeRowsPerPage}
              handleDeleteModal={this.handleDeleteModal}
              changeObjectParameters={this.changeObjectParameters}
            />
          }
        </TableContainer>

        <ExtraHoursModal
          open={isFormModal}
          onClose={this.handleFormModal}
          data={extraObject}
          submitForm={this.submitForm}
        />

        <WarningModal
          questionText="Удалить выбранную переработку?"
          open={isDeleteModal}
          onClose={this.handleDeleteModal}
          success={this.deleteRow}
          successButtonText="Удалить"
        />
      </StyledContainer >
    );
  }
}

const StyledContainer = styled.div`
  margin: 0 auto;
  padding-top: 20px;
  width: 100%;

  .container-image {
    margin: 0 auto;
    margin-top: 100px;
    display: block;
  }
  && .MuiPaper-root-25 {
    background-color: inherit;
  }
`;

const TableContainer = styled.div`
  margin: auto;

  &.container__table {
    width: ${props => (props.count ? '73%' : '215px')} ;
  }
`;

ExtraHours.propTypes = {
  user: UserType.isRequired
};

export default connectGlobalUser(ExtraHours);
