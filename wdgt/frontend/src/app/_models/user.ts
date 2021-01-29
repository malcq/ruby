import { Company } from './index';

export interface User {
  id: number;
  company: Company;
  name: string;
  email: string;
  vins?: any[];
}
