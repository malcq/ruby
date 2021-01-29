import React, { PureComponent } from 'react';
import classNames from 'classnames/bind';
import moment from 'moment'
import PropTypes from "prop-types";
import Dropzone from 'react-dropzone';
import bind from "autobind-decorator";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";

import { ForbiddenEditHider } from '../../';
import { Logger } from "../../../utils/Logger";
import ShipmentDocsSelectorButton from "../ShipmentDocsSelectorButton";
import IconedButton from "../../IconedButton";
import dragImg from '../../../assets/images/drag.svg';

import './styles.scss';
import { resourceKey } from '../../../config/permissions';
import ConfirmDialog from "../../ConfirmDialog/index";

interface IShipmentDocsShipmentDocumentsProps {
  shipmentDocumentsData: any;
  shipmentDocumentTypes: any;
  shipmentDocumentSubmitData: IActionPromiseFactory;
  deleteShipmentDocument: IActionPromiseFactory;
  createShipmentDocument: IActionPromiseFactory;
  moveShipmentDocument: IActionPromiseFactory;
  isReadOnly: boolean;
}

interface IShipmentDocsShipmentDocumentsState {
  shipmentEditableDocuments: any[];
  dropzoneActive: boolean;
  dialogIsOpen: boolean;
  shipmentId: number;
}

class ShipmentDocsShipmentDocuments extends PureComponent<IShipmentDocsShipmentDocumentsProps, IShipmentDocsShipmentDocumentsState> {
  public static propTypes = {
    shipmentDocumentsData: PropTypes.object,
    shipmentDocumentTypes: PropTypes.object,
    isReadOnly: PropTypes.bool,
  };

  public static defaultProps = {
    shipmentDocumentsData: {},
    shipmentDocumentTypes: {},
  };

  private uploadButtonRef;

  constructor(props){
    super(props);
    this.uploadButtonRef = React.createRef();
    this.state = {
      shipmentEditableDocuments: [],
      dropzoneActive: false,
      dialogIsOpen: false,
      shipmentId: 0,
    }
  }

