import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { INgelmakAccount } from 'app/entities/ngelmak-account/ngelmak-account.model';
import { NgelmakAccountService } from 'app/entities/ngelmak-account/ngelmak-account.service';
import { ITicket } from 'app/entities/ticket/ticket.model';
import { TicketService } from 'app/entities/ticket/service/ticket.service';
import { Status } from 'app/entities/enumerations/status.model';
import { ReviewService } from '../service/review.service';
import { IReview } from '../review.model';
import { ReviewFormService, ReviewFormGroup } from './review-form.service';

@Component({
  standalone: true,
  selector: 'app-review-update',
  templateUrl: './review-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ReviewUpdateComponent implements OnInit {
  isSaving = false;
  review: IReview | null = null;
  statusValues = Object.keys(Status);

  reviewsSharedCollection: IReview[] = [];
  ngelmakAccountsSharedCollection: INgelmakAccount[] = [];
  ticketsSharedCollection: ITicket[] = [];

  protected reviewService = inject(ReviewService);
  protected reviewFormService = inject(ReviewFormService);
  protected ngelmakAccountService = inject(NgelmakAccountService);
  protected ticketService = inject(TicketService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ReviewFormGroup = this.reviewFormService.createReviewFormGroup();

  compareReview = (o1: IReview | null, o2: IReview | null): boolean => this.reviewService.compareReview(o1, o2);

  compareNgelmakAccount = (o1: INgelmakAccount | null, o2: INgelmakAccount | null): boolean =>
    this.ngelmakAccountService.compareNgelmakAccount(o1, o2);

  compareTicket = (o1: ITicket | null, o2: ITicket | null): boolean => this.ticketService.compareTicket(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ review }) => {
      this.review = review;
      if (review) {
        this.updateForm(review);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const review = this.reviewFormService.getReview(this.editForm);
    if (review.id !== null) {
      this.subscribeToSaveResponse(this.reviewService.update(review));
    } else {
      this.subscribeToSaveResponse(this.reviewService.create(review));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReview>>): void {
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

  protected updateForm(review: IReview): void {
    this.review = review;
    this.reviewFormService.resetForm(this.editForm, review);

    this.reviewsSharedCollection = this.reviewService.addReviewToCollectionIfMissing<IReview>(this.reviewsSharedCollection, review.replyto);
    this.ngelmakAccountsSharedCollection = this.ngelmakAccountService.addNgelmakAccountToCollectionIfMissing<INgelmakAccount>(
      this.ngelmakAccountsSharedCollection,
      review.account,
    );
    this.ticketsSharedCollection = this.ticketService.addTicketToCollectionIfMissing<ITicket>(this.ticketsSharedCollection, review.ticket);
  }

  protected loadRelationshipsOptions(): void {
    this.reviewService
      .query()
      .pipe(map((res: HttpResponse<IReview[]>) => res.body ?? []))
      .pipe(map((reviews: IReview[]) => this.reviewService.addReviewToCollectionIfMissing<IReview>(reviews, this.review?.replyto)))
      .subscribe((reviews: IReview[]) => (this.reviewsSharedCollection = reviews));

    this.ngelmakAccountService
      .query()
      .pipe(map((res: HttpResponse<INgelmakAccount[]>) => res.body ?? []))
      .pipe(
        map((ngelmakAccounts: INgelmakAccount[]) =>
          this.ngelmakAccountService.addNgelmakAccountToCollectionIfMissing<INgelmakAccount>(ngelmakAccounts, this.review?.account),
        ),
      )
      .subscribe((ngelmakAccounts: INgelmakAccount[]) => (this.ngelmakAccountsSharedCollection = ngelmakAccounts));

    this.ticketService
      .query()
      .pipe(map((res: HttpResponse<ITicket[]>) => res.body ?? []))
      .pipe(map((tickets: ITicket[]) => this.ticketService.addTicketToCollectionIfMissing<ITicket>(tickets, this.review?.ticket)))
      .subscribe((tickets: ITicket[]) => (this.ticketsSharedCollection = tickets));
  }
}
