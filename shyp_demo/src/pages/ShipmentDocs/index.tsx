import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dispatch } from "redux";
import { connect } from "react-redux";
import classNames from 'classnames/bind';
import { CircularProgress } from "@material-ui/core";
import promisifyAction from "../../utils/promisifyAction";
import { Logger } from "../../utils/Logger";
import {
  shipmentDocumentsGetData,
  shipmentDocumentTypesGetData,
  containerDocumentTypesGetData,
  shipmentDocumentSubmitData,
  deleteShipmentDocument,
  createShipmentDocument,
  moveShipmentDocument,
  containerDocumentSubmitData,
  deleteContainerDocument,
  createContainerDocument,
  hsCodesGetData,
  relevantHsCodesGetData,
  containerHsCodesSubmitData,
  clearHsCodesData,
} from "../../stores/actionCreators";
import ShipmentDocsShipmentDocuments from "../../components/ShipmentDocs/ShipmentDocsShipmentDocuments";
import ShipmentDocsContainerDocuments from "../../components/ShipmentDocs/ShipmentDocsContainerDocuments";

import './styles.scss'
import { isEditingAllowed, resourceKey } from '../../config/permissions';

interface IShipmentsDocsProps {
  match: IMatch | null;
  shipmentDocumentsGetData: IActionPromiseFactory;
  shipmentDocumentTypesGetData: IActionPromiseFactory;
  containerDocumentTypesGetData: IActionPromiseFactory;
  shipmentDocumentSubmitData: IActionPromiseFactory;
  deleteShipmentDocument: IActionPromiseFactory;
  createShipmentDocument: IActionPromiseFactory;
  moveShipmentDocument: IActionPromiseFactory;
  containerDocumentSubmitData: IActionPromiseFactory;
  deleteContainerDocument: IActionPromiseFactory;
  createContainerDocument: IActionPromiseFactory;
  hsCodesGetData: IActionPromiseFactory;
  relevantHsCodesGetData: IActionPromiseFactory;
  containerHsCodesSubmitData: IActionPromiseFactory;
  clearHsCodesData: any,
  shipmentDocumentsData: any;
  shipmentDocumentTypes: any;
  containerDocumentTypes: any;
  hsCodes: any[];
  permission: string;
}

interface IShipmentsDocsState {
  loading: boolean;
  isReadOnly: boolean;
}

const mapDispatchToProps = ( dispatch: Dispatch ) => ({
  shipmentDocumentsGetData: promisifyAction(dispatch, shipmentDocumentsGetData),
  shipmentDocumentTypesGetData: promisifyAction(dispatch, shipmentDocumentTypesGetData),
  containerDocumentTypesGetData: promisifyAction(dispatch, containerDocumentTypesGetData),
  shipmentDocumentSubmitData: promisifyAction(dispatch, shipmentDocumentSubmitData),
  deleteShipmentDocument: promisifyAction(dispatch, deleteShipmentDocument),
  createShipmentDocument: promisifyAction(dispatch, createShipmentDocument),
  moveShipmentDocument: promisifyAction(dispatch, moveShipmentDocument),
  containerDocumentSubmitData: promisifyAction(dispatch, containerDocumentSubmitData),
  deleteContainerDocument: promisifyAction(dispatch, deleteContainerDocument),
  createContainerDocument: promisifyAction(dispatch, createContainerDocument),
  hsCodesGetData: promisifyAction(dispatch, hsCodesGetData),
  relevantHsCodesGetData: promisifyAction(dispatch, relevantHsCodesGetData),
  containerHsCodesSubmitData: promisifyAction(dispatch, containerHsCodesSubmitData),
  clearHsCodesData: promisifyAction(dispatch, clearHsCodesData),
});

const mapStateToProps = (state: IGlobalState): any => ({
  shipmentDocumentsData: state.shipmentDocs.shipmentDocumentsData,
  shipmentDocumentTypes: state.shipmentDocs.shipmentDocumentTypes,
  containerDocumentTypes: state.shipmentDocs.containerDocumentTypes,
  hsCodes: state.shipmentDocs.hsCodes,
  permission: state.user.permission,
});

