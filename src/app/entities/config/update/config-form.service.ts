import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IConfig } from '../config.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IConfig for edit and IConfigFormGroupInput for create.
 */
type ConfigFormGroupInput = IConfig | PartialWithRequiredKeyOf<IConfig>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IConfig | IConfig> = Omit<T, 'lastUpdate'> & {
  lastUpdate?: string | null;
};

type ConfigFormRawValue = FormValueOf<IConfig>;

type IConfigFormRawValue = FormValueOf<IConfig>;

type ConfigFormDefaults = Pick<IConfig, 'id' | 'lastUpdate'>;

type ConfigFormGroupContent = {
  id: FormControl<ConfigFormRawValue['id'] | IConfig['id']>;
  lastUpdate: FormControl<ConfigFormRawValue['lastUpdate']>;
  defaultAccessibility: FormControl<ConfigFormRawValue['defaultAccessibility']>;
  defaultVisibility: FormControl<ConfigFormRawValue['defaultVisibility']>;
};

export type ConfigFormGroup = FormGroup<ConfigFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ConfigFormService {
  createConfigFormGroup(config: ConfigFormGroupInput = { id: null }): ConfigFormGroup {
    const configRawValue = this.convertConfigToConfigRawValue({
      ...this.getFormDefaults(),
      ...config,
    });
    return new FormGroup<ConfigFormGroupContent>({
      id: new FormControl(
        { value: configRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      lastUpdate: new FormControl(configRawValue.lastUpdate),
      defaultAccessibility: new FormControl(configRawValue.defaultAccessibility),
      defaultVisibility: new FormControl(configRawValue.defaultVisibility),
    });
  }

  getConfig(form: ConfigFormGroup): IConfig | IConfig {
    return this.convertConfigRawValueToConfig(form.getRawValue() as ConfigFormRawValue | IConfigFormRawValue);
  }

  resetForm(form: ConfigFormGroup, config: ConfigFormGroupInput): void {
    const configRawValue = this.convertConfigToConfigRawValue({ ...this.getFormDefaults(), ...config });
    form.reset(
      {
        ...configRawValue,
        id: { value: configRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ConfigFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      lastUpdate: currentTime,
    };
  }

  private convertConfigRawValueToConfig(rawConfig: ConfigFormRawValue | IConfigFormRawValue): IConfig | IConfig {
    return {
      ...rawConfig,
      lastUpdate: dayjs(rawConfig.lastUpdate, DATE_TIME_FORMAT),
    };
  }

  private convertConfigToConfigRawValue(
    config: IConfig | (Partial<IConfig> & ConfigFormDefaults),
  ): ConfigFormRawValue | PartialWithRequiredKeyOf<IConfigFormRawValue> {
    return {
      ...config,
      lastUpdate: config.lastUpdate ? config.lastUpdate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
