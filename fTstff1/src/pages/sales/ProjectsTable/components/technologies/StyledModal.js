import styled from 'styled-components';

import { Modal } from 'ui';

export default styled(Modal)`
  .modal-papper {
    width: 600px;
  }

  .modal-title {
    text-align: center;
  }

  .form-tabs {
    margin-top: 20px;
  }

  .form {
    display: grid;
    padding-top: 20px;
    grid-gap: 15px;
    grid-template-columns: 1fr 1fr auto;
    grid-template-areas: 'title select button';

    &--group {
      grid-template-areas: 'title title button';
    }
  }

  .title-input {
    grid-area: title;

    input {
      text-align: left;
    }
  }

  .select-wrapper {
    grid-area: select;
  }

  .tech-group-select {
    &__control {
      height: 100%;
      box-shadow: none;
      border-color: rgba(0, 0, 0, 0.23);
      cursor: pointer;

      :hover {
        border-color: rgba(0, 0, 0, 0.23);
      }
    }

    &__option {
      cursor: pointer;
    }
  }

  .submit-button {
    grid-area: button;
    min-width: 100px;

    :hover {
      background-color: rgba(68, 157, 68, 0.6);
    }
  }

  .tech-group {
    list-style: none;
    padding: 0;
  }

  .edit-icon {
    margin-left: 15px;
    opacity: 0;
    transition: 0.1s;
  }

  .delete-icon {
    float: right;
    margin-right: 10px;
  }

  h4:hover,
  li:hover {
    .edit-icon {
      opacity: 1;
    }
  }

  @media (max-width: 600px) {
    .form--tech {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr 1fr;
      grid-template-areas: 'title' 'select' 'button';
    }

    .form--group {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr;
      grid-template-areas: 'title' 'button';
    }
  }
`;