class ShipmentsDocs extends PureComponent<IShipmentsDocsProps, IShipmentsDocsState> {
  public static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
      url: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
    shipmentDocumentsData: PropTypes.object,
    shipmentDocumentTypes: PropTypes.object,
    containerDocumentTypes: PropTypes.object,
    hsCodes: PropTypes.array,
    permission: PropTypes.string,
  };
  public static defaultProps = {
    shipmentDocumentsData: {},
    shipmentDocumentTypes: {},
    containerDocumentTypes: {},
    hsCodes: [],
  };

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      isReadOnly: false,
    }
  }

  public async componentDidMount(): Promise<any>{
    const match = this.props.match || { params: { id: 0 }};

    this.setState({ loading: true });
    try {
      await this.props.shipmentDocumentTypesGetData();
      await this.props.containerDocumentTypesGetData();
      await this.props.shipmentDocumentsGetData(match.params.id);
    } catch(error) {
      Logger.log(error)
    } finally {
      this.setState({ loading: false });
    }

    this.setState({
      isReadOnly: !isEditingAllowed(resourceKey.shipmentDocuments, this.props.permission),
    });
  }

  public render () {
    const { loading } = this.state;
    const {
      shipmentDocumentsData,
      shipmentDocumentTypes,
      containerDocumentTypes,
      hsCodes,
    } = this.props;

    return (
      <article className="shipment-docs-page">
        {loading ? (
          <div style={{textAlign: 'center'}}>
            <CircularProgress size={50} style={{marginTop: '50px'}}/>
          </div>
        ) : (
          <React.Fragment>
            <div className={classNames('shipment-docs-page__information-status', {
              'shipment-docs-page__information-status--complete': shipmentDocumentsData.documentation_valid,
              'shipment-docs-page__information-status--incomplete': !shipmentDocumentsData.documentation_valid,
            })}>
              <i
                className={classNames('shipment-docs-page__information-status-icon', 'icon', {
                'checked': shipmentDocumentsData.documentation_valid,
                'attention': !shipmentDocumentsData.documentation_valid,
              })}
              />
              <span className="shipment-docs-page__information-status-text">
                {shipmentDocumentsData.documentation_valid ? 'Information complete' : 'Information incomplete'}
              </span>
            </div>
            <ShipmentDocsShipmentDocuments
              shipmentDocumentsData={shipmentDocumentsData}
              shipmentDocumentTypes={shipmentDocumentTypes}
              shipmentDocumentSubmitData={this.props.shipmentDocumentSubmitData}
              deleteShipmentDocument={this.props.deleteShipmentDocument}
              createShipmentDocument={this.props.createShipmentDocument}
              moveShipmentDocument={this.props.moveShipmentDocument}
              isReadOnly={this.state.isReadOnly}
            />
            {shipmentDocumentsData.containers != null && shipmentDocumentsData.containers.map(container => (
              <ShipmentDocsContainerDocuments
                key={container.id}
                containerData={container}
                containerDocumentTypes={containerDocumentTypes}
                hsCodes={hsCodes}
                containerDocumentSubmitData={this.props.containerDocumentSubmitData}
                deleteContainerDocument={this.props.deleteContainerDocument}
                createContainerDocument={this.props.createContainerDocument}
                hsCodesGetData={this.props.hsCodesGetData}
                relevantHsCodesGetData={this.props.relevantHsCodesGetData}
                containerHsCodesSubmitData={this.props.containerHsCodesSubmitData}
                clearHsCodesData={this.props.clearHsCodesData}
                isReadOnly={this.state.isReadOnly}
              />
            ))}
          </React.Fragment>)
        }
      </article>
    );
  }

  public componentDidUpdate(prevProps: IShipmentsDocsProps) {
    if (prevProps.permission !== this.props.permission) {
      this.setState({
        isReadOnly: !isEditingAllowed(resourceKey.shipmentDocuments, this.props.permission)
      });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShipmentsDocs);
