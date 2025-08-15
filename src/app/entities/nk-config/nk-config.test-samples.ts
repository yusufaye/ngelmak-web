import dayjs from 'dayjs/esm';

import { IConfig } from './config.model';

export const sampleWithRequiredData: IConfig = {
  id: 17527,
};

export const sampleWithPartialData: IConfig = {
  id: 10688,
};

export const sampleWithFullData: IConfig = {
  id: 31773,
  lastUpdate: dayjs('2024-08-14T10:47'),
  defaultAccessibility: 'JURNALIST',
  defaultVisibility: 'PRIVATE',
};

export const sampleWithNewData: IConfig = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
