import React, { PureComponent } from 'react';
import Option from './Option';
import './styles.scss';

class SABSearchFormServices extends PureComponent<any, any> {
  public render () {
    return (
      <div className="search-form__services-incoterms">
        <div className="search-form__services">
          <Option name="pre_carriage" icon="truck" title="Pre carriage" style="first-option"
                  tooltip="Transport from start location to port of loading"
                  changeState={this.props.changeState} checked={this.props.services.pre_carriage}/>
          <Option name="origin_port_charges" icon="crane" title="Origin port"
                  tooltip="Terminal handling charges at origin port"
                  changeState={this.props.changeState} checked={this.props.services.origin_port_charges}/>
          <Option name="export_custom_formalities" icon="stamp" title="Export decl."
                  tooltip="We will handle and process your export customs declarations"
                  changeState={this.props.changeState} checked={this.props.services.export_custom_formalities}/>
          {this.props.type !== 'air' && <Option name="seafreight_requested" icon="transport" title="Ocean freight"
                  tooltip="Shipping form port to port via sea, mandatory"
                  changeState={()=>{}} checked={true}/>}
          {this.props.type === 'air' && <Option name="seafreight_requested" icon="airport" title="Air freight"
                  tooltip="Air freight between airports, mandatory"
                  changeState={()=>{}} checked={true}/>}
          <Option name="import_custom_formalities" icon="stamp" title="Import decl."
                  tooltip="We will handle and process your import customs declarations"
                  changeState={this.props.changeState} checked={this.props.services.import_custom_formalities}/>
          <Option name="destination_port_charges" icon="crane" title="Dest.port"
                  tooltip="Terminal handling charges at destination port"
                  changeState={this.props.changeState} checked={this.props.services.destination_port_charges}/>
          <Option name="on_carriage" icon="truck" title="On carriage" style="last-option"
                  tooltip="Transport from port of discharge to final destination"
                  changeState={this.props.changeState} checked={this.props.services.on_carriage}/>
          <div className="vertical-separator" />
          <Option name="insurance" icon="secure" title="Insurance" style="first-option last-option"
                  tooltip="Full insurance coverage. Will be calculated according to the goods value."
                  changeState={this.props.changeState} checked={this.props.services.insurance}
                  insurance={true} cif_value={this.props.cif_value}/>
        </div>
        {/*<hr />
        <div className="incoterms">
          Incoterm:
          <span>EXW</span>
          <span>FCA</span>
          <span>CPT</span>
          <span>CIP</span>
          <span>DAT</span>
          <span>DAP</span>
          <span>DDP</span>
          <span>FAS</span>
          <span>FOB</span>
          <span>CFR</span>
          <span>CIF</span>
          <a href="#">Info about incoterms</a>
        </div>*/}
      </div>
    );
  }
}

export default SABSearchFormServices;
