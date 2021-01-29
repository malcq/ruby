import { User, ProductModel, FeedbackCategory, ChatCategory, BaseFile, Company } from './index';

export interface Feedback {
  id: number;
  user: User;
  productModel: ProductModel;
  companyId: number;
  title: string;
  description: string;
  chatCategory: ChatCategory;
  files: BaseFile[];
  isEditable: boolean;

  vin?: string;
  vinId?: number;
  country?: string;
  feedbackCategory?: FeedbackCategory;
  fileDone?: boolean;
  chatDone?: boolean;
  sessionId?: string;
  updateRequest?: boolean;
}
