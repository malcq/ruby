import a from 'axios';

const axios = a.create({});

export const getCountry = async (): Promise<string> => {
  let country: string | null = null;

  try {
    const [ byIp, byTz ] = await Promise.all([
      getByIp(),
      getByTime()
    ]);

    if (!byTz || byTz.includes(byIp)) {
      country = byIp;
    }
  } catch (err) {
    console.debug('getCountry', err);
  }

  if(!country) {
    country = 'DEU'
  }

  return country;
};

async function getByIp(): Promise<string> {
  return await Promise.race([
    getByIp2c(),
    getByIpinfo()
  ]);
}

async function getByIp2c(): Promise<string> {
  const { data } = await axios.get('https://ip2c.org/s', {responseType: 'text'});
  return data.split(';')[2];
}

async function getByIpinfo(): Promise<string> {
  const { data } = await axios.get('https://ipinfo.io/?token=6bb9286df0587b', {responseType: 'json'});
  return getA3ByA2(data.country);
}

async function getTimeFromWorldtimeapi(): Promise<Date> {
  const { data } = await axios.get('https://worldtimeapi.org/api/timezone/Etc/UTC', {responseType: 'json'});
  return new Date(data.utc_datetime);
}

async function getByTime(): Promise<string[]> {
  try {
    const serverTime = await Promise.race([
      getTimeFromWorldtimeapi()
    ]);

    const localTime = new Date();
    const offset = new Date().getTimezoneOffset();
    const compens = Math.round((localTime.getTime() - serverTime.getTime())  / 1000 / 60 / 15) * 15;
    return getCountriesByTz(
      getTimezoneOffset(offset + compens)
    );
  } catch(err) {
    const offset = new Date().getTimezoneOffset();
    return getCountriesByTz(getTimezoneOffset(offset));
  }
}

type CountriesByTz = Record<string, string[]>;

