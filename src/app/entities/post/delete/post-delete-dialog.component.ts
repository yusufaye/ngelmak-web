import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
;

import SharedModule from 'app/shared/shared.module';

import { IPost } from '../post.model';
import { PostService } from '../post.service';

@Component({
  standalone: true,
  templateUrl: './post-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PostDeleteDialogComponent {
  post?: IPost;

  protected postService = inject(PostService);


  cancel(): void {
    // this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.postService.delete(id).subscribe(() => {

    });
  }
}
