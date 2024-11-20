import dayjs from 'dayjs/esm';

import { ITicket } from './ticket.model';

export const sampleWithRequiredData: ITicket = {
  id: 24432,
  object: 'délégation devantXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  type: 'ABUSE',
  at: dayjs('2024-08-14T11:11'),
};

export const sampleWithPartialData: ITicket = {
  id: 18144,
  object: "d'avecXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  type: 'ABUSE',
  at: dayjs('2024-08-15T08:04'),
  closed: false,
};

export const sampleWithFullData: ITicket = {
  id: 20836,
  object: 'quasi naguèreXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  type: 'APPROVAL_REQUEST',
  at: dayjs('2024-08-14T10:56'),
  closed: true,
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: ITicket = {
  object: 'toc-tocXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  type: 'APPROVAL_REQUEST',
  at: dayjs('2024-08-15T07:42'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
