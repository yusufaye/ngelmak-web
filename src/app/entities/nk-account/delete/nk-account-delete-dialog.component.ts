import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
;

import SharedModule from 'app/shared/shared.module';

import { INkAccount } from 'app/entities/models/nk-account.model';
import { NkAccountService } from '../nk-account.service';

@Component({
  standalone: true,
  templateUrl: './nk-account-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class NkAccountDeleteDialogComponent {
  nkAccount?: INkAccount;

  protected nkAccountService = inject(NkAccountService);


  cancel(): void {
    // this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.nkAccountService.delete(id).subscribe(() => {

    });
  }
}
