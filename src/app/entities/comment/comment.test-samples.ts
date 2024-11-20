import { IComment } from 'app/entities/comment/comment.model';
import dayjs from 'dayjs/esm';

export const sampleWithRequiredData: IComment = {
  id: 27968,
  opinion: 'NEUTRAL',
  at: dayjs('2024-08-14T20:48'),
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithPartialData: IComment = {
  id: 18922,
  opinion: 'OPPOSED',
  at: dayjs('2024-08-15T06:31'),
  lastUpdate: dayjs('2024-08-15T09:55'),
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IComment = {
  id: 16088,
  opinion: 'OPPOSED',
  at: dayjs('2024-08-14T13:10'),
  lastUpdate: dayjs('2024-08-15T05:47'),
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: IComment = {
  opinion: 'NEUTRAL',
  at: dayjs('2024-08-14T17:11'),
  content: '../fake-data/blob/hipster.txt',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
