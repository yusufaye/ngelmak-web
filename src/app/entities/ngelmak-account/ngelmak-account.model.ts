import dayjs from 'dayjs/esm';
import { IConfig } from 'app/entities/config/config.model';
import { IUser } from 'app/entities/user/user.model';
import { Accessibility } from 'app/entities/enumerations/accessibility.model';

export interface INgelmakAccount {
  id: number | null;
  name?: string | null;
  description?: string | null;
  foregroundPicture?: string | null;
  backgroundPicture?: string | null;
  visibility?: keyof typeof Accessibility | null;
  createdAt?: dayjs.Dayjs | null;
  configuration?: IConfig;
  user?: IUser;
}
