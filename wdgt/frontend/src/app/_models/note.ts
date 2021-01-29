import { Author } from './index';

export interface Note {
  id: number;
  feedbackId: number;
  text: string;
  editing: boolean;
  author: Author;
}
