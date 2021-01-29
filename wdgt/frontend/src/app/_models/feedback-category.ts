import { Company } from './index';

export interface FeedbackCategory {
  id: number;
  company: Company;
  title: string;
  type: string;
}
