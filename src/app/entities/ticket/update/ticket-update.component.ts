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
import { IComment } from 'app/entities/comment/comment.model';
import { CommentService } from 'app/entities/comment/service/comment.service';
import { INgelmakAccount } from 'app/entities/ngelmak-account/ngelmak-account.model';
import { NgelmakAccountService } from 'app/entities/ngelmak-account/ngelmak-account.service';
import { TicketType } from 'app/entities/enumerations/ticket-type.model';
import { TicketService } from '../service/ticket.service';
import { ITicket } from '../ticket.model';
import { TicketFormService, TicketFormGroup } from './ticket-form.service';

@Component({
  standalone: true,
  selector: 'app-ticket-update',
  templateUrl: './ticket-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TicketUpdateComponent implements OnInit {
  isSaving = false;
  ticket: ITicket | null = null;
  ticketTypeValues = Object.keys(TicketType);

  postsSharedCollection: IPost[] = [];
  commentsSharedCollection: IComment[] = [];
  ngelmakAccountsSharedCollection: INgelmakAccount[] = [];

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected ticketService = inject(TicketService);
  protected ticketFormService = inject(TicketFormService);
  protected postService = inject(PostService);
  protected commentService = inject(CommentService);
  protected ngelmakAccountService = inject(NgelmakAccountService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TicketFormGroup = this.ticketFormService.createTicketFormGroup();

  comparePost = (o1: IPost | null, o2: IPost | null): boolean => this.postService.comparePost(o1, o2);

  compareComment = (o1: IComment | null, o2: IComment | null): boolean => this.commentService.compareComment(o1, o2);

  compareNgelmakAccount = (o1: INgelmakAccount | null, o2: INgelmakAccount | null): boolean =>
    this.ngelmakAccountService.compareNgelmakAccount(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ticket }) => {
      this.ticket = ticket;
      if (ticket) {
        this.updateForm(ticket);
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
    const ticket = this.ticketFormService.getTicket(this.editForm);
    if (ticket.id !== null) {
      this.subscribeToSaveResponse(this.ticketService.update(ticket));
    } else {
      this.subscribeToSaveResponse(this.ticketService.create(ticket));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITicket>>): void {
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

  protected updateForm(ticket: ITicket): void {
    this.ticket = ticket;
    this.ticketFormService.resetForm(this.editForm, ticket);

    this.postsSharedCollection = this.postService.addPostToCollectionIfMissing<IPost>(this.postsSharedCollection, ticket.postRelated);
    this.commentsSharedCollection = this.commentService.addCommentToCollectionIfMissing<IComment>(
      this.commentsSharedCollection,
      ticket.commentRelated,
    );
    this.ngelmakAccountsSharedCollection = this.ngelmakAccountService.addNgelmakAccountToCollectionIfMissing<INgelmakAccount>(
      this.ngelmakAccountsSharedCollection,
      ticket.accountRelated,
      ticket.issuedby,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.postService
      .query()
      .pipe(map((res: HttpResponse<IPost[]>) => res.body ?? []))
      .pipe(map((posts: IPost[]) => this.postService.addPostToCollectionIfMissing<IPost>(posts, this.ticket?.postRelated)))
      .subscribe((posts: IPost[]) => (this.postsSharedCollection = posts));

    this.commentService
      .query()
      .pipe(map((res: HttpResponse<IComment[]>) => res.body ?? []))
      .pipe(
        map((comments: IComment[]) => this.commentService.addCommentToCollectionIfMissing<IComment>(comments, this.ticket?.commentRelated)),
      )
      .subscribe((comments: IComment[]) => (this.commentsSharedCollection = comments));

    this.ngelmakAccountService
      .query()
      .pipe(map((res: HttpResponse<INgelmakAccount[]>) => res.body ?? []))
      .pipe(
        map((ngelmakAccounts: INgelmakAccount[]) =>
          this.ngelmakAccountService.addNgelmakAccountToCollectionIfMissing<INgelmakAccount>(
            ngelmakAccounts,
            this.ticket?.accountRelated,
            this.ticket?.issuedby,
          ),
        ),
      )
      .subscribe((ngelmakAccounts: INgelmakAccount[]) => (this.ngelmakAccountsSharedCollection = ngelmakAccounts));
  }
}
