import React, { PureComponent } from 'react';
import classNames from 'classnames/bind';
import PropTypes from "prop-types";
import { LocationDescriptor } from "history";

import './styles.scss';

interface IShipmentOverviewContainerProps {
  data: any;
  toLocation: (location: LocationDescriptor) => void;
}

class ShipmentOverviewContainer extends PureComponent<IShipmentOverviewContainerProps, any> {
  public static propTypes = {
    data: PropTypes.object,
    toLocation: PropTypes.func,
  };

  public static defaultProps = {
    data: {},
    toLocation():void {},
  };

  public render() {
    const { data, toLocation } =this.props;

    return (
      <div className="shipment-overview-container">
        <div className="shipment-overview-container__title">
          Container
        </div>

        <div
          className="shipment-overview-container__main-container"
          onClick={() => toLocation(`/shipments/${data.id}/documentation`)}
        >
          <div className="shipment-overview-container__general-info-table">
            <div className="shipment-overview-container__general-info-table-column">
              <div className="shipment-overview-container__general-info-table-header">
                Type
              </div>
              <div className="shipment-overview-container__general-info-table-type-value">
                {data.container_type != null ? (
                  <React.Fragment>
                    <i
                      className={classNames('shipment-overview-container__general-info-table-type-value-icon',
                      'icon', {
                        'lcl': data.container_type === 'LCL',
                        'airport': data.container_type === 'AIR',
                        'container20ft': data.container_type === '20 ft',
                        'container40ft': data.container_type === '40 ft',
                        'container40fthq': data.container_type === '40ft HQ',
                      })}
                    />
                    {data.container_type}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    —
                  </React.Fragment>)
                }
              </div>
            </div>
            <div className="shipment-overview-container__general-info-table-column">
              <div className="shipment-overview-container__general-info-table-header">
                Container ID
              </div>
              <div className="shipment-overview-container__general-info-table-container-id-value">
                {data.title != null ? data.title : '—'}
              </div>
            </div>
            <div className={classNames('shipment-overview-container__general-info-table-column',
              'shipment-overview-container__general-info-table-column--end')}>
              <div className="shipment-overview-container__general-info-table-header">
                Status
              </div>
              <div className="shipment-overview-container__general-info-table-status-value">
                {data.documentation_valid != null ? (
                  <React.Fragment>
                    <i className={classNames('icon',
                      'shipment-overview-container__general-info-table-status-value-icon', {
                      'checkcircle': data.documentation_valid,
                      'attention': !data.documentation_valid,
                      'shipment-overview-container__general-info-table-status-value-icon--danger': !data.documentation_valid,
                    })}
                    />
                    {data.documentation_valid ? 'Documentation Complete' : 'Missing documents'}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    —
                  </React.Fragment>)
                }
              </div>
            </div>
          </div>

          {data.container_type != null && data.container_type === 'LCL' && data.containers != null && data.containers.length > 0 && (
            <div className="shipment-overview-container__container-info-table-wrapper">
              <table className="shipment-overview-container__container-info-table">
                <thead>
                <tr>
                  <th className={classNames('shipment-overview-container__container-info-table-value',
                    'shipment-overview-container__container-info-table-value--header',
                    'shipment-overview-container__container-info-table-value--cargo-field',
                  )}>
                    Cargo
                  </th>
                  <th className={classNames('shipment-overview-container__container-info-table-value',
                    'shipment-overview-container__container-info-table-value--header')}>
                    Dimensions
                  </th>
                  <th className={classNames('shipment-overview-container__container-info-table-value',
                    'shipment-overview-container__container-info-table-value--header')}>
                    Weight
                  </th>
                  <th className={classNames('shipment-overview-container__container-info-table-value',
                    'shipment-overview-container__container-info-table-value--header')}>
                    CBM
                  </th>
                </tr>
                </thead>
                <tbody>
                {data.containers.map(item => (
                  <tr key={item.id}>
                    <td className={classNames('shipment-overview-container__container-info-table-value',
                      'shipment-overview-container__container-info-table-value--cargo-field',
                    )}>
                      {item.quantity != null ? `${item.quantity}x` : '—'}
                    </td>
                    <td className="shipment-overview-container__container-info-table-value">
                      {item.length_mm != null ? `${item.length_mm}x` : '—x'}
                      {item.width_mm != null ? `${item.width_mm}x` : '—x'}
                      {item.height_mm != null ? `${item.height_mm}` : '—'}
                    </td>
                    <td className="shipment-overview-container__container-info-table-value">
                      {item.weight != null ? `${item.weight}KG` : '—'}
                    </td>
                    <td className="shipment-overview-container__container-info-table-value" />
                  </tr>))
                }
                </tbody>
                <tfoot>
                <tr>
                  <td className={classNames('shipment-overview-container__container-info-table-value',
                    'shipment-overview-container__container-info-table-value--footer',
                    'shipment-overview-container__container-info-table-value--cargo-field',
                  )}>
                    {
                      (() => {
                        const totalQuantity = data.containers.reduce((sum, container) => {
                          return sum + container.quantity;
                        }, 0);
                        return totalQuantity != null && !Number.isNaN(totalQuantity)
                        && totalQuantity !== 0 ? `${totalQuantity}x` : '—'
                      })()
                    }
                  </td>
                  <td className={classNames('shipment-overview-container__container-info-table-value',
                    'shipment-overview-container__container-info-table-value--footer')} />
                  <td className={classNames('shipment-overview-container__container-info-table-value',
                    'shipment-overview-container__container-info-table-value--footer')}>
                    {
                      (() => {
                        const totalWeight = data.containers.reduce((sum, container) => {
                          return sum + container.quantity * container.weight;
                        }, 0);
                        return totalWeight != null && !Number.isNaN(totalWeight)
                        && totalWeight !== 0 ? `${totalWeight}KG` : '—'
                      })()
                    }
                  </td>
                  <td className={classNames('shipment-overview-container__container-info-table-value',
                    'shipment-overview-container__container-info-table-value--footer')}>
                    {
                      (() => {
                        const totalCBM = data.containers.reduce((sum, container) => {
                          return sum + Number(container.volume_cbm);
                        }, 0);
                        return totalCBM != null && !Number.isNaN(totalCBM)
                        && totalCBM !== 0 ? totalCBM : '—'
                      })()
                    }
                  </td>
                </tr>
                </tfoot>
              </table>
            </div>)
          }

          {data.container_type != null && data.container_type === 'AIR' && data.containers != null && data.containers.length > 0 && (
            <div className="shipment-overview-container__container-info-table-wrapper">
              <table className="shipment-overview-container__container-info-table">
                <thead>
                <tr>
                  <th className={classNames('shipment-overview-container__container-info-table-value',
                    'shipment-overview-container__container-info-table-value--header',
                    'shipment-overview-container__container-info-table-value--cargo-field',
                  )}>
                    Cargo
                  </th>
                  <th className={classNames('shipment-overview-container__container-info-table-value',
                    'shipment-overview-container__container-info-table-value--header')}>
                    Dimensions
                  </th>
                  <th className={classNames('shipment-overview-container__container-info-table-value',
                    'shipment-overview-container__container-info-table-value--header')}>
                    Volume Weight
                  </th>
                  <th className={classNames('shipment-overview-container__container-info-table-value',
                    'shipment-overview-container__container-info-table-value--header')}>
                    Actual Weight
                  </th>
                  <th className={classNames('shipment-overview-container__container-info-table-value',
                    'shipment-overview-container__container-info-table-value--header')}>
                    Chargeable Weight
                  </th>
                </tr>
                </thead>
                <tbody>
                {data.containers.map(item => (
                  <tr key={item.id}>
                    <td className={classNames('shipment-overview-container__container-info-table-value',
                      'shipment-overview-container__container-info-table-value--cargo-field',
                    )}>
                      {item.quantity != null ? `${item.quantity}x` : '—'}
                    </td>
                    <td className="shipment-overview-container__container-info-table-value">
                      {item.length_mm != null ? `${item.length_mm}x` : '—x'}
                      {item.width_mm != null ? `${item.width_mm}x` : '—x'}
                      {item.height_mm != null ? `${item.height_mm}` : '—'}
                    </td>
                    <td className="shipment-overview-container__container-info-table-value">
                      {item.chargeable_weight != null ? `${item.volume_weight}KG` : '—'}
                    </td>
                    <td className="shipment-overview-container__container-info-table-value">
                      {item.weight != null ? `${item.weight}KG` : '—'}
                    </td>
                    <td className="shipment-overview-container__container-info-table-value">
                      {item.chargeable_weight != null ? `${item.chargeable_weight}KG` : '—'}
                    </td>
                  </tr>))
                }
                </tbody>
                <tfoot>
                <tr>
                  <td className={classNames('shipment-overview-container__container-info-table-value',
                    'shipment-overview-container__container-info-table-value--footer',
                    'shipment-overview-container__container-info-table-value--cargo-field',
                  )}>
                    {
                      (() => {
                        const totalQuantity = data.containers.reduce((sum, container) => {
                          return sum + container.quantity;
                        }, 0);
                        return totalQuantity != null && !Number.isNaN(totalQuantity)
                        && totalQuantity !== 0 ? `${totalQuantity}x` : '—'
                      })()
                    }
                  </td>
                  <td className={classNames('shipment-overview-container__container-info-table-value',
                    'shipment-overview-container__container-info-table-value--footer')} />
                  <td className={classNames('shipment-overview-container__container-info-table-value',
                    'shipment-overview-container__container-info-table-value--footer')}>
                    {
                      (() => {
                        const totalWeight = data.containers.reduce((sum, container) => {
                          return sum + Number(container.total_volume_weight);
                        }, 0);
                        return totalWeight != null && !Number.isNaN(totalWeight)
                        && totalWeight !== 0 ? `${totalWeight}KG` : '—'
                      })()
                    }
                  </td>
                  <td className={classNames('shipment-overview-container__container-info-table-value',
                    'shipment-overview-container__container-info-table-value--footer')}>
                    {
                      (() => {
                        const totalWeight = data.containers.reduce((sum, container) => {
                          return sum + Number(container.total_weight);
                        }, 0);
                        return totalWeight != null && !Number.isNaN(totalWeight)
                        && totalWeight !== 0 ? `${totalWeight}KG` : '—'
                      })()
                    }
                  </td>
                  <td className={classNames('shipment-overview-container__container-info-table-value',
                    'shipment-overview-container__container-info-table-value--footer')}>
                    {
                      (() => {
                        const totalWeight = data.containers.reduce((sum, container) => {
                          return sum + Number(container.total_chargeable_weight);
                        }, 0);
                        return totalWeight != null && !Number.isNaN(totalWeight)
                        && totalWeight !== 0 ? `${totalWeight}KG` : '—'
                      })()
                    }
                  </td>
                </tr>
                </tfoot>
              </table>
            </div>)
          }
        </div>
      </div>
    );
  }
}

export default ShipmentOverviewContainer