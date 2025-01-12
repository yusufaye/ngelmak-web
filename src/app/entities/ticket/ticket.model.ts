import dayjs from 'dayjs/esm';
import { IPost } from 'app/entities/post/post.model';
import { IComment } from 'app/entities/comment/comment.model';
import { INkAccount } from 'app/entities/nk-account/nk-account.model';
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
  accountRelated?: Pick<INkAccount, 'id'> | null;
  issuedby?: Pick<INkAccount, 'id'> | null;
}
