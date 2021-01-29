import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import bind from 'autobind-decorator';
import { connect } from 'react-redux';
import { find } from 'lodash';

import './styles.scss';

const PLACEHOLDER = '-';

interface IContactOriginalProps{
  contact: IContact;
  toEditing: (id: number) => void;
}

const mapStateToProps = (state: IGlobalState, props: IContactOriginalProps) => ({
  companyName: (find(state.companies.list, { id: props.contact.company_id }) || {}).name
});

interface IContactProps extends IContactOriginalProps{
  companyName: string | null
}

class Contact extends PureComponent<IContactProps> {
  public static propTypes = {
    contact: PropTypes.shape({
      id: PropTypes.number.isRequired,
      company_id: PropTypes.number,
      contact_type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      postal_code: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      vat_number: PropTypes.string.isRequired,
      eori_number: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
    }).isRequired,
    companyName: PropTypes.string,
    toEditing: PropTypes.func.isRequired,
  };
  public static defaultProps = {
    toEditing(id: number){ return undefined; },
    companyName: 'Not linked'
  };

  public render () {
    const { contact } = this.props;
    const isPerson = contact.contact_type === 'person';
    return (
      <section className="contact" onClick={this.handleClick}>
        <i className={`contact__icon icon ${contact.contact_type}`} />
        <div className='contact__field contact__field_name'>
          <header className='contact__label'> Name </header>
          {contact.name || PLACEHOLDER}
        </div>
        <div className='contact__field contact__field_address'>
          <header className='contact__label'> { isPerson ? 'Company' : 'Address'} </header>
          {(isPerson)
            ? this.props.companyName || PLACEHOLDER
            : contact.address || PLACEHOLDER
          }
        </div>
        <div className='contact__field contact__field_city'>
          <header className='contact__label'> City </header>
          {contact.city || PLACEHOLDER}
        </div>
        <div className='contact__field contact__field_email'>
          <header className='contact__label'> Email </header>
          {contact.email || PLACEHOLDER}
        </div>
        <div className='contact__field contact__field_phone'>
          <header className='contact__label'> Phone </header>
          {contact.phone || PLACEHOLDER}
        </div>
      </section>
    );
  }

  @bind
  private handleClick(event: any):void {
    this.props.toEditing(this.props.contact.id)
  }
}

export default connect(mapStateToProps)(Contact);
