import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
;

import SharedModule from 'app/shared/shared.module';

import { IComment } from '../comment.model';
import { CommentService } from '../service/comment.service';

@Component({
  standalone: true,
  templateUrl: './comment-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CommentDeleteDialogComponent {
  comment?: IComment;

  protected commentService = inject(CommentService);


  cancel(): void {
    // this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.commentService.delete(id).subscribe(() => {

    });
  }
}
