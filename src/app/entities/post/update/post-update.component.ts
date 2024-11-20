import { IPost } from 'app/entities/post/post.model';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { INgelmakAccount } from 'app/entities/ngelmak-account/ngelmak-account.model';
import { NgelmakAccountService } from 'app/entities/ngelmak-account/ngelmak-account.service';
import { Subject } from 'app/entities/enumerations/subject.model';
import { Visibility } from 'app/entities/enumerations/visibility.model';
import { Status } from 'app/entities/enumerations/status.model';
import { PostService } from '../post.service';
import { MatInputModule } from '@angular/material/input';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AttachmentUpdateComponent } from 'app/entities/attachment/update/attachment-update.component';
import { IAttachment } from 'app/entities/attachment/attachment.model';

@Component({
  standalone: true,
  selector: 'app-post-update',
  templateUrl: './post-update.component.html',
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AttachmentUpdateComponent,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  encapsulation: ViewEncapsulation.None,  // Disable encapsulation
})
export class PostUpdateComponent implements OnInit {
  private dataUtils = inject(DataUtils);
  private eventManager = inject(EventManager);
  private postService = inject(PostService);
  private ngelmakAccountService = inject(NgelmakAccountService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  protected attachments: IAttachment[] = [];
  protected deletedAttachments: IAttachment[] = [];
  protected isSaving = false;
  protected post: IPost = null;
  protected subjectValues = Object.keys(Subject);
  protected visibilityValues = Object.keys(Visibility);
  protected statusValues = Object.keys(Status);
  protected keywords: string[] = []

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
  ngelmakAccountsSharedCollection: INgelmakAccount[] = [];

  postForm = new FormGroup({
    id: new FormControl(null),
    title: new FormControl(null, [Validators.required]),
    subtitle: new FormControl(null),
    keywords: new FormControl(null),
    subject: new FormControl(null, [Validators.required]),
    at: new FormControl(null),
    lastUpdate: new FormControl(null),
    visibility: new FormControl(null),
    content: new FormControl(null, [Validators.required, Validators.minLength(100)]),
    status: new FormControl(null),
    account: new FormControl(null),
  });

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ post }) => {
      this.post = post;
      this.attachments = this.post?.attachments || [];
      this.postForm.patchValue(this.post);
      this.keywords = this.post?.keywords.split(',') || [];
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
    this.dataUtils.loadFileToForm(event, this.postForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('ngelmakprojectApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  save(): void {
    this.isSaving = true;
    const keywords = this.keywords.reduce((previousValue: string, currentValue: string) => `${previousValue},${currentValue}`);
    const post: IPost = { ...this.postForm.value, keywords };
    if (post.id !== null) {
      const newattachments = this.attachments.filter(attachment => !attachment.id); // save only the new attachments
      const deletedAttachments = this.deletedAttachments.map(attachment => ({ ...attachment, content: null }));
      this.subscribeToSaveResponse(this.postService.update(post, newattachments, deletedAttachments));
    } else {
      const newattachments = this.attachments.map(attachment => ({ ...attachment })); // copy the object
      this.subscribeToSaveResponse(this.postService.create(post, newattachments));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPost>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
      complete: () => (this.isSaving = false)
    });
  }

  protected onSaveSuccess(): void {
    this.router.navigate(['/post']);
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(post: IPost): void {
    this.post = post;
    // this.postFormService.resetForm(this.postForm, post);

    this.ngelmakAccountsSharedCollection = this.ngelmakAccountService.addNgelmakAccountToCollectionIfMissing<INgelmakAccount>(
      this.ngelmakAccountsSharedCollection,
      post.account,
    );
  }

  protected loadRelationshipsOptions(): void {
    // this.ngelmakAccountService
    //   .query()
    //   .pipe(map((res: HttpResponse<INgelmakAccount[]>) => res.body ?? []))
    //   .pipe(
    //     map((ngelmakAccounts: INgelmakAccount[]) =>
    //       this.ngelmakAccountService.addNgelmakAccountToCollectionIfMissing<INgelmakAccount>(ngelmakAccounts, this.post?.account),
    //     ),
    //   )
    //   .subscribe((ngelmakAccounts: INgelmakAccount[]) => (this.ngelmakAccountsSharedCollection = ngelmakAccounts));
  }

  protected addkeyword(event: MatChipInputEvent) {
    const keyword = (event.value || '').trim();
    if (keyword.length > 0) {
      this.keywords.push('#' + keyword);
    }
  }

  protected removekeyword(i: number) {
    this.keywords = this.keywords.filter((value, index) => index != i);
  }

  previousState(): void {
    window.history.back();
  }
}
