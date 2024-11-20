import dayjs from 'dayjs/esm';
import { INgelmakAccount } from 'app/entities/ngelmak-account/ngelmak-account.model';
import { Subject } from 'app/entities/enumerations/subject.model';
import { Visibility } from 'app/entities/enumerations/visibility.model';
import { Status } from 'app/entities/enumerations/status.model';
import { IAttachment } from '../attachment/attachment.model';

export interface IPost {
  id?: number | null;
  title?: string | null;
  subtitle?: string | null;
  keywords?: string | null;
  subject?: keyof typeof Subject | null;
  at?: dayjs.Dayjs | null;
  lastUpdate?: dayjs.Dayjs | null;
  visibility?: keyof typeof Visibility | null;
  content?: string | null;
  status?: keyof typeof Status | null;
  account?: INgelmakAccount | null;
  attachments?: IAttachment[];
}
