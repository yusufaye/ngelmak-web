import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
;

import SharedModule from 'app/shared/shared.module';

import { IAttachment } from '../attachment.model';
import { AttachmentService } from '../service/attachment.service';

@Component({
  standalone: true,
  templateUrl: './attachment-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AttachmentDeleteDialogComponent {
  attachment?: IAttachment;

  protected attachmentService = inject(AttachmentService);


  cancel(): void {
    // this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.attachmentService.delete(id).subscribe(() => {

    });
  }
}
