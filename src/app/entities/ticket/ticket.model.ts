import dayjs from 'dayjs/esm';
import { IPost } from 'app/entities/post/post.model';
import { IComment } from 'app/entities/comment/comment.model';
import { INgelmakAccount } from 'app/entities/ngelmak-account/ngelmak-account.model';
import { TicketType } from 'app/entities/enumerations/ticket-type.model';

export interface ITicket {
  id: number;
  object?: string | null;
  type?: keyof typeof TicketType | null;
  at?: dayjs.Dayjs | null;
  closed?: boolean | null;
  content?: string | null;
  postRelated?: Pick<IPost, 'id'> | null;
  commentRelated?: Pick<IComment, 'id'> | null;
  accountRelated?: Pick<INgelmakAccount, 'id'> | null;
  issuedby?: Pick<INgelmakAccount, 'id'> | null;
}
