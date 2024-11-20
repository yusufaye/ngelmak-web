import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IComment } from '../comment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IComment for edit and ICommentFormGroupInput for create.
 */
type CommentFormGroupInput = IComment | PartialWithRequiredKeyOf<IComment>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IComment | IComment> = Omit<T, 'at' | 'lastUpdate'> & {
  at?: string | null;
  lastUpdate?: string | null;
};

type CommentFormRawValue = FormValueOf<IComment>;

type ICommentFormRawValue = FormValueOf<IComment>;

type CommentFormDefaults = Pick<IComment, 'id' | 'at' | 'lastUpdate'>;

type CommentFormGroupContent = {
  id: FormControl<CommentFormRawValue['id'] | IComment['id']>;
  opinion: FormControl<CommentFormRawValue['opinion']>;
  at: FormControl<CommentFormRawValue['at']>;
  lastUpdate: FormControl<CommentFormRawValue['lastUpdate']>;
  content: FormControl<CommentFormRawValue['content']>;
  post: FormControl<CommentFormRawValue['post']>;
  replayto: FormControl<CommentFormRawValue['replayto']>;
  account: FormControl<CommentFormRawValue['account']>;
};

export type CommentFormGroup = FormGroup<CommentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CommentFormService {
  createCommentFormGroup(comment: CommentFormGroupInput = { id: null }): CommentFormGroup {
    const commentRawValue = this.convertCommentToCommentRawValue({
      ...this.getFormDefaults(),
      ...comment,
    });
    return new FormGroup<CommentFormGroupContent>({
      id: new FormControl(
        { value: commentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      opinion: new FormControl(commentRawValue.opinion, {
        validators: [Validators.required],
      }),
      at: new FormControl(commentRawValue.at, {
        validators: [Validators.required],
      }),
      lastUpdate: new FormControl(commentRawValue.lastUpdate),
      content: new FormControl(commentRawValue.content, {
        validators: [Validators.required],
      }),
      post: new FormControl(commentRawValue.post),
      replayto: new FormControl(commentRawValue.replayto),
      account: new FormControl(commentRawValue.account, {
        validators: [Validators.required],
      }),
    });
  }

  getComment(form: CommentFormGroup): IComment | IComment {
    return this.convertCommentRawValueToComment(form.getRawValue() as CommentFormRawValue | ICommentFormRawValue);
  }

  resetForm(form: CommentFormGroup, comment: CommentFormGroupInput): void {
    const commentRawValue = this.convertCommentToCommentRawValue({ ...this.getFormDefaults(), ...comment });
    form.reset(
      {
        ...commentRawValue,
        id: { value: commentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CommentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      at: currentTime,
      lastUpdate: currentTime,
    };
  }

  private convertCommentRawValueToComment(rawComment: CommentFormRawValue | ICommentFormRawValue): IComment | IComment {
    return {
      ...rawComment,
      at: dayjs(rawComment.at, DATE_TIME_FORMAT),
      lastUpdate: dayjs(rawComment.lastUpdate, DATE_TIME_FORMAT),
    };
  }

  private convertCommentToCommentRawValue(
    comment: IComment | (Partial<IComment> & CommentFormDefaults),
  ): CommentFormRawValue | PartialWithRequiredKeyOf<ICommentFormRawValue> {
    return {
      ...comment,
      at: comment.at ? comment.at.format(DATE_TIME_FORMAT) : undefined,
      lastUpdate: comment.lastUpdate ? comment.lastUpdate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
