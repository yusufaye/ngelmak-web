import { IAttachment } from 'app/entities/attachment/attachment.model';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EventManager } from 'app/core/util/event-manager.service';
import { DataUtils } from 'app/core/util/data-util.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/post.service';
import { AttachmentCategory } from 'app/entities/enumerations/attachment-type.model';
import { AttachmentService } from '../service/attachment.service';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AttachmentTextDialogComponent } from './attachment-text-dialog/attachment-text-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AudioPlyrComponent } from 'app/shared/audio-plyr/audio-plyr.component';
import { AttachmentFileInputComponent } from './attachment-file-input/attachment-file-input.component';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import { scaleInOut400ms } from 'app/shared/animations/scale-in-out.animation';
import { RemoveHtmlPipe } from 'app/shared/pipes/remove-html.pipe';
import { scaleInOutAnimation150ms } from 'app/shared/animations/stagger.animation';
import { AttachmentVoiceRecoderComponent } from './attachment-voice-recorder/attachment-voice-recorder.component';


@Component({
  standalone: true,
  selector: 'app-attachment-update',
  templateUrl: './attachment-update.component.html',
  styleUrl: './attachment-update.component.scss',
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatTooltipModule,
    AudioPlyrComponent,
    MatTooltipModule,
    RemoveHtmlPipe,
  ],
  animations: [fadeInUp400ms, scaleInOut400ms, scaleInOutAnimation150ms],
})
export class AttachmentUpdateComponent implements OnInit {
  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected attachmentService = inject(AttachmentService);
  protected postService = inject(PostService);
  protected activatedRoute = inject(ActivatedRoute);

  @Input() attachments: IAttachment[] = [];
  @Input() deletedAttachments: IAttachment[] = [];
  _attachments = signal<IAttachment[]>(null);

  attachmentTypeValues = Object.keys(AttachmentCategory);
  TEXT = AttachmentCategory.TEXT;
  VIDEO = AttachmentCategory.VIDEO;
  DOCUMENT = AttachmentCategory.DOCUMENT;
  VOICE_RECORDED = AttachmentCategory.VOICE_RECORDED;
  postsSharedCollection: IPost[] = [];

