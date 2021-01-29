
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,  of } from 'rxjs';


import { environment } from '../../environments/environment';

import { URLS } from '../config/api';

import { ProductModel } from '../_models';

@Injectable()
export class ProductModelService {
  constructor(protected http: HttpClient) {}

  get(id: number): Observable<ProductModel> {
    return this.http.get<any>(`${URLS.productModels}/${id}`).pipe(
      map(answer => {
        return this.prepareProductModel(answer.productModel);
      }));
  }

  vin(vin: string): Observable<any> {
    const data = {vin};
    return this.http.post<any>(`${environment.serverUrl}/products/vin/`, data).pipe(
    map(answer => {

      return true;
    }));
  }

  getByData(data: any): Observable<ProductModel> {

    return of(this.prepareProductModel(data));
  }

  private prepareProductModel(data: any): ProductModel {
    const productModel = {
      ...data
    };
    return productModel;
  }
}
