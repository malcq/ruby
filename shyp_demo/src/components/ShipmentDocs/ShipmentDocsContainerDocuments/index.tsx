import React, { PureComponent } from 'react';
import classNames from 'classnames/bind';
import moment from 'moment'
import PropTypes from "prop-types";
import Dropzone from 'react-dropzone';
import bind from "autobind-decorator";

import { ForbiddenEditHider, IconedButton } from '../../';
import { Logger } from "../../../utils/Logger";
import ShipmentDocsSelectorButton from "../ShipmentDocsSelectorButton";
import ShipmentDocsHSCodesMultiSelectorButton from "../ShipmentDocsHSCodesMultiSelectorButton";
import dragImg from '../../../assets/images/drag.svg';

import './styles.scss';
import { resourceKey } from '../../../config/permissions';
import ConfirmDialog from "../../ConfirmDialog/index";

interface IShipmentDocsContainerDocumentsProps {
  containerData: any;
  containerDocumentTypes: any;
  hsCodes: any[],
  containerDocumentSubmitData: IActionPromiseFactory;
  deleteContainerDocument: IActionPromiseFactory;
  createContainerDocument: IActionPromiseFactory;
  hsCodesGetData: IActionPromiseFactory;
  relevantHsCodesGetData: IActionPromiseFactory;
  containerHsCodesSubmitData: IActionPromiseFactory;
  clearHsCodesData: any,
  isReadOnly: boolean,
}

interface IShipmentDocsContainerDocumentsState {
  shipmentContainerEditableDocuments: any[];
  dropzoneActive: boolean;
  dialogIsOpen: boolean;
  shipmentId: number;
}

class ShipmentDocsContainerDocuments extends PureComponent<IShipmentDocsContainerDocumentsProps, IShipmentDocsContainerDocumentsState> {
  public static propTypes = {
    containerData: PropTypes.object,
    containerDocumentTypes: PropTypes.object,
    hsCodes: PropTypes.array,
    isReadOnly: PropTypes.bool,
  };

  public static defaultProps = {
    containerData: {},
    containerDocumentTypes: {},
    hsCodes: [],
  };

  private uploadButtonRef;

  constructor(props) {
    super(props);
    this.uploadButtonRef = React.createRef();
    this.state = {
      shipmentContainerEditableDocuments: [],
      dropzoneActive: false,
      dialogIsOpen: false,
      shipmentId: 0,
    }
  }

