import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { IConfig } from 'app/entities/config/config.model';
import { ConfigService } from 'app/entities/config/service/config.service';
import { IUser } from 'app/entities/user/user.model';
import { Accessibility } from 'app/entities/enumerations/accessibility.model';
import { NgelmakAccountService } from '../ngelmak-account.service';
import { INgelmakAccount } from 'app/entities/ngelmak-account/ngelmak-account.model';
import { Visibility } from 'app/entities/enumerations/visibility.model';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import dayjs from 'dayjs/esm';

@Component({
  standalone: true,
  selector: 'app-ngelmak-account-update',
  templateUrl: './ngelmak-account-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class NgelmakAccountUpdateComponent implements OnInit {
  isSaving = false;
  ngelmakAccount: INgelmakAccount | null = null;
  accessibilityValues = Object.keys(Accessibility);

  configurationsCollection: IConfig[] = [];
  usersSharedCollection: IUser[] = [];

  protected ngelmakAccountService = inject(NgelmakAccountService);
  protected configService = inject(ConfigService);
  protected activatedRoute = inject(ActivatedRoute);
  protected fb = inject(FormBuilder);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm = this.fb.group({
    id: [null],
    name: [null, [Validators.required, Validators.minLength(3)]],
    foregroundPicture: [null],
    backgroundPicture: [null],
    visibility: [Visibility.PRIVATE],
    createdAt: [null],
    configuration: [null],
    user: [null],
  })

  compareConfig = (o1: IConfig | null, o2: IConfig | null): boolean => this.configService.compareConfig(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ngelmakAccount }) => {
      this.ngelmakAccount = ngelmakAccount;
      if (ngelmakAccount) {
        this.updateForm(ngelmakAccount);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    // this.isSaving = true;
    const rawNgelmakAccount = this.editForm.getRawValue();
    const ngelmakAccount: INgelmakAccount = {
      ...rawNgelmakAccount,
      createdAt: dayjs(rawNgelmakAccount.createdAt, DATE_TIME_FORMAT),
    }
    if (ngelmakAccount.id !== null) {
      this.subscribeToSaveResponse(this.ngelmakAccountService.update(ngelmakAccount));
    } else {
      this.subscribeToSaveResponse(this.ngelmakAccountService.create(ngelmakAccount));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INgelmakAccount>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(ngelmakAccount: INgelmakAccount): void {
    this.ngelmakAccount = ngelmakAccount;
    // this.editForm.reset({...ngelmakAccount});

    // this.ngelmakAccountFormService.resetForm(this.editForm, ngelmakAccount);
    // this.configurationsCollection = this.configService.addConfigToCollectionIfMissing<IConfig>(
    //   this.configurationsCollection,
    //   ngelmakAccount.configuration,
    // );
  }

  protected loadRelationshipsOptions(): void {
    this.configService
      .query({ filter: 'ngelmakaccount-is-null' })
      .pipe(map((res: HttpResponse<IConfig[]>) => res.body ?? []))
      .pipe(
        map((configs: IConfig[]) =>
          this.configService.addConfigToCollectionIfMissing<IConfig>(configs, this.ngelmakAccount?.configuration),
        ),
      )
      .subscribe((configs: IConfig[]) => (this.configurationsCollection = configs));
  }
}
