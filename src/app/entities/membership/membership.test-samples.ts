import dayjs from 'dayjs/esm';

import { IMembership } from './membership.model';

export const sampleWithRequiredData: IMembership = {
  id: 13650,
};

export const sampleWithPartialData: IMembership = {
  id: 25283,
  at: dayjs('2024-08-14T15:51'),
  activateNotification: true,
};

export const sampleWithFullData: IMembership = {
  id: 15038,
  at: dayjs('2024-08-14T21:47'),
  activateNotification: true,
};

export const sampleWithNewData: IMembership = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
