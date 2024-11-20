import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'app/core/auth/account.service';
import { IConfig } from 'app/entities/config/config.model';
import { NgelmakAccountService } from 'app/entities/ngelmak-account/ngelmak-account.service';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'app-account-config',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './account-config.component.html',
  styleUrl: './account-config.component.scss'
})
export class AccountConfigComponent {
  private ngelmakAccountService = inject(NgelmakAccountService);
  account = inject(AccountService).trackCurrentAccount();
  isSaving = signal(false);
  flashBoxShadowState = null; // set to null to avoid flash box-shadow animation to first when the DOM starts.

  conifgForm = new FormGroup({
    id: new FormControl<number | null>(null),
    defaultAccessibility: new FormControl<string | null>(null, Validators.required),
    defaultVisibility: new FormControl<string | null>(null, Validators.required),
  });
  config: IConfig;

  ngOnInit(): void {
    this.ngelmakAccountService.findByCurrentUser().subscribe(response => {
      this.config = response.body.configuration;
      this.conifgForm.patchValue(this.config);
    });
  }

  save() {
    this.isSaving.set(true);
    this.flashBoxShadowState = true;
    const conifg: IConfig = this.conifgForm.value as IConfig;
    this.ngelmakAccountService.partialUpdate(conifg).subscribe({ complete: () => (this.isSaving.set(false)) });
  }
}
