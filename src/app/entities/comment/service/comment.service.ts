import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IComment } from '../comment.model';

export type PartialUpdateComment = Partial<IComment> & Pick<IComment, 'id'>;

type RestOf<T extends IComment | IComment> = Omit<T, 'at' | 'lastUpdate'> & {
  at?: string | null;
  lastUpdate?: string | null;
};

export type RestComment = RestOf<IComment>;

export type NewRestComment = RestOf<IComment>;

export type PartialUpdateRestComment = RestOf<PartialUpdateComment>;

export type EntityResponseType = HttpResponse<IComment>;
export type EntityArrayResponseType = HttpResponse<IComment[]>;

@Injectable({ providedIn: 'root' })
export class CommentService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/comments');

  create(comment: IComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(comment);
    return this.http
      .post<RestComment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(comment: IComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(comment);
    return this.http
      .put<RestComment>(`${this.resourceUrl}/${this.getCommentIdentifier(comment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(comment: PartialUpdateComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(comment);
    return this.http
      .patch<RestComment>(`${this.resourceUrl}/${this.getCommentIdentifier(comment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestComment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestComment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCommentIdentifier(comment: Pick<IComment, 'id'>): number {
    return comment.id;
  }

  compareComment(o1: Pick<IComment, 'id'> | null, o2: Pick<IComment, 'id'> | null): boolean {
    return o1 && o2 ? this.getCommentIdentifier(o1) === this.getCommentIdentifier(o2) : o1 === o2;
  }

  addCommentToCollectionIfMissing<Type extends Pick<IComment, 'id'>>(
    commentCollection: Type[],
    ...commentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const comments: Type[] = commentsToCheck.filter(isPresent);
    if (comments.length > 0) {
      const commentCollectionIdentifiers = commentCollection.map(commentItem => this.getCommentIdentifier(commentItem));
      const commentsToAdd = comments.filter(commentItem => {
        const commentIdentifier = this.getCommentIdentifier(commentItem);
        if (commentCollectionIdentifiers.includes(commentIdentifier)) {
          return false;
        }
        commentCollectionIdentifiers.push(commentIdentifier);
        return true;
      });
      return [...commentsToAdd, ...commentCollection];
    }
    return commentCollection;
  }

  protected convertDateFromClient<T extends IComment | IComment | PartialUpdateComment>(comment: T): RestOf<T> {
    return {
      ...comment,
      at: comment.at?.toJSON() ?? null,
      lastUpdate: comment.lastUpdate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restComment: RestComment): IComment {
    return {
      ...restComment,
      at: restComment.at ? dayjs(restComment.at) : undefined,
      lastUpdate: restComment.lastUpdate ? dayjs(restComment.lastUpdate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestComment>): HttpResponse<IComment> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestComment[]>): HttpResponse<IComment[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
