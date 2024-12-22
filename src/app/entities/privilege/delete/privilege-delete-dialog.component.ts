import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
;

import SharedModule from 'app/shared/shared.module';

import { IPrivilege } from '../privilege.model';
import { PrivilegeService } from '../service/privilege.service';

@Component({
  standalone: true,
  templateUrl: './privilege-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PrivilegeDeleteDialogComponent {
  privilege?: IPrivilege;

  protected privilegeService = inject(PrivilegeService);


  cancel(): void {
    // this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.privilegeService.delete(id).subscribe(() => {

    });
  }
}
