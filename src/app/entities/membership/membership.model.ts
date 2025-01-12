import dayjs from 'dayjs/esm';
import { INkAccount } from 'app/entities/nk-account/nk-account.model';

export interface IMembership {
  id: number;
  at?: dayjs.Dayjs | null;
  activateNotification?: boolean | null;
  account?: Pick<INkAccount, 'id'> | null;
  subscriber?: Pick<INkAccount, 'id'> | null;
}
