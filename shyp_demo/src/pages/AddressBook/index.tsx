import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Location, LocationDescriptor } from 'history';
import { Dispatch } from 'redux';
import { push } from 'react-router-redux';
import { Paper } from '@material-ui/core';
import { parse, stringify } from 'query-string';
import { get } from 'lodash';
import bind from 'autobind-decorator';

import { Button, IconedButton, Contact, ForbiddenLinkHider } from '../../components';
import { promisifyAction } from '../../utils';
import { contactsGetData, companiesGetData } from '../../stores/actionCreators';
import { isRouteAllowed } from '../../config/permissions';
import './styles.scss';

interface IProps{
  location: Location;
  toLocation: (l: LocationDescriptor) => void;
  contacts: IContact[];
  getData: IActionPromiseFactory;
  getCompanies: IActionPromiseFactory;
  premission: string;
}

const mapStateToProps = (state: IGlobalState): any => ({
  location: get(state.routing, 'location' , {}),
  contacts: state.contacts.list,
  premission: state.user.permission,
});

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  toLocation: (location: LocationDescriptor) => { dispatch(push(location)); },
  getData: promisifyAction(dispatch, contactsGetData),
  getCompanies: promisifyAction(dispatch, companiesGetData),
});

class AddressBook extends PureComponent<IProps, any> {
  private searchAll: IEventHandler;
  private searchPerson: IEventHandler;
  private searchCompany: IEventHandler;
  private toNewCompanyContact: IEventHandler;
  private toNewPersonContact: IEventHandler;

  constructor(props, context) {
    super(props, context);
    this.searchAll = this.makeSearchHandler();
    this.searchPerson = this.makeSearchHandler({ type: 'person' });
    this.searchCompany = this.makeSearchHandler({ type: 'company' });
    this.toNewCompanyContact = this.makeNavigationHandler('/contacts/new');
    this.toNewPersonContact = this.makeNavigationHandler({
      pathname: '/contacts/new',
      search: '?type=person',
    })
  }

  public async componentDidMount(): Promise<any>{
    const params = parse(location.search);
    await this.props.getCompanies();
    await this.props.getData(params);
  }

  public render() {
    const params = parse(location.search);
    const tabColor = {
      all: 'white',
      person: 'white',
      company: 'white',
    };
    tabColor[get(params, 'type', 'all')] = 'blue';
    return (
      <article className="contacts-page">
        <header className="contacts-page__header">
          <section className="contacts-page__filters">
            Showing all contacts
            <div className="contacts-page__filter-button-group">
              <Button
                className="contacts-page__filter-button"
                color={tabColor.all}
                onClick={this.searchAll}
              >
                All
              </Button>
              <Button
                className="contacts-page__filter-button"
                color={tabColor.person}
                onClick={this.searchPerson}
              >
                Persons
              </Button>
              <Button
                className="contacts-page__filter-button"
                color={tabColor.company}
                onClick={this.searchCompany}
              >
                Companies
              </Button>
            </div>
          </section>
          <section className="contacts-page__header-button-group">
            <ForbiddenLinkHider path="/contacts/new">
              <div className="contacts-page__header-button">
                <IconedButton
                  icon="company"
                  title="Add company contact"
                  onClick={this.toNewCompanyContact}
                />
              </div>
            </ForbiddenLinkHider>
            <ForbiddenLinkHider path="/contacts/new">
              <div className="contacts-page__header-button">
                <IconedButton
                  icon="person"
                  title="Add person contact"
                  onClick={this.toNewPersonContact}
                />
              </div>
            </ForbiddenLinkHider>
          </section>
        </header>
        <Paper classes={{
          root: 'contacts-page__content mui-override'
        }}>
          {this.props.contacts.map((contact)=>(
            <Contact
              key={contact.id}
              contact={contact}
              toEditing={this.toContactEditing}
            />
          ))}
        </Paper>
      </article>
    );
  }

  @bind
  private makeNavigationHandler(location: LocationDescriptor): IEventHandler {
    return () => {
      this.props.toLocation(location)
    }
  }

  @bind
  private makeSearchHandler(search?: any): IEventHandler {
    return () => {
      this.props.getData(search);
      this.props.toLocation({
        pathname: 'contacts',
        search: search ? stringify(search) : '',
      });
    }
  }

  @bind
  private toContactEditing(id: number):void{
    const path = `/contacts/${id}/edit`;
    if(isRouteAllowed(path, this.props.premission)) {
      this.props.toLocation(path)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddressBook)