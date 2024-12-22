import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Accessibility } from 'app/entities/enumerations/accessibility.model';
import { Visibility } from 'app/entities/enumerations/visibility.model';
import { IUserPrivilege } from '../ngelmak-account-privilege.model';
import { UserPrivilegeService } from '../service/ngelmak-account-privilege.service';
import { UserPrivilegeFormService, UserPrivilegeFormGroup } from './ngelmak-account-privilege-form.service';

@Component({
  standalone: true,
  selector: 'app-ngelmak-account-privilege-update',
  templateUrl: './ngelmak-account-privilege-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UserPrivilegeUpdateComponent implements OnInit {
  isSaving = false;
  userPrivilege: IUserPrivilege | null = null;
  accessibilityValues = Object.keys(Accessibility);
  visibilityValues = Object.keys(Visibility);

  protected userPrivilegeService = inject(UserPrivilegeService);
  protected userPrivilegeFormService = inject(UserPrivilegeFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: UserPrivilegeFormGroup = this.userPrivilegeFormService.createUserPrivilegeFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userPrivilege }) => {
      this.userPrivilege = userPrivilege;
      if (userPrivilege) {
        this.updateForm(userPrivilege);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userPrivilege = this.userPrivilegeFormService.getUserPrivilege(this.editForm);
    if (userPrivilege.id !== null) {
      this.subscribeToSaveResponse(this.userPrivilegeService.update(userPrivilege));
    } else {
      this.subscribeToSaveResponse(this.userPrivilegeService.create(userPrivilege));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserPrivilege>>): void {
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

  protected updateForm(userPrivilege: IUserPrivilege): void {
    this.userPrivilege = userPrivilege;
    this.userPrivilegeFormService.resetForm(this.editForm, userPrivilege);
  }
}
