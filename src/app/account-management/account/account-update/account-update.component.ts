import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { AccountService } from "app/core/auth/account.service";
import { INkAccount } from "app/entities/nk-account/nk-account.model";
import { NkAccountService } from "app/entities/nk-account/nk-account.service";
import { flashBoxShadow2000ms } from "app/shared/animations/flash.animation";
import SharedModule from "app/shared/shared.module";
import { finalize } from "rxjs";

@Component({
  selector: "app-account-update",
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: "./account-update.component.html",
  styleUrl: "./account-update.component.scss",
  animations: [flashBoxShadow2000ms],
})
export class AccountUpdateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private nkAccountService = inject(NkAccountService);
  account = inject(AccountService).trackCurrentAccount();
  nkAccount = inject(AccountService).trackCurrentAccount();
  isSaving = signal(false);
  flashBoxShadowState = null; // set to null to avoid flash box-shadow animation to first when the DOM starts.

  nkAccountForm = this.fb.group({
    id: [null],
    name: ["", [Validators.required, Validators.minLength(2)]],
    description: [
      "",
      [Validators.required, Validators.minLength(1), Validators.maxLength(500)],
    ],
  });

  ngOnInit(): void {
    this.nkAccountForm.patchValue(this.nkAccount());
  }

  save() {
    this.isSaving.set(true);
    this.flashBoxShadowState = true;
    const nkAccount: INkAccount = this.nkAccountForm.value as INkAccount;
    this.nkAccountService
      .update(nkAccount)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe();
  }
}
