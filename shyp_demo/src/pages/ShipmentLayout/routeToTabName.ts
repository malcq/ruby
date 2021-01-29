import { find, get } from 'lodash';
import * as tabs from './tabRoutes';

const tabMap = [
  [tabs.overview, /\/shipments\/.+?\/overview\/?/],
  [tabs.instructions, /\/shipments\/.+?\/instructions\/?/],
  [tabs.documentation, /\/shipments\/.+?\/documentation\/?/],
  [tabs.track, /\/shipments\/.+?\/track\/?/],
  [tabs.costs, /\/shipments\/.+?\/price-structure\/?/],
  [tabs.conversations, /\/shipments\/.+?\/conversations\/?.*/],
];

const isMatch = (route: string, [field, regex]: any[]): boolean => regex.test(route);

export default (route: string): string => get(find(tabMap, isMatch.bind(null, route)), 0, '');