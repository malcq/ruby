import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import get from 'lodash/get';

import { List } from 'containers/AdminPanel/Containers';

import MomentUTC from 'components/MomentUTC';

import { ROUTES } from 'constants';
import { HttpUtils } from 'utils';

class Item extends PureComponent {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  render() {
    const { user, onDelete } = this.props;

    return (
      <List.Content.Row>
        <List.Content.Col>
          {get(user, 'firstName')}
        </List.Content.Col>

        <List.Content.Col>
          {get(user, 'lastName')}
        </List.Content.Col>

        <List.Content.Col>
          {get(user, 'email')}
        </List.Content.Col>

        <List.Content.Col>
          {get(user, 'role')}
        </List.Content.Col>

        <List.Content.Col>
          <MomentUTC date={get(user, 'createdAt')} format="MM-DD-YYYY HH:mm" showTz={false} />
        </List.Content.Col>

        <List.Content.Col>
          <MomentUTC date={get(user, 'updatedAt')} format="MM-DD-YYYY HH:mm" showTz={false} />
        </List.Content.Col>

        <List.Content.ActionsCol
          buttons={[
            {
              type: 'link',
              text: 'View',
              url: HttpUtils.replaceIdParam(ROUTES.ADMIN_PANEL.USERS.VIEW, user.id),
            },
            {
              type: 'link',
              text: 'Edit',
              url: HttpUtils.replaceIdParam(ROUTES.ADMIN_PANEL.USERS.EDIT, user.id),
            },
            {
              type: 'delete',
              text: 'Delete',
              className: 'delete',
              onClick: () => onDelete(user.id),
            },
          ]}
        />
      </List.Content.Row>
    );
  }
}

export default Item;
