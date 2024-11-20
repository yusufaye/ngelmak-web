import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { flashBoxShadow2000ms } from 'app/shared/animations/flash.animation';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, SharedModule, MatFormFieldModule, MatInputModule],
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.scss',
  animations: [flashBoxShadow2000ms],
})
export class UserUpdateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  isSaving = signal(false);
  flashBoxShadowState = null; // set to null to avoid flash box-shadow animation to first when the DOM starts.

  accountForm = this.fb.group({
    firstName: ['', [ Validators.required, Validators.minLength(1), ]],
    lastName: ['', [ Validators.required, Validators.minLength(1), ]],
    login: ['', [ Validators.required, Validators.minLength(1), Validators.maxLength(50),
      Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
    ],],
    email: ['', [ Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email ] ],
  });

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => (this.accountForm.patchValue(account)));
  }

  save(): void {
    this.isSaving.set(true);
    const account = this.accountForm.value as Account;
    this.accountService.save(account).pipe(finalize(() => (this.isSaving.set(false)))).subscribe(() => (this.accountService.authenticate(account)));
  }
}
