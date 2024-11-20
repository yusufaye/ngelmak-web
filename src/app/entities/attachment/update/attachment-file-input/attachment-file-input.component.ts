import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IAttachment } from '../../attachment.model';
import { AttachmentCategory } from 'app/entities/enumerations/attachment-type.model';

@Component({
  standalone: true,
  selector: 'app-attachment-file-input',
  templateUrl: './attachment-file-input.component.html',
  styleUrl: './attachment-file-input.component.scss',
  imports: [CommonModule, MatDialogModule],
})
export class AttachmentFileInputComponent {
  attachment: IAttachment = null;

  readonly dialogRef = inject(MatDialogRef<AttachmentFileInputComponent>);

  onFileSelected(event) {
    const file: File = event.target.files[0];
    if (file) {
      this.attachment = {
        category: AttachmentCategory.DOCUMENT,
        type: file.type,
        name: file.name,
        content: file,
        size: file.size,
      } as IAttachment;
    }
  }

  save() {
    this.dialogRef.close(this.attachment);
  }
}