  public render() {
    const { dropzoneActive } = this.state;
    const { shipmentDocumentsData, shipmentDocumentTypes } = this.props;

    return (
      <Dropzone
        disableClick={true}
        style={{position: "relative"}}
        onDrop={this.onDrop}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
      >
        {dropzoneActive && (
          <div className="shipment-docs-shipment-documents__overlay">
            <img className="shipment-docs-shipment-documents__overlay-drag-img" src={dragImg} alt="" />
            <span className="shipment-docs-shipment-documents__overlay-text">
              Drag and Drop Files here
            </span>
          </div>)
        }
        <div className="shipment-docs-shipment-documents">
          <div className="shipment-docs-shipment-documents__header">
            Shipment documents
          </div>

          <div className="shipment-docs-shipment-documents__general-info-table">
            <div className="shipment-docs-shipment-documents__general-info-table-column">
              <div className="shipment-docs-shipment-documents__general-info-table-column-title">
                BL Number
              </div>
              <div className="shipment-docs-shipment-documents__general-info-table-column-value">
                {shipmentDocumentsData.bl_number != null && shipmentDocumentsData.bl_number !== ''
                  ? shipmentDocumentsData.bl_number : '—'}
              </div>
            </div>
            <div className="shipment-docs-shipment-documents__general-info-table-column">
              <div className="shipment-docs-shipment-documents__general-info-table-column-title">
                Booking Number
              </div>
              <div className="shipment-docs-shipment-documents__general-info-table-column-value">
                {shipmentDocumentsData.booking_number != null && shipmentDocumentsData.booking_number !== ''
                  ? shipmentDocumentsData.booking_number : '—'}
              </div>
            </div>
            <div className="shipment-docs-shipment-documents__general-info-table-column">
              <div className="shipment-docs-shipment-documents__general-info-table-column-title">
                Vessel
              </div>
              <div className="shipment-docs-shipment-documents__general-info-table-column-value">
                {shipmentDocumentsData.vessel != null && shipmentDocumentsData.vessel !== '' ?
                  shipmentDocumentsData.vessel : '—'}
              </div>
            </div>
          </div>

          <div className="shipment-docs-shipment-documents__header">
            Documents
          </div>
          {shipmentDocumentsData.shipment_documents != null && shipmentDocumentsData.shipment_documents.length > 0 && (
            <div className="shipment-docs-shipment-documents__documents-list">
              <div className="shipment-docs-shipment-documents__documents-list-header-column">
                <div className="shipment-docs-shipment-documents__documents-list-value-header">
                  Document Type
                </div>
                <div className="shipment-docs-shipment-documents__documents-list-value-header">
                  Document Id
                </div>
                <div className={classNames('shipment-docs-shipment-documents__documents-list-value-header',
                  'shipment-docs-shipment-documents__documents-list-value-header--upload-date')}>
                  Upload Date
                </div>
                <div className="shipment-docs-shipment-documents__documents-list-value-header">
                  Description
                </div>
                <div className="shipment-docs-shipment-documents__documents-list-value-header">
                  Move to container
                </div>
                <div className="shipment-docs-shipment-documents__documents-list-value-control-buttons" />
              </div>
              <ul className="shipment-docs-shipment-documents__documents-list-container">
              {shipmentDocumentsData.shipment_documents.map(shipmentDocument => (
                <li
                  key={shipmentDocument.id}
                  className="shipment-docs-shipment-documents__documents-list-column"
                >
                  <div className="shipment-docs-shipment-documents__documents-list-value-doc-type">
                    {this.getEditableDocumentById(shipmentDocument.id) != null ? (
                      <ShipmentDocsSelectorButton
                        className="shipment-docs-shipment-documents__selector-button mui-override"
                        title="Please select a document type"
                        options={Object.keys(shipmentDocumentTypes).map(id => ({
                          id, title: shipmentDocumentTypes[id]
                        }))}
                        fallbackValue={shipmentDocument.document_type || ''}
                        value={
                          this.getEditableDocumentTypeById(shipmentDocument.id) == null
                            ? shipmentDocument.document_type || ''
                            : this.getEditableDocumentTypeById(shipmentDocument.id)
                        }
                        onClickOption={this.onClickOptionDocumentType.bind(this, shipmentDocument.id)}
                      />
                    ) : (
                      shipmentDocument.document_type != null && shipmentDocument.document_type !== ''
                        ? shipmentDocumentTypes[shipmentDocument.document_type]
                        : 'Please select a document type'
                    )}
                  </div>
                  <a
                    className="shipment-docs-shipment-documents__documents-list-value-doc-id"
                    href={shipmentDocument.url}
                    target="_blank"
                  >
                    {shipmentDocument.original_filename}
                  </a>
                  <div className="shipment-docs-shipment-documents__documents-list-value-upload-date">
                    {moment(shipmentDocument.created_at).format('DD MMM HH:mm')}
                  </div>
                  <div className="shipment-docs-shipment-documents__documents-list-value-description">
                    {shipmentDocument.description != null && shipmentDocument.description !== '' && (
                      <Tooltip
                        classes={{
                          tooltip: 'shipment-docs-shipment-documents__value-tooltip mui-override'
                        }}
                        title={shipmentDocument.description}
                      >
                        <div className="shipment-docs-shipment-documents__documents-list-value-description-tooltip-area">
                          See description
                        </div>
                      </Tooltip>)
                    }
                  </div>
                  <div className="shipment-docs-shipment-documents__documents-list-value-move-to-container">
                    {this.getEditableDocumentById(shipmentDocument.id) != null ? (
                      <ShipmentDocsSelectorButton
                        className="shipment-docs-shipment-documents__selector-button mui-override"
                        title="Select"
                        options={shipmentDocumentsData.containers != null
                          ? shipmentDocumentsData.containers.map(item => ({
                            id: item.id, title: item.container_number
                          }))
                          : []
                        }
                        value={this.getMovingDocumentById(shipmentDocument.id) || ''}
                        onClickOption={this.onClickOptionMoveToContainer.bind(this, shipmentDocument.id)}
                      />
                    ) : (
                      <ForbiddenEditHider
                        resource={resourceKey.shipmentDocuments}
                        placeholder="-"
                      >
                        Select
                      </ForbiddenEditHider>
                    )}
                  </div>
                  <div className="shipment-docs-shipment-documents__documents-list-value-control-buttons">
                    <ForbiddenEditHider resource={resourceKey.shipmentDocuments}>
                      {this.getEditableDocumentById(shipmentDocument.id) != null ? [
                        <i
                          key="confirm"
                          className="shipment-docs-shipment-documents__documents-list-icon icon check"
                          onClick={this.onClickSaveDocument.bind(this, shipmentDocument.id)}
                        />,
                        <i
                          key="cancel"
                          className="shipment-docs-shipment-documents__documents-list-icon icon close"
                          onClick={this.onClickCancelEditDocument.bind(this, shipmentDocument.id)}
                        />
                      ] : [
                        <i
                          key="edit"
                          className="shipment-docs-shipment-documents__documents-list-icon icon pencil"
                          onClick={this.onClickEditDocument.bind(this, shipmentDocument)}
                        />,
                        <i
                          key="delete"
                          className="shipment-docs-shipment-documents__documents-list-icon icon trash"
                          onClick={()=>this.setState({dialogIsOpen: true, shipmentId: shipmentDocument.id})}
                        />
                      ]}
                    </ForbiddenEditHider>
                  </div>
                </li>))
              }
              </ul>
            </div>)
          }
          <ForbiddenEditHider resource={resourceKey.shipmentDocuments}>
            <div className="shipment-docs-shipment-documents__upload-files">
              <span className="shipment-docs-shipment-documents__upload-files-text">
                Drag and Drop Files here or
              </span>
              <IconedButton
                className="shipment-docs-shipment-documents__upload-files-button mui-override"
                icon="download"
                iconPosition="left"
                title="Upload files"
                onClick={this.onClickUploadFile}
              />
              <input
                ref={this.uploadButtonRef}
                type="file"
                id="selectedFile"
                style={{
                  display: 'none'
                }}
                onChange={this.onChangeUploadFile}
              />
            </div>
          </ForbiddenEditHider>

          <ConfirmDialog
            title="Delete document"
            message={`Do you really want to delete this document?`}
            isOpen={this.state.dialogIsOpen}
            confirm={this.onClickDeleteDocument}
            reject={this.closeDialog}
            onClose={this.closeDialog}
          />
        </div>
      </Dropzone>
    );
  }
  @bind
  private closeDialog():void {
    this.setState({ dialogIsOpen: false })
  }

