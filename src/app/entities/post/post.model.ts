import { Status } from 'app/entities/enumerations/status.model';
import { Subject } from 'app/entities/enumerations/subject.model';
import { Visibility } from 'app/entities/enumerations/visibility.model';
import { INkAccount } from 'app/entities/nk-account/nk-account.model';
import { IAttachment } from '../attachment/attachment.model';
import { IComment } from '../comment/comment.model';

export interface IPost {
  id?: number | null;
  title?: string | null;
  subtitle?: string | null;
  keywords?: string | null;
  subject?: keyof typeof Subject | null;
  at?: Date | null;
  lastUpdate?: Date | null;
  visibility?: keyof typeof Visibility | null;
  content?: string | null;
  status?: keyof typeof Status | null;
  account?: INkAccount | null;
  attachments?: IAttachment[];
  comments?: IComment[];
}
