import { Injectable } from '@angular/core';

const regions = [
  { name: 'AF', regExp: /[A-H]/ }, // Africa
  { name: 'AS', regExp: /[J-R]/ }, // Asia
  { name: 'EU', regExp: /[S-Z]/ }, // Europe
  { name: 'NA', regExp: /[1-5]/ }, // North America
  { name: 'OC', regExp: /[6-7]/ }, // Oceania
  { name: 'SA', regExp: /[8-9]/ } // South America
];

const countryDataList: any[] = [
  {from: 'AA', to: 'AH', countryName: 'South Africa', iso3: 'ZAF'},
  {from: 'AJ', to: 'AN', countryName: 'Cote d\'Ivoire', iso3: 'CIV'},
  {from: 'BA', to: 'BE', countryName: 'Angola', iso3: 'AGO'},
  {from: 'BF', to: 'BK', countryName: 'Kenya', iso3: 'KEN'},
  {from: 'BL', to: 'BR', countryName: 'Tanzania', iso3: 'TZA'},
  {from: 'CA', to: 'CE', countryName: 'Benin', iso3: 'BEN'},
  {from: 'CF', to: 'CK', countryName: 'Madagascar', iso3: 'MDG'},
  {from: 'CL', to: 'CR', countryName: 'Tunisia', iso3: 'TUN'},
  {from: 'DA', to: 'DE', countryName: 'Egypt', iso3: 'EGY'},
  {from: 'DF', to: 'DK', countryName: 'Morocco', iso3: 'MAR'},
  {from: 'DL', to: 'DR', countryName: 'Zambia', iso3: 'ZMB'},
  {from: 'EA', to: 'EE', countryName: 'Ethiopia', iso3: 'ETH'},
  {from: 'EF', to: 'EK', countryName: 'Mozambique', iso3: 'MOZ'},
  {from: 'FA', to: 'FE', countryName: 'Ghana', iso3: 'GHA'},
  {from: 'FF', to: 'FK', countryName: 'Nigeria', iso3: 'NGA'},
  {firstLetter: 'J', countryName: 'Japan', iso3: 'JPN'},
  {from: 'KA', to: 'KE', countryName: 'Sri Lanka', iso3: 'LKA'},
  {from: 'KF', to: 'KK', countryName: 'Israel', iso3: 'ISR'},
  {from: 'KL', to: 'KR', countryName: 'Korea (South)', iso3: 'KOR'},
  {from: 'KS', to: 'K0', countryName: 'Kazakhstan', iso3: 'KAZ'},
  {firstLetter: 'L', countryName: 'China (Mainland)', iso3: 'CHN'},
  {from: 'MA', to: 'ME', countryName: 'India', iso3: 'IND'},
  {from: 'MF', to: 'MK', countryName: 'Indonesia', iso3: 'IDN'},
  {from: 'ML', to: 'MR', countryName: 'Thailand', iso3: 'THA'},
  {from: 'MS', to: 'M0', countryName: 'Myanmar', iso3: 'MMR'},
  {from: 'NA', to: 'NE', countryName: 'Iran', iso3: 'IRN'},
  {from: 'NF', to: 'NK', countryName: 'Pakistan', iso3: 'PAK'},
  {from: 'NL', to: 'NR', countryName: 'Turkey', iso3: 'TUR'},
  {from: 'PA', to: 'PE', countryName: 'Philippines', iso3: 'PHL'},
  {from: 'PF', to: 'PK', countryName: 'Singapore', iso3: 'SGP'},
  {from: 'PL', to: 'PR', countryName: 'Malaysia', iso3: 'MYS'},
  {from: 'RA', to: 'RE', countryName: 'United Arab Emirates', iso3: 'ARE'},
  {from: 'RF', to: 'RK', countryName: 'Taiwan', iso3: 'TWN'},
  {from: 'RL', to: 'RR', countryName: 'Vietnam', iso3: 'VNM'},
  {from: 'RS', to: 'R0', countryName: 'Saudi Arabia', iso3: 'SAU'},
  {from: 'SA', to: 'SM', countryName: 'United Kingdom', iso3: 'GBR'},
  {from: 'SN', to: 'ST', countryName: 'Germany (formerly East Germany)', iso3: 'DEU'},
  {from: 'SU', to: 'SZ', countryName: 'Poland', iso3: 'POL'},
  {from: 'S1', to: 'S4', countryName: 'Latvia', iso3: 'LVA'},
  {from: 'TA', to: 'TH', countryName: 'Switzerland', iso3: 'CHE'},
  {from: 'TJ', to: 'TP', countryName: 'Czech Republic', iso3: 'CZE'},
  {from: 'TR', to: 'TV', countryName: 'Hungary', iso3: 'HUN'},
  {from: 'TW', to: 'T1', countryName: 'Portugal', iso3: 'PRT'},
  {from: 'UH', to: 'UM', countryName: 'Denmark', iso3: 'DNK'},
  {from: 'UN', to: 'UT', countryName: 'Ireland', iso3: 'IRL'},
  {from: 'UU', to: 'UZ', countryName: 'Romania', iso3: 'ROU'},
  {from: 'U5', to: 'U7', countryName: 'Slovakia', iso3: 'SVK'},
  {from: 'VA', to: 'VE', countryName: 'Austria', iso3: 'AUT'},
  {from: 'VF', to: 'VR', countryName: 'France', iso3: 'FRA'},
  {from: 'VS', to: 'VW', countryName: 'Spain', iso3: 'ESP'},
  {from: 'VX', to: 'V2', countryName: 'Serbia', iso3: 'SRB'},
  {from: 'V3', to: 'V5', countryName: 'Croatia', iso3: 'HRV'},
  {from: 'V6', to: 'V0', countryName: 'Estonia', iso3: 'EST'},
  {firstLetter: 'W', countryName: 'Germany (formerly West Germany)', iso3: 'DEU'},
  {from: 'XA', to: 'XE', countryName: 'Bulgaria', iso3: 'BGR'},
  {from: 'XF', to: 'XK', countryName: 'Greece', iso3: 'GRC'},
  {from: 'XL', to: 'XR', countryName: 'Netherlands', iso3: 'NLD'},
  {from: 'XS', to: 'XW', countryName: 'Russia (former USSR)', iso3: 'RUS'},
  {from: 'XX', to: 'X2', countryName: 'Luxembourg', iso3: 'LUX'},
  {from: 'X3', to: 'X0', countryName: 'Russia', iso3: 'RUS'},
  {from: 'YA', to: 'YE', countryName: 'Belgium', iso3: 'BEL'},
  {from: 'YF', to: 'YK', countryName: 'Finland', iso3: 'FIN'},
  {from: 'YL', to: 'YR', countryName: 'Malta', iso3: 'MLT'},
  {from: 'YS', to: 'YW', countryName: 'Sweden', iso3: 'SWE'},
  {from: 'YX', to: 'Y2', countryName: 'Norway', iso3: 'NOR'},
  {from: 'Y3', to: 'Y5', countryName: 'Belarus', iso3: 'BLR'},
  {from: 'Y6', to: 'Y0', countryName: 'Ukraine', iso3: 'UKR'},
  {from: 'ZA', to: 'ZR', countryName: 'Italy', iso3: 'ITA'},
  {from: 'ZX', to: 'Z2', countryName: 'Slovenia', iso3: 'SVN'},
  {from: 'Z3', to: 'Z5', countryName: 'Lithuania', iso3: 'LTU'},
  {firstLetter: '2', countryName: 'Canada', iso3: 'CAN'},
  {from: '3A', to: '3W', countryName: 'Mexico', iso3: 'MEX'},
  {from: '3X', to: '37', countryName: 'Costa Rica', iso3: 'CRI'},
  {from: '38', to: '39', countryName: 'Cayman Islands', iso3: 'CYM'},
  {firstLetter: '6', countryName: 'Australia', iso3: 'AUS'},
  {firstLetter: '7', countryName: 'New Zealand', iso3: 'NZL'},
  {from: '8A', to: '8E', countryName: 'Argentina', iso3: 'ARG'},
  {from: '8F', to: '8K', countryName: 'Chile', iso3: 'CHL'},
  {from: '8L', to: '8R', countryName: 'Ecuador', iso3: 'ECU'},
  {from: '8S', to: '8W', countryName: 'Peru', iso3: 'PER'},
  {from: '8X', to: '82', countryName: 'Venezuela', iso3: 'VEN'},
  {from: '9A', to: '9E', countryName: 'Brazil', iso3: 'BRA'},
  {from: '9F', to: '9K', countryName: 'Colombia', iso3: 'COL'},
  {from: '9L', to: '9R', countryName: 'Paraguay', iso3: 'PRY'},
  {from: '9S', to: '9W', countryName: 'Uruguay', iso3: 'URY'},
  {from: '9X', to: '92', countryName: 'Trinidad & Tobago', iso3: 'TTO'},
  {from: '93', to: '99', countryName: 'Brazil', iso3: 'BRA'},
  {firstLetter: '1', countryName: 'United States', iso3: 'USA'},
  {firstLetter: '4', countryName: 'United States', iso3: 'USA'},
  {firstLetter: '5', countryName: 'United States', iso3: 'USA'}
];

