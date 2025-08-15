import { IUser } from 'app/entities/user/user.model';
import { GrantStatus } from "../enumerations/grant-status.model";
import { IPrivilege } from "../models/nk-privilege.model";

export interface IUserPrivilege {
  id?: number | null;
  grantStatus?: GrantStatus;
  date?: Date | null;
  lastUpdatedDate?: Date | null;
  comment?: string;
  privilege?: IPrivilege;
  lastUpdatedBy?: IUser;
  grantedTo?: IUser;
}
