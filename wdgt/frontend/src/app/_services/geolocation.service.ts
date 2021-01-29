
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable ,  forkJoin ,  of ,  race } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  constructor(
    private http: HttpClient
  ) { }

  getByIp(): Observable<string> {
    return this.http.get('https://ip2c.org/s', {responseType: 'text'}).pipe(
      map(answer => answer.split(';')[2]),
      catchError(error => of('')),);
  }

  getByTime(): Observable<string[]> {
    return race(
      this.http.get('https://nist.time.gov/actualtime.cgi?lzbc=siqm9b', {responseType: 'text'}).pipe(
        map(answer => new Date(parseInt(/time="(\d{16})"/.exec(answer)[1], 10) / 1000).getTime())),
      this.http.get('http://worldclockapi.com/api/json/utc/now', {responseType: 'json'}).pipe(
        map((answer: any) => new Date(answer.currentDateTime).getTime()))
    ).pipe(
      map(serverTime => {
        const localTime = new Date().getTime();
        const offset = new Date().getTimezoneOffset();
        const compens = Math.round((localTime - serverTime)  / 1000 / 60 / 15) * 15;
        return getCountriesByTz(
          getTimezoneOffset(offset + compens)
        );
      }),
      catchError(error => {
        const offset = new Date().getTimezoneOffset();
        return of(getCountriesByTz(
          getTimezoneOffset(offset)
        ));
      }),);
  }

  getCountry(): Observable<string> {
    return forkJoin([
      this.getByIp(),
      this.getByTime()
    ]).pipe(
    map((data: any[]) => {
      const[byIp, byTz] = data;
      let country: string = null;

      if (byTz.includes(byIp)) {
        country = byIp;
      }

      return country;
    }));
  }
}

