import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
;

import SharedModule from 'app/shared/shared.module';

import { INgelmakAccount } from '../ngelmak-account.model';
import { NgelmakAccountService } from '../ngelmak-account.service';

@Component({
  standalone: true,
  templateUrl: './ngelmak-account-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class NgelmakAccountDeleteDialogComponent {
  ngelmakAccount?: INgelmakAccount;

  protected ngelmakAccountService = inject(NgelmakAccountService);


  cancel(): void {
    // this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ngelmakAccountService.delete(id).subscribe(() => {

    });
  }
}
