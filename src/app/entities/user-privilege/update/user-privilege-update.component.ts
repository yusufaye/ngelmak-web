import { UserPrivilegeService } from "./../service/user-privilege.service";
import { Component, inject, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import SharedModule from "app/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { Accessibility } from "app/entities/enumerations/accessibility.model";
import { Visibility } from "app/entities/enumerations/visibility.model";
import { IUserPrivilege } from "../user-privilege.model";

@Component({
  standalone: true,
  selector: "app-nk-user-privilege-update",
  templateUrl: "./user-privilege-update.component.html",
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UserPrivilegeUpdateComponent implements OnInit {
  isSaving = false;
  userPrivilege: IUserPrivilege | null = null;
  accessibilityValues = Object.keys(Accessibility);
  visibilityValues = Object.keys(Visibility);

  protected userPrivilegeService = inject(UserPrivilegeService);
  protected activatedRoute = inject(ActivatedRoute);

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
    // const userPrivilege = this.userPrivilegeFormService.getUserPrivilege(
    //   this.editForm
    // );
    // if (userPrivilege.id !== null) {
    //   this.subscribeToSaveResponse(
    //     this.userPrivilegeService.update(userPrivilege)
    //   );
    // } else {
    //   this.subscribeToSaveResponse(
    //     this.userPrivilegeService.create(userPrivilege)
    //   );
    // }
  }

  protected subscribeToSaveResponse(
    result: Observable<HttpResponse<IUserPrivilege>>
  ): void {
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
    // this.userPrivilegeFormService.resetForm(this.editForm, userPrivilege);
  }
}
