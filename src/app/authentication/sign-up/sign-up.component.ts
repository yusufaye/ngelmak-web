import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import PasswordStrengthBarComponent from 'app/account-management/password/password-strength-bar/password-strength-bar.component';
import { RegisterService } from 'app/account-management/register/register.service';
import { LOGIN_ALREADY_USED_TYPE, EMAIL_ALREADY_USED_TYPE } from 'app/config/error.constants';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [PasswordStrengthBarComponent, SharedModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent {
  doNotMatch = signal(false);
  error = signal(false);
  errorEmailExists = signal(false);
  errorUserExists = signal(false);
  success = signal(false);

  private registerService = inject(RegisterService);
  private route = inject(Router);

  registerForm = new FormGroup({
    login: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
  });


  register(): void {
    this.doNotMatch.set(false);
    this.error.set(false);
    this.errorEmailExists.set(false);
    this.errorUserExists.set(false);
    const { password, confirmPassword } = this.registerForm.getRawValue();
    if (password !== confirmPassword) {
      this.doNotMatch.set(true);
    } else {
      const { login, email } = this.registerForm.getRawValue();
      this.registerService
        .save({ login, email, password, langKey: 'fr' })
        // .save({ login, email, password, langKey: this.translateService.currentLang })
        .subscribe({ next: () => this.processSuccess(), error: response => this.processError(response) });
    }
  }

  private processSuccess(): void {
    this.success.set(true);
    this.route.navigate(['']); // return to home
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
      this.errorUserExists.set(true);
    } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
      this.errorEmailExists.set(true);
    } else {
      this.error.set(true);
    }
  }
}
