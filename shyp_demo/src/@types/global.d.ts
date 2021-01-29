import { AxiosResponse } from "axios";
import { AnyAction } from "redux";

declare global {
  interface IMatch{
    params: {[x: string]: string},
    path: string,
    url: string,
  }

  interface IMenuItem {
    id: string | number,
    title: string,
  }

	interface IFieldValidator{
		field: string;
		validate: (value: any) => string;
	}


  type IconType = 'dashboard'
    | 'shipments'
    | 'none'
    | 'request-quote'
    | 'quotes'
    | 'reporting'
    | 'map-overviews'
    | 'rates'
    | 'account'
    | 'address-book'
    | 'logout'
    | 'notify'
    | 'inbox'
    | 'checked'
    | 'restaurant'
    | 'company'
    | 'person'
    | 'info'
    | 'hrevert'
    | 'link'
    | 'plane-landing'
    | 'plane-lift-off'
    | 'arrive'
    | 'depart'
    | 'download'
    | 'close'
    | 'search'
    | 'sea'
    | 'air'
    | 'checked-circle'
    | 'success'

  
  type AlignType = 'left' | 'center' | 'right'

  type IResponseSerializer = (response: AxiosResponse, action?: AnyAction)=>any

  type ISaga1<T1> = (arg1: T1) => Iterator<any>;

  type IEventHandler = (event: any) => void;
}

export { };