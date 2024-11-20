import dayjs from 'dayjs/esm';
import { INgelmakAccount } from 'app/entities/ngelmak-account/ngelmak-account.model';
import { ITicket } from 'app/entities/ticket/ticket.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IReview {
  id: number;
  at?: dayjs.Dayjs | null;
  status?: keyof typeof Status | null;
  timeout?: number | null;
  account?: Pick<INgelmakAccount, 'id'> | null;
  ticket?: Pick<ITicket, 'id'> | null;
  replyto?: Pick<IReview, 'id'> | null;
}
