import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PasswordService } from 'app/account-management/password/password.service';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { flashBoxShadow2000ms } from 'app/shared/animations/flash.animation';
import SharedModule from 'app/shared/shared.module';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-password',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, SharedModule, MatFormFieldModule, MatInputModule],
  templateUrl: './user-password.component.html',
  styleUrl: './user-password.component.scss',
  animations: [flashBoxShadow2000ms],
})
export class UserPasswordComponent {
  private fb = inject(FormBuilder);
  doNotMatch = signal(false);
  isSaving = signal(false);
  success = signal(false);
  error = signal(false);
  flashBoxShadowState = null; // set to null to avoid flash box-shadow animation to first when the DOM starts.
  account$?: Observable<Account | null>;

  private passwordService = inject(PasswordService);
  private accountService = inject(AccountService);

  passwordForm = this.fb.group({
    currentPassword: [null, Validators.required],
    newPassword: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    confirmPassword: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
  });

  ngOnInit(): void {
    this.account$ = this.accountService.identity();
  }

  changePassword(): void {
    this.isSaving.set(true);
    this.flashBoxShadowState = true;

    const { newPassword, confirmPassword, currentPassword } = this.passwordForm.getRawValue();
    if (newPassword !== confirmPassword) {
      this.doNotMatch.set(true);
      setTimeout(() => this.doNotMatch.set(false), 3000);
    } else {
      this.passwordService.save(newPassword, currentPassword).subscribe({ complete: () => (this.isSaving.set(false)) });
    }
  }
}
