import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
;

import SharedModule from 'app/shared/shared.module';

import { IUserPrivilege } from '../nk-account-privilege.model';
import { UserPrivilegeService } from '../service/nk-account-privilege.service';

@Component({
  standalone: true,
  templateUrl: './nk-account-privilege-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class UserPrivilegeDeleteDialogComponent {
  userPrivilege?: IUserPrivilege;

  protected userPrivilegeService = inject(UserPrivilegeService);


  cancel(): void {
    // this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userPrivilegeService.delete(id).subscribe(() => {

    });
  }
}
