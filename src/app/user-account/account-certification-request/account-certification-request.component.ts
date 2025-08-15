import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { AccountService } from "app/core/auth/account.service";
import { IPrivilege } from "app/entities/models/nk-privilege.model";
import { AlertService } from "app/shared/alert/alert.service";

@Component({
  standalone: true,
  selector: "app-account-certification-request",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
  ],
  templateUrl: "./account-certification-request.component.html",
})
export class AccountCertificationRequest {
  readonly dialogRef = inject(MatDialogRef<AccountCertificationRequest>);

  private accountService = inject(AccountService);
  private alertService = inject(AlertService);

  privilegeForm = new FormGroup({
    officialDocType: new FormControl(null, {
      nonNullable: true,
      validators: Validators.required,
    }),
    officialDocIdentification: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(20)],
    }),
  });

  login: string;
  privileges: IPrivilege[] = [];
  isSaving = signal(false);

  save() {
    this.isSaving.set(true);
    const request = this.privilegeForm.getRawValue();
    this.accountService.requestCertification(request).subscribe({
      next: (account) => {
        this.accountService.authenticate(account);
        this.alertService.addAlert({
          type: "info",
          message: "Votre requête pour idenfication est prise en compte.",
        });
        this.dialogRef.close(true);
        this.isSaving.set(false);
      },
      error: () => {
        this.alertService.addAlert({
          type: "error",
          message: "Une erreur s'est produite.",
        });
        this.isSaving.set(false);
      },
    });
  }
}
