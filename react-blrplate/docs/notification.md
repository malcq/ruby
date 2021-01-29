# Notification
If you need notification you can use `react-toastify` package.

## [Docs](https://www.npmjs.com/package/react-toastify)

## Ussage
### Create ctyled wrapper
```js
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';

export default styled(ToastContainer)`
  /*
  Classes:
  Toastify__toast – main
  Toastify__toast-body – content wrapper
  Toastify__progress-bar – progress bar
  
  Modificators:
  --default
  --success
  --warning
  --error
  */

  && {
    color: inherit;
  }

  .Toastify__toast {
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;

    &--default {
    }

    &--success {
    }

    &--warning {
    }

    &--error {
    }
  }

  .Toastify__toast-body {
    text-align: center;

    &--default {
    }

    &--success {
    }

    &--warning {
    }

    &--error {
    }
  }

  .Toastify__progress-bar {
    &--default {
    }

    &--success {
    }

    &--warning {
    }

    &--error {
    }
  }
`;

```

### Add to the `App` component
```js
<StyledToastify
  autoClose={3000}
  draggable
  newestOnTop
  closeButton={false}
/>
```

### Call where you need
```js
  import { toast } from 'react-toastify';

  toast('Message text');

  toast.info('Info message text');

  toast.success('Success message text');

  toast.warn('Warn message text');

  toast.error('Error message text');
```
