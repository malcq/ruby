import { AnswerPreparer } from '../app/_core/answer-preparer';

const rawFeedbackCategoriesAnswer = {
  error: false,
  feedback_categories: [
    {
      id: 1,
      title: 'Improvement',
      type: 'improvement',
      company_id: 1,
      created_at: '2018-06-11T10:57:23.915Z',
      updated_at: '2018-06-11T10:57:23.915Z',
      created_by: 1
    },
    {
      id: 2,
      title: 'Issue',
      type: 'issue',
      company_id: 1,
      created_at: '2018-06-11T10:57:23.911Z',
      updated_at: '2018-06-11T10:57:23.911Z',
      created_by: 1
    }
  ]
};

const feedbackCategoriesAnswer = AnswerPreparer.normaliseObjectNames(rawFeedbackCategoriesAnswer);

export {
  feedbackCategoriesAnswer
};
