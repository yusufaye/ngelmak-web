import dayjs from 'dayjs/esm';
import { IPost } from 'app/entities/post/post.model';
import { INgelmakAccount } from 'app/entities/ngelmak-account/ngelmak-account.model';
import { Opinion } from 'app/entities/enumerations/opinion.model';

export interface IComment {
  id: number;
  opinion?: keyof typeof Opinion | null;
  at?: dayjs.Dayjs | null;
  lastUpdate?: dayjs.Dayjs | null;
  content?: string | null;
  post?: Pick<IPost, 'id'> | null;
  replayto?: Pick<IComment, 'id'> | null;
  account?: Pick<INgelmakAccount, 'id'> | null;
}
