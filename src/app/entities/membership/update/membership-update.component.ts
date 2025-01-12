import { HttpResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import SharedModule from 'app/shared/shared.module';

import { INkAccount } from 'app/entities/nk-account/nk-account.model';
import { NkAccountService } from 'app/entities/nk-account/nk-account.service';
import { IMembership } from '../membership.model';
import { MembershipService } from '../service/membership.service';
import { MembershipFormGroup, MembershipFormService } from './membership-form.service';

@Component({
  standalone: true,
  selector: 'app-membership-update',
  templateUrl: './membership-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MembershipUpdateComponent implements OnInit {
  isSaving = false;
  membership: IMembership | null = null;

  nkAccountsSharedCollection: INkAccount[] = [];

  protected membershipService = inject(MembershipService);
  protected membershipFormService = inject(MembershipFormService);
  protected nkAccountService = inject(NkAccountService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: MembershipFormGroup = this.membershipFormService.createMembershipFormGroup();


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
    // this.membership = membership;
    // this.membershipFormService.resetForm(this.editForm, membership);

    // this.nkAccountsSharedCollection = this.nkAccountService.addNkAccountToCollectionIfMissing<INkAccount>(
    //   this.nkAccountsSharedCollection,
    //   membership.account,
    //   membership.subscriber,
    // );
  }

  protected loadRelationshipsOptions(): void {
    // this.nkAccountService
    //   .query()
    //   .pipe(map((res: HttpResponse<INkAccount[]>) => res.body ?? []))
    //   .pipe(
    //     map((nkAccounts: INkAccount[]) =>
    //       this.nkAccountService.addNkAccountToCollectionIfMissing<INkAccount>(
    //         nkAccounts,
    //         this.membership?.account,
    //         this.membership?.subscriber,
    //       ),
    //     ),
    //   )
    //   .subscribe((nkAccounts: INkAccount[]) => (this.nkAccountsSharedCollection = nkAccounts));
  }
}