  public render() {
    const { dropzoneActive } = this.state;
    const { containerData, containerDocumentTypes, hsCodes, isReadOnly } = this.props;

    return (
      <Dropzone
        disableClick={true}
        style={{position: "relative"}}
        onDrop={this.onDrop}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
      >
        {dropzoneActive && (
          <div className="shipment-docs-container-documents__overlay">
            <img className="shipment-docs-container-documents__overlay-drag-img" src={dragImg} alt="" />
            <span className="shipment-docs-container-documents__overlay-text">
              Drag and Drop Files here
            </span>
          </div>)
        }
        <div
          key={containerData.id}
          className="shipment-docs-container-documents"
        >
          <div className="shipment-docs-container-documents__header">
            {`Documents container #${containerData.id}`}
          </div>

          <div className="shipment-docs-container-documents__general-info-table">
            <div className="shipment-docs-container-documents__general-info-table-column">
              <div className="shipment-docs-container-documents__general-info-table-column-title">
                Container Number
              </div>
              <div className="shipment-docs-container-documents__general-info-table-column-value">
                {containerData.container_number || '—'}
              </div>
            </div>
            <div className="shipment-docs-container-documents__general-info-table-column">
              <div className="shipment-docs-container-documents__general-info-table-column-title">
                BL Number
              </div>
              <div className="shipment-docs-container-documents__general-info-table-column-value">
                {containerData.bl_number || '—'}
              </div>
            </div>
            <div className="shipment-docs-container-documents__general-info-table-column">
              <div className="shipment-docs-container-documents__general-info-table-column-title">
                Piece Count
              </div>
              <div className="shipment-docs-container-documents__general-info-table-column-value">
                {containerData.piece_count || '—'}
              </div>
            </div>
            <div className="shipment-docs-container-documents__general-info-table-column">
              <div className="shipment-docs-container-documents__general-info-table-column-title">
                Cargo Weight
              </div>
              <div className="shipment-docs-container-documents__general-info-table-column-value">
                {containerData.cargo_weight ? `${containerData.cargo_weight} Kilogram` : '—'}
              </div>
            </div>
          </div>

          <div className="shipment-docs-container-documents__general-info-table">
            <div className="shipment-docs-container-documents__general-info-table-column">
              <div className="shipment-docs-container-documents__general-info-table-column-title">
                Container Description
              </div>
              <div className="shipment-docs-container-documents__general-info-table-column-value">
                {containerData.goods_description || '-'}
              </div>
            </div>
            <div className="shipment-docs-container-documents__general-info-table-column">
              <div className="shipment-docs-container-documents__general-info-table-column-title">
                Seal number
              </div>
              <div className="shipment-docs-container-documents__general-info-table-column-value">
                {containerData.seal_number || '—'}
              </div>
            </div>
          </div>
          <div className="shipment-docs-container-documents__general-info-table">
            <div className="shipment-docs-container-documents__general-info-table-column">
              <div className="shipment-docs-container-documents__general-info-table-column-title">
                HS Code(s)
              </div>
              <div className="shipment-docs-container-documents__general-info-table-column-value">
                <ShipmentDocsHSCodesMultiSelectorButton
                  disabled={isReadOnly}
                  containerId={containerData.id}
                  hsCodesValues={containerData.hs_codes}
                  hsCodes={hsCodes}
                  title="HS Codes"
                  hsCodesGetData={this.props.hsCodesGetData}
                  relevantHsCodesGetData={this.props.relevantHsCodesGetData}
                  containerHsCodesSubmitData={this.props.containerHsCodesSubmitData}
                  clearHsCodesData={this.props.clearHsCodesData}
                />
              </div>
            </div>
          </div>
          <div className="shipment-docs-container-documents__header">
            Documents
          </div>
          {containerData.container_documents != null && containerData.container_documents.length > 0 && (
            <div className="shipment-docs-container-documents__documents-list">
              <div className="shipment-docs-container-documents__documents-list-header-column">
                <div className={classNames('shipment-docs-container-documents__documents-list-value-header',
                  'shipment-docs-container-documents__documents-list-value-header--doc-type')}>
                  Document Type
                </div>
                <div className="shipment-docs-container-documents__documents-list-value-header">
                  Document Id
                </div>
                <div className={classNames('shipment-docs-container-documents__documents-list-value-header',
                  'shipment-docs-container-documents__documents-list-value-header--upload-date')}>
                  Upload Date
                </div>
                <div className="shipment-docs-container-documents__documents-list-value-control-buttons" />
              </div>
              <ul className="shipment-docs-container-documents__documents-list-container">
                {containerData.container_documents != null
                && containerData.container_documents.map(containerDocument => (
                  <li
                    key={containerDocument.id}
                    className="shipment-docs-container-documents__documents-list-column"
                  >
                    <div className="shipment-docs-container-documents__documents-list-value-doc-type">
                      {this.getEditableDocumentById(containerDocument.id) != null
                        ? (
                          <ShipmentDocsSelectorButton
                            className="shipment-docs-container-documents__selector-button mui-override"
                            title="Please select a document type"
                            options={
                              Object.keys(containerDocumentTypes).map(id => ({
                                id, title: containerDocumentTypes[id]
                              }))
                            }
                            fallbackValue={containerDocument.document_type || ''}
                            value={
                              this.getEditableDocumentTypeById(containerDocument.id) == null
                                ? containerDocument.document_type || ''
                                : this.getEditableDocumentTypeById(containerDocument.id)
                            }
                            onClickOption={this.onClickOptionDocumentType.bind(this, containerDocument.id)}
                          />
                        )
                        : (
                          containerDocument.document_type != null && containerDocument.document_type !== ''
                            ? containerDocumentTypes[containerDocument.document_type]
                            : 'Please select a document type'
                        )
                      }
                    </div>
                    <a
                      className="shipment-docs-container-documents__documents-list-value-doc-id"
                      href={containerDocument.url}
                      target="_blank"
                    >
                      {containerDocument.original_filename}
                    </a>
                    <div className="shipment-docs-container-documents__documents-list-value-upload-date">
                      {moment(containerDocument.created_at).format('DD MMM HH:mm')}
                    </div>
                    <div className="shipment-docs-container-documents__documents-list-value-control-buttons">
                      <ForbiddenEditHider resource={resourceKey.shipmentDocuments}>
                        {this.getEditableDocumentById(containerDocument.id) != null ? [
                          <i
                            key="confirm"
                            className="shipment-docs-container-documents__documents-list-icon icon check"
                            onClick={this.onClickSaveDocument.bind(this, containerDocument.id)}
                          />,
                          <i
                            key="cancel"
                            className="shipment-docs-container-documents__documents-list-icon icon close"
                            onClick={this.onClickCancelEditDocument.bind(this, containerDocument.id)}
                          />
                        ] : [
                          <i
                            key="edit"
                            className="shipment-docs-container-documents__documents-list-icon icon pencil"
                            onClick={this.onClickEditDocument.bind(this, containerDocument)}
                          />,
                          <i
                            key="delete"
                            className="shipment-docs-container-documents__documents-list-icon icon trash"
                            onClick={()=>this.setState({dialogIsOpen: true, shipmentId: containerDocument.id})}
                          />
                        ]}
                      </ForbiddenEditHider>
                    </div>
                  </li>))
                }
              </ul>
            </div>)
          }
          <ForbiddenEditHider resource={resourceKey.shipmentDocuments} >
            <div className="shipment-docs-container-documents__upload-files">
              <span className="shipment-docs-container-documents__upload-files-text">
                Drag and Drop Files here or
              </span>
              <IconedButton
                className="shipment-docs-container-documents__upload-files-button mui-override"
                icon="download"
                iconPosition="left"
                title="Upload files"
                onClick={this.onClickUploadFile}
              />
              <input
                ref={this.uploadButtonRef}
                type="file"
                id="selectedFile"
                style={{display: 'none'}}
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
    )
  }

