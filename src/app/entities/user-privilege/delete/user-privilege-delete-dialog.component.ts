import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
;

import SharedModule from 'app/shared/shared.module';

import { UserPrivilegeService } from '../service/user-privilege.service';
import { IUserPrivilege } from '../user-privilege.model';

@Component({
  standalone: true,
  templateUrl: './user-privilege-delete-dialog.component.html',
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
