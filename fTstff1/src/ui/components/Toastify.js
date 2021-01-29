import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';

export default styled(ToastContainer)`
  .Toastify__toast {
    border-radius: 4px;
  }

  .Toastify__toast-body {
    color: #35353b;
    font-size: 16px;
    font-weight: normal;
    text-align: center;
  }

  .Toastify__close-button {
    display: none;
  }

  .Toastify__progress-bar {
    background: #bdbdbd;
  }

  /* Success type */
  .Toastify__toast--success {
    background: rgb(68, 157, 68);

    .Toastify__toast-body {
      color: white;
    }

    .Toastify__progress-bar {
      background-color: rgb(0, 214, 0);
    }
  }

  /* Info type */
  .Toastify__toast--info {
    background: rgb(40, 96, 144);

    .Toastify__toast-body {
      color: white;
    }

    .Toastify__progress-bar {
      background: rgb(140, 170, 255);
    }
  }

  /* Warning type */
  .Toastify__toast--warning {
    background: rgb(236, 151, 31);

    .Toastify__toast-body {
      color: white;
    }

    .Toastify__progress-bar {
      background-color: rgb(255, 215, 159);
    }
  }

  /* Error type */
  .Toastify__toast--error {
    background: rgb(201, 48, 44);

    .Toastify__toast-body {
      color: white;
    }

    .Toastify__progress-bar {
      background-color: rgb(255, 114, 111);
    }
  }
`;