const vmiList: {[key: string]: string} = {
  'WB1': 'BMW',
  'WB3': 'BMW',
  'WBA': 'BMW',
  'WBH': 'BMW',
  'WBS': 'BMW',
  'WBW': 'BMW',
  'WBX': 'BMW',
  'WBY': 'BMW',
  'WBZ': 'BMW',
  'WDM': 'BMW',
  'WDS': 'BMW',
  'WUS': 'BMW',
  'X4X': 'BMW',
  '3AV': 'BMW',
  '5UM': 'BMW',
  '5UX': 'BMW',
  '5YM': 'BMW',
  '7B3': 'BMW',
  '95V': 'BMW',
  '98M': 'BMW'
};

// https://www.etkbmw.com/bmw/EN/vin/decoder/5UXZV4C57D0B12339/EN

@Injectable()
export class VinDecoder {
  static isValid(vinInput: string): boolean {
    const vin: string = vinInput.trim().toUpperCase();
    if (!vin || vin.length !== 17) {
      return false;
    }
    if (VinDecoder.getRegion(vin) === 'EU') {
      return true;
    }
    return VinDecoder.getCheckDigit(vin) === vin.charAt(8);
  }

  static transliterate(c: string): number {
    return '0123456789.ABCDEFGH..JKLMN.P.R..STUVWXYZ'.indexOf(c) % 10;
  }

  static getCheckDigit(vin) {
    const map = '0123456789X';
    const weights = '8765432X098765432';
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += VinDecoder.transliterate(vin.charAt(i)) * map.indexOf(weights.charAt(i));
    }
    return map.charAt(sum % 11);
  }

  static getRegion(vin: string): string {
    let result;
    regions.forEach((region) => {
      if (region.regExp.test(vin[0])) {
        result = region.name;
      }
    });
    return result;
  }

  static getCountry(vin: string): string {
    const vinCC = vin[0] + vin[1];
    let resultCountry;
    countryDataList.forEach(countryData => {
      if (countryData.firstLetter === vin[0] || (countryData.from <= vinCC && vinCC <= countryData.to)) {
        resultCountry = countryData.iso3;
      }
    });
    return resultCountry;
  }

  static getCompany(vin: string): string {
    let vmi = vin.substring(0, 3);
    let result = vmiList[vmi];
    if (!result) {
      vmi = vin.substring(0, 2);
      result = vmiList[vmi];
    }

    return result;
  }
}
