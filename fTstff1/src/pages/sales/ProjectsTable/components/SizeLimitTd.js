import styled from 'styled-components';

import { TableCell } from '@material-ui/core';

export default styled(TableCell)`
  max-width: 10px;
  word-wrap: break-word;
  font-size: 14px;
  a {
    color: black;
  }

  && {
    text-align: center;
    border-right: 1px solid #e0e0e0;
  }
`;
