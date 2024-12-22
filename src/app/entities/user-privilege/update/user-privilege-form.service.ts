import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { IUserPrivilege } from '../ngelmak-account-privilege.model';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserPrivilege for edit and IUserPrivilegeFormGroupInput for create.
 */
type UserPrivilegeFormGroupInput = IUserPrivilege | PartialWithRequiredKeyOf<IUserPrivilege>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IUserPrivilege | IUserPrivilege> = Omit<T, 'lastUpdate'> & {
  lastUpdate?: string | null;
};

type UserPrivilegeFormRawValue = FormValueOf<IUserPrivilege>;

type IUserPrivilegeFormRawValue = FormValueOf<IUserPrivilege>;

type UserPrivilegeFormDefaults = Pick<IUserPrivilege, 'id' | 'lastUpdate'>;

type UserPrivilegeFormGroupContent = {
  id: FormControl<UserPrivilegeFormRawValue['id'] | IUserPrivilege['id']>;
  lastUpdate: FormControl<UserPrivilegeFormRawValue['lastUpdate']>;
  defaultAccessibility: FormControl<UserPrivilegeFormRawValue['defaultAccessibility']>;
  defaultVisibility: FormControl<UserPrivilegeFormRawValue['defaultVisibility']>;
};

export type UserPrivilegeFormGroup = FormGroup<UserPrivilegeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserPrivilegeFormService {
  createUserPrivilegeFormGroup(userPrivilege: UserPrivilegeFormGroupInput = { id: null }): UserPrivilegeFormGroup {
    const userPrivilegeRawValue = this.convertUserPrivilegeToUserPrivilegeRawValue({
      ...this.getFormDefaults(),
      ...userPrivilege,
    });
    return new FormGroup<UserPrivilegeFormGroupContent>({
      id: new FormControl(
        { value: userPrivilegeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      lastUpdate: new FormControl(userPrivilegeRawValue.lastUpdate),
      defaultAccessibility: new FormControl(userPrivilegeRawValue.defaultAccessibility),
      defaultVisibility: new FormControl(userPrivilegeRawValue.defaultVisibility),
    });
  }

  getUserPrivilege(form: UserPrivilegeFormGroup): IUserPrivilege | IUserPrivilege {
    return this.convertUserPrivilegeRawValueToUserPrivilege(form.getRawValue() as UserPrivilegeFormRawValue | IUserPrivilegeFormRawValue);
  }

  resetForm(form: UserPrivilegeFormGroup, userPrivilege: UserPrivilegeFormGroupInput): void {
    const userPrivilegeRawValue = this.convertUserPrivilegeToUserPrivilegeRawValue({ ...this.getFormDefaults(), ...userPrivilege });
    form.reset(
      {
        ...userPrivilegeRawValue,
        id: { value: userPrivilegeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): UserPrivilegeFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      lastUpdate: currentTime,
    };
  }

  private convertUserPrivilegeRawValueToUserPrivilege(rawUserPrivilege: UserPrivilegeFormRawValue | IUserPrivilegeFormRawValue): IUserPrivilege | IUserPrivilege {
    return {
      ...rawUserPrivilege,
      lastUpdate: dayjs(rawUserPrivilege.lastUpdate, DATE_TIME_FORMAT),
    };
  }

  private convertUserPrivilegeToUserPrivilegeRawValue(
    userPrivilege: IUserPrivilege | (Partial<IUserPrivilege> & UserPrivilegeFormDefaults),
  ): UserPrivilegeFormRawValue | PartialWithRequiredKeyOf<IUserPrivilegeFormRawValue> {
    return {
      ...userPrivilege,
      lastUpdate: userPrivilege.lastUpdate ? userPrivilege.lastUpdate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
