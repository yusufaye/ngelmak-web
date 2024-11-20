import { Component, inject, input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { DataUtils } from 'app/core/util/data-util.service';
import { IPost } from '../post.model';
import { PlyrModule } from '@atom-platform/ngx-plyr';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QuillModule } from 'ngx-quill';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { quillConfiguration } from 'app/shared/conts/quill-editor.config';

@Component({
  standalone: true,
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    MatTooltipModule,
    PlyrModule,
    QuillModule,
  ],
})
export class PostDetailComponent implements OnInit {
  post: IPost | null = null;

  protected dataUtils = inject(DataUtils);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);

  quillConfiguration = quillConfiguration;

  editForm = this.fb.group({
    id: [null],
    comment: ['', [Validators.required, Validators.minLength(20)]],
    account: [null],
  });

  // or get it from plyrInit event
  player: Plyr | null = null;

  videoSources: Plyr.Source[] = [
    {
      src: 'https://www.youtube.com/watch?v=H4XPqme2Qm8',
      provider: 'youtube',
    },
  ];

  played(event: Plyr.PlyrEvent) {
    console.log('played', event);
  }

  ngOnInit(): void {
    this.post = this.route.snapshot.data['post'];
  }

  save() {}

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
