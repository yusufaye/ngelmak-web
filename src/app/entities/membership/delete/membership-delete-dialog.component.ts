import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
;

import SharedModule from 'app/shared/shared.module';

import { IMembership } from '../membership.model';
import { MembershipService } from '../service/membership.service';

@Component({
  standalone: true,
  templateUrl: './membership-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MembershipDeleteDialogComponent {
  membership?: IMembership;

  protected membershipService = inject(MembershipService);


  cancel(): void {
    // this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.membershipService.delete(id).subscribe(() => {

    });
  }
}
