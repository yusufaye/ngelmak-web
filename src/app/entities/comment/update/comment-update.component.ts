import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/post.service';
import { INgelmakAccount } from 'app/entities/ngelmak-account/ngelmak-account.model';
import { NgelmakAccountService } from 'app/entities/ngelmak-account/ngelmak-account.service';
import { Opinion } from 'app/entities/enumerations/opinion.model';
import { CommentService } from '../service/comment.service';
import { IComment } from '../comment.model';
import { CommentFormService, CommentFormGroup } from './comment-form.service';

@Component({
  standalone: true,
  selector: 'app-comment-update',
  templateUrl: './comment-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CommentUpdateComponent implements OnInit {
  isSaving = false;
  comment: IComment | null = null;
  opinionValues = Object.keys(Opinion);

  commentsSharedCollection: IComment[] = [];
  postsSharedCollection: IPost[] = [];
  ngelmakAccountsSharedCollection: INgelmakAccount[] = [];

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected commentService = inject(CommentService);
  protected commentFormService = inject(CommentFormService);
  protected postService = inject(PostService);
  protected ngelmakAccountService = inject(NgelmakAccountService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CommentFormGroup = this.commentFormService.createCommentFormGroup();

  compareComment = (o1: IComment | null, o2: IComment | null): boolean => this.commentService.compareComment(o1, o2);

  comparePost = (o1: IPost | null, o2: IPost | null): boolean => this.postService.comparePost(o1, o2);

  compareNgelmakAccount = (o1: INgelmakAccount | null, o2: INgelmakAccount | null): boolean =>
    this.ngelmakAccountService.compareNgelmakAccount(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comment }) => {
      this.comment = comment;
      if (comment) {
        this.updateForm(comment);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('ngelmakprojectApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const comment = this.commentFormService.getComment(this.editForm);
    if (comment.id !== null) {
      this.subscribeToSaveResponse(this.commentService.update(comment));
    } else {
      this.subscribeToSaveResponse(this.commentService.create(comment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComment>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(comment: IComment): void {
    this.comment = comment;
    this.commentFormService.resetForm(this.editForm, comment);

    this.commentsSharedCollection = this.commentService.addCommentToCollectionIfMissing<IComment>(
      this.commentsSharedCollection,
      comment.replayto,
    );
    this.postsSharedCollection = this.postService.addPostToCollectionIfMissing<IPost>(this.postsSharedCollection, comment.post);
    this.ngelmakAccountsSharedCollection = this.ngelmakAccountService.addNgelmakAccountToCollectionIfMissing<INgelmakAccount>(
      this.ngelmakAccountsSharedCollection,
      comment.account,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.commentService
      .query()
      .pipe(map((res: HttpResponse<IComment[]>) => res.body ?? []))
      .pipe(map((comments: IComment[]) => this.commentService.addCommentToCollectionIfMissing<IComment>(comments, this.comment?.replayto)))
      .subscribe((comments: IComment[]) => (this.commentsSharedCollection = comments));

    this.postService
      .query()
      .pipe(map((res: HttpResponse<IPost[]>) => res.body ?? []))
      .pipe(map((posts: IPost[]) => this.postService.addPostToCollectionIfMissing<IPost>(posts, this.comment?.post)))
      .subscribe((posts: IPost[]) => (this.postsSharedCollection = posts));

    this.ngelmakAccountService
      .query()
      .pipe(map((res: HttpResponse<INgelmakAccount[]>) => res.body ?? []))
      .pipe(
        map((ngelmakAccounts: INgelmakAccount[]) =>
          this.ngelmakAccountService.addNgelmakAccountToCollectionIfMissing<INgelmakAccount>(ngelmakAccounts, this.comment?.account),
        ),
      )
      .subscribe((ngelmakAccounts: INgelmakAccount[]) => (this.ngelmakAccountsSharedCollection = ngelmakAccounts));
  }
}
