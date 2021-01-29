import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import { toast } from 'react-toastify';

import {
  getAllTechnologiesArrRequest,
  createTechnologyRequest,
  updateTechRequest,
  deleteTechRequest
} from 'api/technologiesApi';
import {
  getTechGroupsRequset,
  createTechGroupRequest,
  updateTechGroupRequest,
  deleteTechGroupRequest
} from 'api/techGroupApi';

import Select from 'react-select';
import {
  TextField,
  Collapse,
  Button,
  Tabs,
  Tab
} from '@material-ui/core';
import { Container, Draggable } from 'react-smooth-dnd';

import StyledModal from './StyledModal';
import GroupItem from './GroupItem';
import TechItem from './TechItem';

class TechModal extends PureComponent {
  state = {
    title: '',
    tabIndex: 0,
    collapse: false,
    selectedGroup: null,
    groups: [],
    groupOptions: [],
    editedId: null,
    grouplessTechs: []
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const { data: groups } = await getTechGroupsRequset({
        params: { includes: 'technologies' }
      });
      const groupOptions = groups.map((group) => ({
        label: group.title,
        value: group.id
      }));

      const { data: grouplessTechs } = await getAllTechnologiesArrRequest({
        params: { group: 'null' }
      });

      this.setState({
        groups,
        groupOptions,
        grouplessTechs
      });
    } catch (err) {
      console.log('Error in fetchData function:\n', err);
      toast('Ошибка при загрузке данных', { type: 'error' });
    }
  };

  refreshForm = () => {
    this.setState({
      title: '',
      selectedGroup: null,
      editedId: null
    });
  };

  onInputChange = (ev) => {
    this.setState({ title: _get(ev, 'target.value', '') });
  };

  toggleCollapse = (data) => {
    // eslint-disable-next-line
    const collapse = typeof data === 'boolean' ? data : !this.state.collapse;
    this.setState({ collapse });
    this.refreshForm();
  };

  onTabIndexChange = (ev, tabIndex) => {
    if (tabIndex === this.state.tabIndex) {
      return;
    }
    this.setState({ tabIndex }, this.refreshInput);
    this.refreshForm();
  };

  refreshInput = () => {
    // It's just for input's render.
    // Cause without it material input doesn't change the border for a new label
    const { title } = this.state;
    this.setState({ title: ' ' }, () => this.setState({ title }));
  };

  onSelectedGroupChange = (selectedGroup) => {
    this.setState({ selectedGroup });
  };

  onGroupEditInit = (group) => {
    this.setState(
      {
        title: group.title,
        selectedGroup: null,
        tabIndex: 1,
        editedId: group.id,
        collapse: true
      },
      this.refreshInput
    );
  };

  onTechEditInit = (tech) => {
    this.setState(
      {
        title: tech.title,
        selectedGroup: !tech.group_id
          ? null
          : {
            label: tech.techGroup.title,
            value: tech.techGroup.id
          },
        tabIndex: 0,
        editedId: tech.id,
        collapse: true
      },
      this.refreshInput
    );
  };

  onSubmit = async () => {
    try {
      const { editedId, title, selectedGroup, tabIndex } = this.state;

      if (!title.trim()) {
        toast('Заполните поле с заголовком', { type: 'warning' });
        return;
      }

      const data = {
        title,
        group_id: selectedGroup ? selectedGroup.value : null
      };

      if (editedId) {
        await (tabIndex === 0 ? updateTechRequest : updateTechGroupRequest)({
          id: editedId,
          data
        });
      } else {
        await (tabIndex === 0
          ? createTechnologyRequest
          : createTechGroupRequest)({ data });
      }

      await this.fetchData();
      this.refreshForm();
      toast(
        `${tabIndex === 0 ? 'Технология' : 'Группа'} успешно 
        ${
        editedId
          ? 'изменена'
          : 'создана'}`,
        { type: 'success' }
      );
    } catch (err) {
      console.log('Error in onSubmit function:\n', err);
      toast('Ошибка при отправке данных', { type: 'error' });
    }
  };

  onClose = () => {
    this.refreshForm();
    this.setState({ tabIndex: 0 });
    this.props.onClose();
  };

  onDelete = async (id, type) => {
    try {
      await (type === 'tech' ? deleteTechRequest : deleteTechGroupRequest)(id);
      await this.fetchData();
      this.refreshForm();
      toast(`${type === 'tech' ? 'Технология' : 'Группа'} удалена успешно`, {
        type: 'success'
      });
    } catch (err) {
      console.log('Error in onDelete function:\n', err);
      toast(
        `Ошибка при удалении ${type === 'tech' ? 'технологии' : 'группы'}`,
        { type: 'error' }
      );
    }
  };

  // eslint-disable-next-line
  dnd = {
    tech: undefined,
    group_id: undefined,
    groupCounter: 0
  };

  onDrop = ({ removedIndex, addedIndex }) => {
    const { groups, grouplessTechs } = this.state;
    let group_id = null;

    if (this.dnd.groupCounter < groups.length) {
      group_id = groups[this.dnd.groupCounter].id;
    }

    if (removedIndex !== null) {
      const technologies = group_id
        ? groups[this.dnd.groupCounter].technologies
        : grouplessTechs;

      this.dnd.tech = technologies[removedIndex];
    }

    if (addedIndex !== null) {
      this.dnd.group_id = group_id;
    }

    if (this.dnd.tech && this.dnd.group_id !== undefined) {
      if (this.dnd.tech.group_id !== this.dnd.group_id) {
        this.onTehsGroupChange(this.dnd.tech.id, this.dnd.group_id);
      }
      this.dnd.tech = undefined;
      this.dnd.group_id = undefined;
    }
    if (
      this.dnd.groupCounter ===
      groups.length - 1 + (grouplessTechs.length ? 1 : 0)
    ) {
      this.dnd.groupCounter = 0;
    } else {
      this.dnd.groupCounter += 1;
    }
  };

  onTehsGroupChange = async (id, group_id) => {
    try {
      await updateTechRequest({ id, data: { group_id } });
      this.fetchData();
    } catch (err) {
      console.log('Error in onTehsGroupChange function:\n', err);
    }
  };

  scrollToTop = () => {
    document.querySelector('.technologies').scrollTo(0, 0);
    document.querySelector('.title-input').children[1].children[1].focus();
  };

  render() {
    const {
      title,
      tabIndex,
      collapse,
      selectedGroup,
      groups,
      groupOptions,
      grouplessTechs,
      editedId
    } = this.state;

    return (
      <StyledModal
        open={this.props.open}
        onClose={this.onClose}
        className="technologies"
      >
        <h1 className="modal-title">Технологии</h1>

        <Button variant="outlined" onClick={this.toggleCollapse}>
          Создать
        </Button>

        <Collapse in={collapse}>
          <Tabs
            value={tabIndex}
            onChange={this.onTabIndexChange}
            indicatorColor="primary"
            textColor="primary"
            className="form-tabs"
            variant="fullWidth"
          >
            <Tab label="Технологию" />
            <Tab label="Группу" />
          </Tabs>

          <div
            ref={this.form}
            className={`form ${tabIndex === 0 ? 'form--tech' : 'form--group'}`}
          >
            <TextField
              variant="outlined"
              value={title}
              onChange={this.onInputChange}
              label={`Заголовок ${tabIndex === 0 ? 'технологии' : 'группы'}`}
              className="title-input"
            />

            {tabIndex !== 0 ? null : (
              <Select
                options={groupOptions}
                value={selectedGroup}
                onChange={this.onSelectedGroupChange}
                classNamePrefix="tech-group-select"
                className="select-srapper"
                isClearable
              />
            )}

            <Button
              variant="outlined"
              onClick={this.onSubmit}
              className="submit-button"
            >
              {editedId ? 'Изменить' : 'Создать'}
            </Button>
          </div>
        </Collapse>

        {groups.map((group) => (
          <ul key={group.id} className="tech-group">
            <GroupItem
              group={group}
              onEdit={this.onGroupEditInit}
              onDelete={this.onDelete}
              editable
              scrollToRef={this.scrollToTop}
            />
            <Container groupName="techs" onDrop={this.onDrop}>
              {group.technologies.map((tech) => (
                <Draggable key={tech.id}>
                  <TechItem
                    tech={tech}
                    onEdit={this.onTechEditInit}
                    onDelete={this.onDelete}
                    editable
                    scrollToRef={this.scrollToTop}
                  />
                </Draggable>
              ))}
              {group.technologies.length ? null : <TechItem />}
            </Container>
          </ul>
        ))}

        {!grouplessTechs.length ? null : (
          <ul className="tech-group groupless">
            <GroupItem />
            <Container groupName="techs" onDrop={this.onDrop}>
              {grouplessTechs.map((tech) => (
                <Draggable key={tech.id}>
                  <TechItem
                    tech={tech}
                    onEdit={this.onTechEditInit}
                    onDelete={this.onDelete}
                    editable
                    scrollToRef={this.scrollToTop}
                  />
                </Draggable>
              ))}
            </Container>
          </ul>
        )}
      </StyledModal>
    );
  }
}

TechModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};

TechModal.defaultProps = {
  open: false,
  onClose: () => null
};

export default TechModal;