const countriesByTz: CountriesByTz = {
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

/*
parce from https://en.wikipedia.org/wiki/ISO_3166-1
let result = '{';
$('table.wikitable.sortable.jquery-tablesorter:eq(1) tbody tr').each(function(){
  const a2 = $(this).find('td:eq(1)').text();
  const a3 = $(this).find('td:eq(2)').text();
  result += `"${a2}":"${a3}",`;
});
result += '}';
console.debug(result);
*/

type A2ToA3 = Record<string, string>;

const a2ToA3: A2ToA3 = {"AF":"AFG","AX":"ALA","AL":"ALB","DZ":"DZA","AS":"ASM","AD":"AND","AO":"AGO","AI":"AIA","AQ":"ATA","AG":"ATG","AR":"ARG","AM":"ARM","AW":"ABW","AU":"AUS","AT":"AUT","AZ":"AZE","BS":"BHS","BH":"BHR","BD":"BGD","BB":"BRB","BY":"BLR","BE":"BEL","BZ":"BLZ","BJ":"BEN","BM":"BMU","BT":"BTN","BO":"BOL","BQ":"BES","BA":"BIH","BW":"BWA","BV":"BVT","BR":"BRA","IO":"IOT","BN":"BRN","BG":"BGR","BF":"BFA","BI":"BDI","CV":"CPV","KH":"KHM","CM":"CMR","CA":"CAN","KY":"CYM","CF":"CAF","TD":"TCD","CL":"CHL","CN":"CHN","CX":"CXR","CC":"CCK","CO":"COL","KM":"COM","CG":"COG","CD":"COD","CK":"COK","CR":"CRI","CI":"CIV","HR":"HRV","CU":"CUB","CW":"CUW","CY":"CYP","CZ":"CZE","DK":"DNK","DJ":"DJI","DM":"DMA","DO":"DOM","EC":"ECU","EG":"EGY","SV":"SLV","GQ":"GNQ","ER":"ERI","EE":"EST","SZ":"SWZ","ET":"ETH","FK":"FLK","FO":"FRO","FJ":"FJI","FI":"FIN","FR":"FRA","GF":"GUF","PF":"PYF","TF":"ATF","GA":"GAB","GM":"GMB","GE":"GEO","DE":"DEU","GH":"GHA","GI":"GIB","GR":"GRC","GL":"GRL","GD":"GRD","GP":"GLP","GU":"GUM","GT":"GTM","GG":"GGY","GN":"GIN","GW":"GNB","GY":"GUY","HT":"HTI","HM":"HMD","VA":"VAT","HN":"HND","HK":"HKG","HU":"HUN","IS":"ISL","IN":"IND","ID":"IDN","IR":"IRN","IQ":"IRQ","IE":"IRL","IM":"IMN","IL":"ISR","IT":"ITA","JM":"JAM","JP":"JPN","JE":"JEY","JO":"JOR","KZ":"KAZ","KE":"KEN","KI":"KIR","KP":"PRK","KR":"KOR","KW":"KWT","KG":"KGZ","LA":"LAO","LV":"LVA","LB":"LBN","LS":"LSO","LR":"LBR","LY":"LBY","LI":"LIE","LT":"LTU","LU":"LUX","MO":"MAC","MG":"MDG","MW":"MWI","MY":"MYS","MV":"MDV","ML":"MLI","MT":"MLT","MH":"MHL","MQ":"MTQ","MR":"MRT","MU":"MUS","YT":"MYT","MX":"MEX","FM":"FSM","MD":"MDA","MC":"MCO","MN":"MNG","ME":"MNE","MS":"MSR","MA":"MAR","MZ":"MOZ","MM":"MMR","NA":"NAM","NR":"NRU","NP":"NPL","NL":"NLD","NC":"NCL","NZ":"NZL","NI":"NIC","NE":"NER","NG":"NGA","NU":"NIU","NF":"NFK","MK":"MKD","MP":"MNP","NO":"NOR","OM":"OMN","PK":"PAK","PW":"PLW","PS":"PSE","PA":"PAN","PG":"PNG","PY":"PRY","PE":"PER","PH":"PHL","PN":"PCN","PL":"POL","PT":"PRT","PR":"PRI","QA":"QAT","RE":"REU","RO":"ROU","RU":"RUS","RW":"RWA","BL":"BLM","SH":"SHN","KN":"KNA","LC":"LCA","MF":"MAF","PM":"SPM","VC":"VCT","WS":"WSM","SM":"SMR","ST":"STP","SA":"SAU","SN":"SEN","RS":"SRB","SC":"SYC","SL":"SLE","SG":"SGP","SX":"SXM","SK":"SVK","SI":"SVN","SB":"SLB","SO":"SOM","ZA":"ZAF","GS":"SGS","SS":"SSD","ES":"ESP","LK":"LKA","SD":"SDN","SR":"SUR","SJ":"SJM","SE":"SWE","CH":"CHE","SY":"SYR","TW":"TWN","TJ":"TJK","TZ":"TZA","TH":"THA","TL":"TLS","TG":"TGO","TK":"TKL","TO":"TON","TT":"TTO","TN":"TUN","TR":"TUR","TM":"TKM","TC":"TCA","TV":"TUV","UG":"UGA","UA":"UKR","AE":"ARE","GB":"GBR","US":"USA","UM":"UMI","UY":"URY","UZ":"UZB","VU":"VUT","VE":"VEN","VN":"VNM","VG":"VGB","VI":"VIR","WF":"WLF","EH":"ESH","YE":"YEM","ZM":"ZMB","ZW":"ZWE",};

function getA3ByA2(a2: string): string {
  return a2ToA3[a2] || 'UNK';
}

function z(n: number): string {
  return (n < 10 ? '0' : '') + n;
}

function getTimezoneOffset(offset: number): string {
  if (!offset) {
    return 'UTC';
  }
  const sign = offset < 0 ? '+' : '-';
  offset = Math.abs(offset);
  return 'UTC ' + sign + z(Math.floor(offset / 60)) + ':' + z(offset % 60);
}

function getCountriesByTz(tz: string): string[] {
  return countriesByTz[tz] || [];
}
