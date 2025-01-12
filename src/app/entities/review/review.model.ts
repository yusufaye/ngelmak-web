import dayjs from 'dayjs/esm';
import { INkAccount } from 'app/entities/nk-account/nk-account.model';
import { ITicket } from 'app/entities/ticket/ticket.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IReview {
  id: number;
  at?: dayjs.Dayjs | null;
  status?: keyof typeof Status | null;
  timeout?: number | null;
  account?: Pick<INkAccount, 'id'> | null;
  ticket?: Pick<ITicket, 'id'> | null;
  replyto?: Pick<IReview, 'id'> | null;
}
