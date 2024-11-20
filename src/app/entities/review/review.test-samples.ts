import dayjs from 'dayjs/esm';

import { IReview } from './review.model';

export const sampleWithRequiredData: IReview = {
  id: 27388,
  at: dayjs('2024-08-14T18:10'),
  status: 'VALIDATED',
  timeout: 24108,
};

export const sampleWithPartialData: IReview = {
  id: 7620,
  at: dayjs('2024-08-14T13:05'),
  status: 'NOT_QUALIFIED',
  timeout: 18605,
};

export const sampleWithFullData: IReview = {
  id: 17047,
  at: dayjs('2024-08-15T01:50'),
  status: 'SUSPENDED',
  timeout: 10838,
};

export const sampleWithNewData: IReview = {
  at: dayjs('2024-08-14T16:57'),
  status: 'VALIDATED',
  timeout: 20762,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
