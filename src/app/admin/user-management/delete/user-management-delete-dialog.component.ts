import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
;

import SharedModule from 'app/shared/shared.module';
import { User } from '../user-management.model';
import { UserManagementService } from '../service/user-management.service';

@Component({
  standalone: true,
  selector: 'app-user-mgmt-delete-dialog',
  templateUrl: './user-management-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export default class UserManagementDeleteDialogComponent {
  user?: User;

  private userService = inject(UserManagementService);


  cancel(): void {
    // this.activeModal.dismiss();
  }

  confirmDelete(login: string): void {
    this.userService.delete(login).subscribe(() => {
      // this.activeModal.close('deleted');
    });
  }
}