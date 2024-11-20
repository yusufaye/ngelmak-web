import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPost } from './post.model';
import { IAttachment } from 'app/entities/attachment/attachment.model';
import { AttachmentCategory } from 'app/entities/enumerations/attachment-type.model';


export type EntityResponseType = HttpResponse<IPost>;
export type EntityArrayResponseType = HttpResponse<IPost[]>;

@Injectable({ providedIn: 'root' })
export class PostService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/posts');

  create(post: IPost, attachments: IAttachment[]): Observable<EntityResponseType> {
    const data: FormData = new FormData();
    attachments.forEach(attachment => {
      if (attachment.category != AttachmentCategory.TEXT) {
        data.append('files', attachment.content, attachment.filename);
        attachment.content = null;
      }
    });
    data.append('post', new Blob([JSON.stringify(post)], { type: 'application/json' }));
    data.append('attachments', new Blob([JSON.stringify(attachments)], { type: 'application/json' }));
    return this.http.post<IPost>(this.resourceUrl, data, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(post: IPost, attachments: IAttachment[], deletedAttachments: IAttachment[]): Observable<EntityResponseType> {
    const data: FormData = new FormData();
    attachments.forEach(attachment => {
      if (attachment.category != AttachmentCategory.TEXT) {
        data.append('files', attachment.content, attachment.filename);
        attachment.content = null;
      }
    });
    data.append('post', new Blob([JSON.stringify(post)], { type: 'application/json' }));
    data.append('attachments', new Blob([JSON.stringify(attachments)], { type: 'application/json' }));
    data.append('deletedAttachments', new Blob([JSON.stringify(deletedAttachments)], { type: 'application/json' }));
    return this.http
      .put<IPost>(this.resourceUrl, data, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(post: IPost): Observable<EntityResponseType> {
    return this.http
      .patch<IPost>(`${this.resourceUrl}/${post.id}`, post, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPost>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  findByCurrentUser(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPost[]>(`${this.resourceUrl}/current-user`, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPost[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  comparePost(o1: Pick<IPost, 'id'> | null, o2: Pick<IPost, 'id'> | null): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  addPostToCollectionIfMissing<Type extends Pick<IPost, 'id'>>(
    postCollection: Type[],
    ...postsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const posts: Type[] = postsToCheck.filter(isPresent);
    if (posts.length > 0) {
      const postCollectionIdentifiers = postCollection.map(postItem => postItem.id);
      const postsToAdd = posts.filter(postItem => {
        const postIdentifier = postItem.id;
        if (postCollectionIdentifiers.includes(postIdentifier)) {
          return false;
        }
        postCollectionIdentifiers.push(postIdentifier);
        return true;
      });
      return [...postsToAdd, ...postCollection];
    }
    return postCollection;
  }

  protected convertDateFromServer(restPost: IPost): IPost {
    return {
      ...restPost,
      at: restPost.at ? dayjs(restPost.at) : undefined,
      lastUpdate: restPost.lastUpdate ? dayjs(restPost.lastUpdate) : undefined,
    };
  }

  protected convertResponseFromServer(res: EntityResponseType): EntityResponseType {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
