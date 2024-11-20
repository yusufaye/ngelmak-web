import dayjs from 'dayjs/esm';

import { INgelmakAccount } from './ngelmak-account.model';

export const sampleWithRequiredData: INgelmakAccount = {
  id: 28897,
};

export const sampleWithPartialData: INgelmakAccount = {
  id: 15285,
};

export const sampleWithFullData: INgelmakAccount = {
  id: 15540,
  name: 'quant à spécialiste',
  foregroundPicture: 'moins',
  backgroundPicture: 'direction',
  visibility: 'PRIVATE',
  createdAt: dayjs('2024-08-14T19:15'),
};

export const sampleWithNewData: INgelmakAccount = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
