import { NgelmakAccountService } from 'app/entities/ngelmak-account/ngelmak-account.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AccountService } from 'app/core/auth/account.service';
import { INgelmakAccount } from 'app/entities/ngelmak-account/ngelmak-account.model';
import SharedModule from 'app/shared/shared.module';
import { flashBoxShadow2000ms } from 'app/shared/animations/flash.animation';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-account-update',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './account-update.component.html',
  styleUrl: './account-update.component.scss',
  animations: [flashBoxShadow2000ms],
})
export class AccountUpdateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ngelmakAccountService = inject(NgelmakAccountService);
  account = inject(AccountService).trackCurrentAccount();
  isSaving = signal(false);
  flashBoxShadowState = null; // set to null to avoid flash box-shadow animation to first when the DOM starts.

  ngelmakAccountForm = this.fb.group({
    id: [null],
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)],],
  });

  ngOnInit(): void {
    this.ngelmakAccountService.findByCurrentUser().subscribe(response => (this.ngelmakAccountForm.patchValue(response.body)));
  }

  save() {
    this.isSaving.set(true);
    this.flashBoxShadowState = true;
    const ngelmakAccount: INgelmakAccount = this.ngelmakAccountForm.value as INgelmakAccount;
    this.ngelmakAccountService.partialUpdate(ngelmakAccount)
      .pipe(finalize(() => (this.isSaving.set(false))))
      .subscribe();
  }
}
