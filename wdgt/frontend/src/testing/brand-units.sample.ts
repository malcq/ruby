import { AnswerPreparer } from '../app/_core/answer-preparer';

const rawBrandUnitsAnswer = {
  error: false,
  brand_units: [
    {
      id: 1,
      title: 'BMW Cars',
      company_id: 1,
      created_at: '2018-06-11T10:57:23.881Z',
      updated_at: '2018-06-11T10:57:23.881Z',
      created_by: 1
    },
    {
      id: 2,
      title: 'BMW Driving Experience',
      company_id: 1,
      created_at: '2018-06-11T10:57:23.888Z',
      updated_at: '2018-06-11T10:57:23.888Z',
      created_by: 1
    },
    {
      id: 3,
      title: 'BMW Design',
      company_id: 1,
      created_at: '2018-06-11T10:57:23.892Z',
      updated_at: '2018-06-11T10:57:23.892Z',
      created_by: 1
    },
    {
      id: 4,
      title: 'BMW Exclusive / Equipment',
      company_id: 1,
      created_at: '2018-06-11T10:57:23.895Z',
      updated_at: '2018-06-11T10:57:23.895Z',
      created_by: 1
    },
    {
      id: 5,
      title: 'BMW Drivers Selection',
      company_id: 1,
      created_at: '2018-06-11T10:57:23.899Z',
      updated_at: '2018-06-11T10:57:23.899Z',
      created_by: 1
    }
  ]
};

const brandUnitsAnswer = AnswerPreparer.normaliseObjectNames(rawBrandUnitsAnswer);

export {
  brandUnitsAnswer
};