  private getEditableDocumentById(id){
    return (this.state.shipmentEditableDocuments || []).find(item => item.id === id);
  }

  private getEditableDocumentTypeById(id){
    const shipmentEditableDocument = this.getEditableDocumentById(id);
    let documentType;

    if (shipmentEditableDocument != null && shipmentEditableDocument.document_type != null) {
      documentType = shipmentEditableDocument.document_type;
    }

    return documentType;
  }

  private getMovingDocumentById(id){
    const shipmentEditableDocument = this.getEditableDocumentById(id);
    let moveToContainerId;

    if (shipmentEditableDocument != null && shipmentEditableDocument.move_to_container_id != null) {
      moveToContainerId = shipmentEditableDocument.move_to_container_id;
    }

    return moveToContainerId;
  }

  private onClickEditDocument(shipmentDocument): void{
    const shipmentEditableDocuments = [...this.state.shipmentEditableDocuments];

    shipmentEditableDocuments.push({
      id: shipmentDocument.id,
      document_type: shipmentDocument.document_type,
    });
    this.setState({ shipmentEditableDocuments });
  }

  private onClickCancelEditDocument(shipmentDocumentId): void{
    const shipmentEditableDocuments = this.state.shipmentEditableDocuments
      .filter(item => item.id !== shipmentDocumentId);
    this.setState({ shipmentEditableDocuments });
  }

