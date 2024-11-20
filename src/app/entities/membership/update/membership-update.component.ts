import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { INgelmakAccount } from 'app/entities/ngelmak-account/ngelmak-account.model';
import { NgelmakAccountService } from 'app/entities/ngelmak-account/ngelmak-account.service';
import { IMembership } from '../membership.model';
import { MembershipService } from '../service/membership.service';
import { MembershipFormService, MembershipFormGroup } from './membership-form.service';

@Component({
  standalone: true,
  selector: 'app-membership-update',
  templateUrl: './membership-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MembershipUpdateComponent implements OnInit {
  isSaving = false;
  membership: IMembership | null = null;

  ngelmakAccountsSharedCollection: INgelmakAccount[] = [];

  protected membershipService = inject(MembershipService);
  protected membershipFormService = inject(MembershipFormService);
  protected ngelmakAccountService = inject(NgelmakAccountService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: MembershipFormGroup = this.membershipFormService.createMembershipFormGroup();

  compareNgelmakAccount = (o1: INgelmakAccount | null, o2: INgelmakAccount | null): boolean =>
    this.ngelmakAccountService.compareNgelmakAccount(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ membership }) => {
      this.membership = membership;
      if (membership) {
        this.updateForm(membership);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const membership = this.membershipFormService.getMembership(this.editForm);
    if (membership.id !== null) {
      this.subscribeToSaveResponse(this.membershipService.update(membership));
    } else {
      this.subscribeToSaveResponse(this.membershipService.create(membership));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMembership>>): void {
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

  protected updateForm(membership: IMembership): void {
    this.membership = membership;
    this.membershipFormService.resetForm(this.editForm, membership);

    this.ngelmakAccountsSharedCollection = this.ngelmakAccountService.addNgelmakAccountToCollectionIfMissing<INgelmakAccount>(
      this.ngelmakAccountsSharedCollection,
      membership.account,
      membership.subscriber,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ngelmakAccountService
      .query()
      .pipe(map((res: HttpResponse<INgelmakAccount[]>) => res.body ?? []))
      .pipe(
        map((ngelmakAccounts: INgelmakAccount[]) =>
          this.ngelmakAccountService.addNgelmakAccountToCollectionIfMissing<INgelmakAccount>(
            ngelmakAccounts,
            this.membership?.account,
            this.membership?.subscriber,
          ),
        ),
      )
      .subscribe((ngelmakAccounts: INgelmakAccount[]) => (this.ngelmakAccountsSharedCollection = ngelmakAccounts));
  }
}