  comparePost = (o1: IPost | null, o2: IPost | null): boolean => this.postService.comparePost(o1, o2);
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.load_data();
  }

  load_data(): void {
    this._attachments.set(this.attachments.sort(e => e.position));
  }

  // toggleDropdown() {
  //   const dropdownMenu = document.getElementById('dropdownMenu');
  //   if (dropdownMenu) {
  //     dropdownMenu.classList.toggle('hidden'); // Toggle the 'hidden' class to show/hide the menu
  //   }
  // }

  openAttachmentTextDialog(position?: number): void {
    const dialogRef = this.dialog.open(AttachmentTextDialogComponent, {
      disableClose: true,
      width: '90vw',
      maxWidth: '100vw',
      maxHeight: '90vw',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '150ms',
    });
    const index = this.attachments.findIndex(e => e.id == position);
    if (index > -1) {
      dialogRef.componentInstance.content = this.attachments[index].content;
    }

    dialogRef.afterClosed().subscribe((attachment: IAttachment) => this.afterClosed(position, attachment));
  }

  openAttachmentVoiceRecoder(position?: number): void {
    const dialogRef = this.dialog.open(AttachmentVoiceRecoderComponent, {
      disableClose: true,
      width: '500px',
      height: '350px',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '150ms',
    });

    dialogRef.afterClosed().subscribe((attachment: IAttachment) => this.afterClosed(position, attachment));
  }

  openAttachmentFileInput(position?: number): void {
    const dialogRef = this.dialog.open(AttachmentFileInputComponent, {
      disableClose: true,
      width: '500px',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '150ms',
    });

    dialogRef.afterClosed().subscribe((attachment: IAttachment) => this.afterClosed(position, attachment));
  }

  private afterClosed(position?: number, attachment?: IAttachment) {
    if (attachment) {
      if (position) {
        this.replace(position, attachment);
      } else {
        this.add(attachment);
      }
    }
  }

  remove(attachment: IAttachment) {
    if (attachment.id) {
      this.deletedAttachments.push(attachment);
    }
    this.attachments = this.attachments.filter(e => e.position != attachment.position);
    this.load_data();
  }

  add(attachment: IAttachment) {
    if (attachment.position && attachment.position > 0) {
      const index = this.attachments.findIndex(e => e.position == attachment.position);
      if (index >= 0) {
        this.attachments[index] = attachment;
      }
    } else {
      const positions = this.attachments.map(e => e.position);
      attachment.position = Math.max(...positions, 1) + 1;
      this.attachments.push(attachment);
    }
    this.load_data();
  }

  replace(position: number, attachment: IAttachment) {
    const index = this.attachments.findIndex(e => e.position == position);
    const tmp = this.attachments[index];
    if (tmp.id) {
      this.deletedAttachments.push(tmp);
    }
    attachment.position = position; // update attachment's position.
    this.attachments[index] = attachment; // now replace the former attachment with the new one.
    this.load_data();
  }

  protected moveup(attachment: IAttachment) {
    this.attachments = this.attachments.sort(e => e.position);
    const index = this.attachments.findIndex(e => e.position == attachment.position);
    const switch_with_index: number = (index > 0) ? index - 1 : this.attachments.length - 1;
    const tmp: IAttachment = this.attachments[index];
    this.attachments[index] = this.attachments[switch_with_index];
    this.attachments[switch_with_index] = tmp;
    this.attachments = this.attachments.map((element, i) => {
      element.position = (i + 1);
      return element;
    });
    this.load_data();
  }

  protected movedown(attachment: IAttachment) {
    this.attachments = this.attachments.sort(e => e.position);
    const index = this.attachments.findIndex(e => e.position == attachment.position);
    const switch_with_index: number = (index < this.attachments.length - 1) ? index + 1 : 0;
    const tmp: IAttachment = this.attachments[index];
    this.attachments[index] = this.attachments[switch_with_index];
    this.attachments[switch_with_index] = tmp;
    this.attachments = this.attachments.map((element, i) => {
      element.position = (i + 1);
      return element;
    });
    this.load_data();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  // createGroupsByCategory(): void {
  //   if (this.attachments.length == 0)
  //     return;
  //   let category: AttachmentCategory = this.attachments[0].category;
  //   this.groups = [{ category, elements: [this.attachments[0]], }];
  //   let group = 0;
  //   for (let index = 1; index < this.attachments.length; index++) {
  //     if (this.attachments[index].category == category) {
  //       /* ADD THE EXISTING GROUP */
  //       this.groups[group].elements.push(this.attachments[index]);
  //     } else {
  //       /* NEW GROUP */
  //       category = this.attachments[index].category;
  //       this.groups.push({ category, elements: [this.attachments[index]], });
  //       group += 1;
  //     }
  //   }
  // }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  // setFileData(event: Event, field: string, isImage: boolean): void {
  //   thifs.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
  //     error: (err: FileLoadError) =>
  //       this.eventManager.broadcast(new EventWithContent<AlertError>('ngelmakprojectApp.error', { ...err, key: 'error.file.' + err.key })),
  //   });
  // }

  previousState(): void {
    window.history.back();
  }

  // save(): void {
  //   this.isSaving = true;
  //   const attachment = this.attachmentFormService.getAttachment(this.editForm);
  //   if (attachment.id !== null) {
  //     this.subscribeToSaveResponse(this.attachmentService.update(attachment));
  //   } else {
  //     this.subscribeToSaveResponse(this.attachmentService.create(attachment));
  //   }
  // }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  show(item) {
    console.log(item);
    item.isHidden = !item.isHidden;
  }

  expandedIndexes: Set<number> = new Set<number>();

  toggleExpand(index: number) {
    if (this.expandedIndexes.has(index)) {
      this.expandedIndexes.delete(index);
    } else {
      this.expandedIndexes.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedIndexes.has(index);
  }
  // formatDropdown(attachments:IAttachment[]){
  //   return attachments.map(attachment => {
  //       attachment.isHidden = true
  //       attachment,
  //       isHidden: true,
  //   })
  // }

  filterAttachment(attachments: IAttachment[], category: AttachmentCategory = AttachmentCategory.TEXT): IAttachment[] {
    return attachments.filter(e => e.category === category);
  }

  toURL(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  getSources(attachment: IAttachment) {
    let sources = [];
    if (attachment.type == AttachmentCategory.VOICE_RECORDED) {
      sources = [
        {
          src: URL.createObjectURL(attachment.content),
          type: 'audio/mp3',
        },
      ];
    }
    return sources;
  }
}