  private getEditableDocumentById(id){
    return (this.state.shipmentContainerEditableDocuments || []).find(item => item.id === id);
  }

  private getEditableDocumentTypeById(id){
    const containerEditableDocument = this.getEditableDocumentById(id);
    let documentType;

    if (containerEditableDocument != null && containerEditableDocument.document_type != null) {
      documentType = containerEditableDocument.document_type;
    }

    return documentType;
  }

  private onClickEditDocument(containerDocument): void{
    const shipmentContainerEditableDocuments = [...this.state.shipmentContainerEditableDocuments];

    shipmentContainerEditableDocuments.push({
      id: containerDocument.id,
      document_type: containerDocument.document_type,
    });
    this.setState({ shipmentContainerEditableDocuments });
  }

  private onClickCancelEditDocument(containerDocumentId): void{
    const shipmentContainerEditableDocuments = this.state.shipmentContainerEditableDocuments
      .filter(item => item.id !== containerDocumentId);
    this.setState({ shipmentContainerEditableDocuments });
  }

  private onClickOptionDocumentType(containerDocumentId, value): void{
    const shipmentContainerEditableDocuments = [...this.state.shipmentContainerEditableDocuments];

    shipmentContainerEditableDocuments.forEach((item, index) => {
      if (item.id === containerDocumentId) {
        shipmentContainerEditableDocuments[index].document_type = value;
      }
    });
    this.setState({ shipmentContainerEditableDocuments });
  }

  private async onClickSaveDocument(containerDocumentId): Promise<any>{
    const { containerData } = this.props;
    const containerDocument = this.getEditableDocumentById(containerDocumentId);
    const dataToSend = {
      document_type: containerDocument.document_type,
    };

    try {
      await this.props.containerDocumentSubmitData(containerData.id, containerDocumentId, dataToSend);

      this.onClickCancelEditDocument(containerDocumentId);
    } catch(error) {
      Logger.log(error);
    }
  }

  @bind
  private async onClickDeleteDocument(): Promise<any>{
    const { containerData } = this.props;
    try {
      await this.props.deleteContainerDocument(containerData.id, this.state.shipmentId)
    } catch(error) {
      Logger.log(error);
    }
    this.setState({dialogIsOpen: false})
  }

  @bind
  private closeDialog():void {
    this.setState({ dialogIsOpen: false })
  }
  @bind
  private onClickUploadFile():void {
    this.uploadButtonRef.current.click();
  }

  @bind
  private onChangeUploadFile(event: any):void {
    const { containerData } = this.props;

    if (event.target.files != null && event.target.files.length > 0) {
      const file = event.target.files[0];

      this.uploadButtonRef.current.value = null;
      if (file != null) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          await this.props.createContainerDocument(containerData.id, { file });
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
      const { containerData } = this.props;

      if (files != null && files.length > 0) {
        const file = files[0];

        if (file != null) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async () => {
            await this.props.createContainerDocument(containerData.id, { file })
          };
        }
      }
    }

    this.setState({
      dropzoneActive: false,
    });
  }
}

export default ShipmentDocsContainerDocuments
