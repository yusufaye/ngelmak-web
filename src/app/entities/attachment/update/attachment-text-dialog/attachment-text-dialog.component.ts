import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { QuillModule } from 'ngx-quill';
import { IAttachment } from '../../attachment.model';
import { CommonModule } from '@angular/common';
import { AttachmentCategory } from 'app/entities/enumerations/attachment-type.model';

@Component({
  selector: 'app-attachment-text-dialog',
  standalone: true,
  templateUrl: './attachment-text-dialog.component.html',
  styleUrl: './attachment-text-dialog.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    QuillModule,
  ],
})
export class AttachmentTextDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AttachmentTextDialogComponent>);

  content: string = '';

  // quillConfiguration = quillConfiguration;
  quillConfiguration = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ 'size': [false, 'small', 'large', 'huge'] }],  // custom dropdown
      ['link'],
      ['clean'],
    ],
  };

  save() {
    this.dialogRef.close({
      type: 'text',
      category: AttachmentCategory.TEXT,
      content: this.content,
    } as IAttachment);
  }
}
