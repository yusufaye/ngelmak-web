import dayjs from "dayjs/esm";
import { GrantStatus } from "../enumerations/grant-status.model";
import { IPrivilege } from "../privilege/privilege.model";
import { IUser } from "app/admin/user-management/user-management.model";

export interface IUserPrivilege {
  id?: number | null;
  grantStatus?: GrantStatus;
  date?: dayjs.Dayjs | null;
  lastUpdatedDate?: dayjs.Dayjs | null;
  comment?: string;
  privilege?: IPrivilege;
  lastUpdatedBy?: IUser;
  grantedTo?: IUser;
}