  private onClickOptionDocumentType(shipmentDocumentId, value): void{
    const shipmentEditableDocuments = [...this.state.shipmentEditableDocuments];

    shipmentEditableDocuments.forEach((item, index) => {
      if (item.id === shipmentDocumentId) {
        shipmentEditableDocuments[index].document_type = value;
      }
    });
    this.setState({ shipmentEditableDocuments });
  }

  private async onClickOptionMoveToContainer(shipmentDocumentId, value): Promise<any>{
    const { shipmentDocumentsData } = this.props;
    const shipmentId = shipmentDocumentsData.id;
    const shipmentEditableDocuments = [...this.state.shipmentEditableDocuments];

    shipmentEditableDocuments.forEach((item, index) => {
      if (item.id === shipmentDocumentId) {
        shipmentEditableDocuments[index].move_to_container_id = value;
      }
    });
    this.setState({ shipmentEditableDocuments });
  }

  private async onClickSaveDocument(shipmentDocumentId): Promise<any>{
    const { shipmentDocumentsData } = this.props;
    const shipmentEditableDocuments = [...this.state.shipmentEditableDocuments];
    const shipmentId = shipmentDocumentsData.id;
    const shipmentDocument = this.getEditableDocumentById(shipmentDocumentId);
    const dataToSend = {
      document_type: shipmentDocument.document_type,
    };
    const moveItem = shipmentEditableDocuments.find((item) => {
      return item.id === shipmentDocumentId
    });

    if (moveItem && moveItem.move_to_container_id) {
      try {
        await this.props.moveShipmentDocument(shipmentId, shipmentDocumentId, {container_id: moveItem.move_to_container_id});
        this.onClickCancelEditDocument(shipmentDocumentId);
      } catch (error) {
        const shipmentEditableDocuments = this.state.shipmentEditableDocuments.map(
          item => item.id === shipmentDocumentId
            ? { ...item, move_to_container_id: null }
            : item
        )
        this.setState({ shipmentEditableDocuments });
        Logger.error(error);
      }
    }

    try {
      await this.props.shipmentDocumentSubmitData(shipmentId, shipmentDocumentId, dataToSend);
      this.onClickCancelEditDocument(shipmentDocumentId);
    } catch(error) {
      Logger.error(error);
    }
  }
  @bind
  private async onClickDeleteDocument(): Promise<any>{
    const { shipmentDocumentsData } = this.props;
    const shipmentId = shipmentDocumentsData.id;
    try {
      await this.props.deleteShipmentDocument(shipmentId, this.state.shipmentId);
    } catch(error) {
      Logger.log(error);
    }
    this.setState({dialogIsOpen: false})
  }

  @bind
  private onClickUploadFile():void {
    this.uploadButtonRef.current.click();
  }

  @bind
  private onChangeUploadFile(event: any):void {
    const { shipmentDocumentsData } = this.props;
    const shipmentId = shipmentDocumentsData.id;

    if (event.target.files != null && event.target.files.length > 0) {
      const file = event.target.files[0];

      this.uploadButtonRef.current.value = null;
      if (file != null) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          await this.props.createShipmentDocument(shipmentId, { file });
        };
      }
    }
  }

  @bind
  private onDragEnter() {
    if (!this.props.isReadOnly) {
      this.setState({
        dropzoneActive: true,
      });
    }
  }

  @bind
  private onDragLeave() {
    this.setState({
      dropzoneActive: false,
    });
  }

  @bind
  private onDrop(files) {
    if (!this.props.isReadOnly) {
      const { shipmentDocumentsData } = this.props;
      const shipmentId = shipmentDocumentsData.id;

      if (files != null && files.length > 0) {
        const file = files[0];

        if (file != null) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async () => {
            await this.props.createShipmentDocument(shipmentId, { file });
          };
        }
      }
    }
    this.setState({
      dropzoneActive: false,
    });
  }
}

export default ShipmentDocsShipmentDocuments
