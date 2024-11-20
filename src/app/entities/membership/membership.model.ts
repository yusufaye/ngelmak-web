import dayjs from 'dayjs/esm';
import { INgelmakAccount } from 'app/entities/ngelmak-account/ngelmak-account.model';

export interface IMembership {
  id: number;
  at?: dayjs.Dayjs | null;
  activateNotification?: boolean | null;
  account?: Pick<INgelmakAccount, 'id'> | null;
  subscriber?: Pick<INgelmakAccount, 'id'> | null;
}
