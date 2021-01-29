import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  TextField,
  FormControl,
  Button,
  Collapse
} from '@material-ui/core';

class Filters extends Component {
  state = {
    open: false,
    name: ''
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  search = (e) => {
    e.preventDefault();
    const filter = {
      name: this.state.name
    };
    this.props.applyFilter(filter);
  };

  clear = () => {
    this.setState({
      name: ''
    });
    this.props.applyFilter({});
  };

  render() {
    return (
      <div style={{ margin: 'auto', marginBottom: '35px' }}>
        <Button
          variant="outlined"
          style={
            styles.show // active={this.state.open}
          }
          onClick={() => {
            const { open } = this.state;
            this.setState({ open: !open });
          }}
        >
          Фильтр
        </Button>

        <Collapse in={this.state.open}>
          <div>
            <CustomWell>
              <form onSubmit={this.search}>
                <FilterContainer>
                  <NameInput>
                    <p style={{ marginBottom: '2px', fontSize: '14px' }}>
                      Имя, Фамилия или логин:
                    </p>
                    <FormControl
                      onChange={this.onChange}
                      value={this.state.name}
                      autoComplete="off"
                      name="name"
                      type="text"
                    >
                      <TextField
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.name}
                        name="name"
                        type="text"
                      />
                    </FormControl>
                  </NameInput>
                </FilterContainer>

                <ApplyButton
                  onSubmit={this.search}
                  className="accept-btn"
                  type="submit"
                >
                  {String.fromCharCode('0x21B5')}
                </ApplyButton>
              </form>

              <ClearButton
                onClick={this.clear}
                className="decline-btn"
                size="small"
              >
                Сброс
              </ClearButton>
            </CustomWell>
          </div>
        </Collapse>
      </div>
    );
  }
}

const styles = {
  show: {
    marginBottom: '10px'
  },
  container: {
    width: '100%',
    margin: '0 auto 10px auto',
    position: 'relative',
    textAlign: 'center',
    paddingRight: '60px'
  },
  name: {
    display: 'inline-block',
    maxWidth: '250px',
    width: '70%'
  },
  apply: {
    position: 'absolute',
    bottom: '5px',
    right: '5px'
  },
  clear: {
    position: 'absolute',
    top: '5px',
    right: '5px'
  }
};

const FilterContainer = styled.div`
  && {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }
`;

const CustomWell = styled.div`
  && {
    width: 100%;
    margin: 0 auto 10px auto;
    position: relative;
    text-align: center;
    padding-right: 60px;
    background-color: #f5f5f5;
    min-height: 100px;
  }
`;

const NameInput = styled.div`
  display: inline-block;
  min-width: 170px;
  width: 30%;
  margin: 10px 0 0 0;
  padding: 10px;
  b {
    display: block;
    padding-bottom: 7px;
    font-size: 15px;
  }
  input {
    background-color: white;
    max-height: 39px;
    box-sizing: border-box;
  }
`;

const ApplyButton = styled(Button)`
  && {
    position: absolute;
    bottom: 5px;
    right: 5px;
  }
`;

const ClearButton = styled(Button)`
  && {
    position: absolute;
    top: 5px;
    right: 5px;
  }
`;

Filters.propTypes = {
  applyFilter: PropTypes.func.isRequired
};

export default Filters;
