import { Component, OnInit, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SignInService } from 'app/authentication/sign-in/sign-in.service';

@Component({
  standalone: true,
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
})
export default class SignInComponent implements OnInit {
  private signInService = inject(SignInService);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  authenticationError = signal(false);

  signInForm = this.fb.group({
    username: ['admin', [Validators.required]],
    password: ['admin', [Validators.required]],
    rememberMe: [false, [Validators.required]],
  });

  hide = true;

  ngOnInit(): void {
    // if already authenticated then navigate to home page
    this.accountService.identity().subscribe(() => {
      if (this.accountService.isAuthenticated()) {
        this.router.navigate(['']);
      }
    });
  }

  signIn(): void {
    const credentials = this.signInForm.getRawValue();
    this.signInService.signIn(credentials)
      .subscribe({
        next: () => {
          this.authenticationError.set(false);
          // There were no routing during signIn (eg from navigationToStoredUrl)
          if (!this.router.getCurrentNavigation()) {
            this.router.navigate(['']);
          } else {
            console.log('Current Navigation', this.router.getCurrentNavigation());
          }
        },
        error: () => this.authenticationError.set(true),
      });
  }
}
