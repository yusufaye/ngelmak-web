import dayjs from 'dayjs/esm';

export interface IPrivilege {
  name?: string;
}


export class UserPrivilege {
  constructor(
    public login: string,
    public comment: string,
    public privilege: IPrivilege,
  ) {}
}