const countriesByTz = {
  'UTC -11:00': ['ASM', 'NIU', 'UMI'],
  'UTC -10:00': ['COK', 'PYF', 'USA'],
  'UTC -09:30': ['PYF'],
  'UTC -09:00': ['PYF', 'USA'],
  'UTC -08:00': ['CAN', 'MEX', 'PCN', 'USA'],
  'UTC -07:00': ['CAN', 'MEX', 'USA'],
  'UTC -06:00': ['BLZ', 'CAN', 'CRI', 'ECU', 'SLV', 'GTM', 'HND', 'MEX', 'NIC', 'USA'],
  'UTC -05:00': ['BHS', 'BRA', 'CAN', 'CYM', 'CHL', 'COL', 'CUB', 'ECU', 'HTI', 'JAM', 'MEX', 'PAN', 'PER', 'TCA', 'USA'],
  'UTC -04:00': [
    'AIA', 'ATG', 'ABW', 'BRB', 'BMU', 'BOL', 'BES', 'BRA', 'VGB', 'CAN',
    'CUW', 'DMA', 'DOM', 'GRL', 'GRD', 'GLP', 'GUY', 'MTQ', 'MSR', 'PRI',
    'BLM', 'KNA', 'LCA', 'MAF', 'VCT', 'SXM', 'TTO', 'VIR', 'VEN'
  ],
  'UTC -03:30': ['CAN'],
  'UTC -03:00': ['ATA', 'ATA', 'ARG', 'BRA', 'CHL', 'FLK', 'GUF', 'GRL', 'PRY', 'SPM', 'SUR', 'URY'],
  'UTC -02:00': ['BRA', 'SGS'],
  'UTC -01:00': ['CPV', 'GRL', 'PRT'],
  'UTC': [
    'ATA', 'BFA', 'FRO', 'GMB', 'GHA', 'GRL', 'GGY', 'GIN', 'GNB', 'ISL',
    'IRL', 'IMN', 'CIV', 'JEY', 'LBR', 'MLI', 'MRT', 'PRT', 'SHN', 'SEN',
    'SLE', 'ESP', 'TGO', 'GBR'
  ],
  'UTC +01:00': [
    'ALB', 'DZA', 'AND', 'AGO', 'AUT', 'BEL', 'BEN', 'BIH', 'CMR', 'CAF',
    'TCD', 'HRV', 'CZE', 'COD', 'DNK', 'GNQ', 'FRA', 'GAB', 'DEU', 'GIB',
    'HUN', 'ITA', 'LIE', 'LUX', 'MKD', 'MLT', 'MCO', 'MNE', 'MAR', 'NLD',
    'NER', 'NGA', 'NOR', 'POL', 'COG', 'SMR', 'STP', 'SRB', 'SVK', 'SVN',
    'ESP', 'SJM', 'SWE', 'CHE', 'TUN', 'VAT', 'ESH'
  ],
  'UTC +02:00': [
    'ALA', 'BWA', 'BGR', 'BDI', 'CYP', 'COD', 'EGY', 'EST', 'FIN', 'GRC',
    'ISR', 'JOR', 'LVA', 'LBN', 'LSO', 'LBY', 'LTU', 'MWI', 'MDA', 'MOZ',
    'NAM', 'PSE', 'PSE', 'ROU', 'RUS', 'RWA', 'ZAF', 'SDN', 'SWZ', 'SYR',
    'UKR', 'ZMB', 'ZWE'
  ],
  'UTC +03:00': [
    'ATA', 'BHR', 'BLR', 'COM', 'DJI', 'ERI', 'ETH', 'IRQ', 'KEN', 'KWT',
    'MDG', 'MYT', 'QAT', 'RUS', 'SAU', 'SOM', 'SSD', 'TZA', 'TUR', 'UGA',
    'YEM'
  ],
  'UTC +03:30': ['IRN'],
  'UTC +04:00': ['ARM', 'AZE', 'GEO', 'MUS', 'OMN', 'REU', 'RUS', 'SYC', 'ARE'],
  'UTC +04:30': ['AFG'],
  'UTC +05:00': ['ATA', 'ATF', 'KAZ', 'MDV', 'PAK', 'RUS', 'TJK', 'TKM', 'UZB', 'UZB'],
  'UTC +05:30': ['IND', 'LKA'],
  'UTC +05:45': ['NPL'],
  'UTC +06:00': ['ATA', 'BGD', 'BTN', 'IOT', 'CHN', 'KAZ', 'KAZ', 'KGZ', 'RUS'],
  'UTC +06:30': ['CCK', 'MMR'],
  'UTC +07:00': ['ATA', 'KHM', 'CXR', 'IDN', 'IDN', 'LAO', 'MNG', 'RUS', 'THA', 'VNM'],
  'UTC +08:00': ['ATA', 'AUS', 'BRN', 'CHN', 'HKG', 'IDN', 'MAC', 'MYS', 'MNG', 'PHL', 'RUS', 'SGP', 'TWN'],
  'UTC +08:45': ['AUS'],
  'UTC +09:00': ['TLS', 'IDN', 'JPN', 'PRK', 'PLW', 'RUS', 'KOR'],
  'UTC +09:30': ['AUS'],
  'UTC +10:00': ['ATA', 'AUS', 'AUS', 'GUM', 'FSM', 'MNP', 'PNG', 'RUS'],
  'UTC +10:30': ['AUS', 'AUS'],
  'UTC +11:00': ['AUS', 'FSM', 'NCL', 'NFK', 'PNG', 'RUS', 'SLB', 'VUT'],
  'UTC +12:00': ['KIR', 'MHL', 'MHL', 'NRU', 'RUS', 'TUV', 'UMI', 'WLF'],
  'UTC +13:00': ['ATA', 'FJI', 'KIR', 'NZL', 'TKL', 'TON'],
  'UTC +13:45': ['NZL'],
  'UTC +14:00': ['KIR', 'WSM'],
};

function z(n) {
  return (n < 10 ? '0' : '') + n;
}

function getTimezoneOffset(offset) {
  if (!offset) {
    return 'UTC';
  }
  const sign = offset < 0 ? '+' : '-';
  offset = Math.abs(offset);
  return 'UTC ' + sign + z(Math.floor(offset / 60)) + ':' + z(offset % 60);
}

function getCountriesByTz(tz) {
  return countriesByTz[tz] || [];
}
