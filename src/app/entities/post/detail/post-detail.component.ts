import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";

import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import { IComment } from "app/entities/comment/comment.model";
import { CommentService } from "app/entities/comment/comment.service";
import { CommentUpdateComponent } from "app/entities/comment/update/comment-update.component";
import { NkAccountService } from "app/entities/nk-account/nk-account.service";
import { DurationPipe } from "app/shared/date";
import SharedModule from "app/shared/shared.module";
import { QuillModule } from "ngx-quill";
import { IPost } from "../post.model";

@Component({
  standalone: true,
  selector: "app-post-detail",
  templateUrl: "./post-detail.component.html",
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommentUpdateComponent,
    DurationPipe,
    SharedModule,
    RouterModule,
    MatTooltipModule,
    QuillModule,
  ],
})
export class PostDetailComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    // document.querySelectorAll("textarea").forEach((el) => {
    //   // el.style.height =
    //   el.setAttribute("style", "height: " + el.scrollHeight + "px");
    //   el.classList.add("auto");
    //   el.addEventListener("input", (e) => {
    //     el.style.height = "auto";
    //     el.style.height = el.scrollHeight + "px";
    //   });
    // });
  }
  post: IPost | null = null;
  comments = signal<IComment[]>([]);
  nkAccountService = inject(NkAccountService);
  nkAccount = inject(NkAccountService).trackCurrentUser();
  commentService = inject(CommentService);
  route = inject(ActivatedRoute);

  updatingComment = signal(null);

  ngOnInit(): void {
    this.post = this.route.snapshot.data["post"];
    this.nkAccountService.getAuthenticatedNkAccount().subscribe();
    this.loadAllComments();
  }

  sortReverse(comments: IComment[]): IComment[] {
    return comments.sort(
      (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
    );
  }

  onSaveSuccess(comment: IComment) {
    const comments = this.comments();
    const idx = comments.findIndex((item) => item.id == comment.id);
    if (idx >= 0) {
      comments[idx] = comment;
    } else {
      comments.push(comment);
    }
    this.updatingComment.set(null); // reset the updating.
    this.comments.set(comments);
  }

  loadAllComments() {
    this.commentService
      .findByPost(this.post.id)
      .subscribe((res) => this.comments.set(res.body));
  }

  deleteComment(id: number) {
    this.commentService.delete(id).subscribe(() => {
      this.comments.set(this.comments().filter((e) => e.id != id));
    });
  }

  previousState(): void {
    window.history.back();
  }
}
