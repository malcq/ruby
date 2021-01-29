import { css } from 'styled-components';

export default css`
  body {
    .rc-slider-track {
      background-color: ${({ theme }) => theme.colors.primary};
    }

    .rc-slider-handle {
      border-color: ${({ theme }) => theme.colors.primary};
      background-color:${({ theme }) => theme.colors.primaryContrast};
    }

    .rc-slider-handle:active {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 5px ${({ theme }) => theme.colors.primary};
    }

    .rc-slider-handle:hover {
      border-color: ${({ theme }) => theme.colors.primary};
    }

    .rc-slider-handle:focus {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;
