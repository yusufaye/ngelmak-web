import { IPost } from 'app/entities/post/post.model';
import { AttachmentCategory } from 'app/entities/enumerations/attachment-type.model';

export interface IAttachment {
  id?: number;
  position?: number;
  type?: string;
  category?: AttachmentCategory;
  content?: any;
  filename?: string;
  duration?: number;
  url?: string | null;
  size?: number | null;
  post?: Pick<IPost, 'id'> | null;
  dirty?: boolean;
}
