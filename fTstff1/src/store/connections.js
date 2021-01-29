import { connect } from 'react-redux';

export const connectGlobalUser = connect(
  ({ global: { user } }) => ({
    user
  })
);
