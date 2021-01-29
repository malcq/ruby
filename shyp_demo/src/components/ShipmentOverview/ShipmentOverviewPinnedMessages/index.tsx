import React, { PureComponent } from 'react';
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import './styles.scss';

interface IShipmentOverviewPinnedMessagesProps {
  data: any;
  unpinMessage: any;
}

class ShipmentOverviewPinnedMessages extends PureComponent<IShipmentOverviewPinnedMessagesProps, any> {
  public static propTypes = {
    data: PropTypes.object,
    unpinMessage: PropTypes.func,
  };

  public static defaultProps = {
    data: {},
    unpinMessage: () => {}
  };

  public render() {
    const { data, unpinMessage } = this.props;
    const pinnedMessages = data.pinned_messages || [];

    return (<React.Fragment>
      {data.pinned_messages != null && data.pinned_messages.length > 0 && (
        <div className="shipment-overview-pinned-messages">
          <div className="shipment-overview-pinned-messages__header">
            Pinned Messages
          </div>

          <div className="">
            {pinnedMessages.map(message => (
              <div
                key={message.id}
                className="shipment-overview-pinned-messages__message-container"
              >
                {message.content != null && message.content !== '' && (
                  <React.Fragment>
                    <div
                      className="shipment-overview-pinned-messages__message"
                      dangerouslySetInnerHTML={{__html: message.content}}
                    />
                    <span className="shipment-overview-pinned-messages__message-separator">
                      -
                    </span>
                  </React.Fragment>)
                }
                <Link
                  className="shipment-overview-pinned-messages__show-message-link"
                  to={`/shipments/${data.id}/conversations/${message.id}`}
                >
                  show message
                </Link>
                {message.comment_attachments.map((commentAttachment, index) => (
                  <a
                    key={index}
                    className="shipment-overview-pinned-messages__attachment-link"
                    href={commentAttachment.file}
                    target="_blank"
                  >
                    {commentAttachment.original_filename}
                  </a>))
                }
                <i
                  className="shipment-overview-pinned-messages__unpin-icon icon close"
                  onClick={() => unpinMessage(data.id, message.id)}
                />
              </div>))
            }
          </div>
        </div>)
      }
    </React.Fragment>);
  }
}

export default ShipmentOverviewPinnedMessages