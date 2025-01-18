import { HttpClient, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";


import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";
import { IAttachment } from "app/entities/attachment/attachment.model";
import { AttachmentCategory } from "app/entities/enumerations/attachment-type.model";
import { IPage } from "app/shared/pagination/pagination.model";
import { IPost } from "./post.model";

export type EntityResponseType = HttpResponse<IPost>;
export type EntityArrayResponseType = HttpResponse<IPost[]>;

@Injectable({ providedIn: "root" })
export class PostService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl =
    this.applicationConfigService.getEndpointFor("api/posts");

  create(
    post: IPost,
    attachments: IAttachment[]
  ): Observable<EntityResponseType> {
    const data: FormData = new FormData();
    attachments.forEach((attachment) => {
      if (attachment.category != AttachmentCategory.TEXT) {
        data.append("files", attachment.content, attachment.filename);
        attachment.content = null;
      }
    });
    data.append(
      "post",
      new Blob([JSON.stringify(post)], { type: "application/json" })
    );
    data.append(
      "attachments",
      new Blob([JSON.stringify(attachments)], { type: "application/json" })
    );
    return this.http.post<IPost>(this.resourceUrl, data, {
      observe: "response",
    });
  }

  update(
    post: IPost,
    attachments: IAttachment[],
    deletedAttachments: IAttachment[]
  ): Observable<EntityResponseType> {
    const data: FormData = new FormData();
    attachments.forEach((attachment) => {
      if (attachment.category != AttachmentCategory.TEXT) {
        data.append("files", attachment.content, attachment.filename);
        attachment.content = null;
      }
    });
    data.append(
      "post",
      new Blob([JSON.stringify(post)], { type: "application/json" })
    );
    data.append(
      "attachments",
      new Blob([JSON.stringify(attachments)], { type: "application/json" })
    );
    data.append(
      "deletedAttachments",
      new Blob([JSON.stringify(deletedAttachments)], {
        type: "application/json",
      })
    );
    return this.http.put<IPost>(this.resourceUrl, data, {
      observe: "response",
    });
  }

  partialUpdate(post: IPost): Observable<EntityResponseType> {
    return this.http.patch<IPost>(`${this.resourceUrl}/${post.id}`, post, {
      observe: "response",
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPost>(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  findByCurrentUser(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPost[]>(`${this.resourceUrl}/current-user`, {
      params: options,
      observe: "response",
    });
  }

  search(req?: any): Observable<HttpResponse<IPage<IPost>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<IPost>>(`${this.resourceUrl}/search`, {
      params: options,
      observe: "response",
    });
  }

  query(req?: any): Observable<HttpResponse<IPage<IPost>>> {
    const options = createRequestOption(req);
    return this.http.get<IPage<IPost>>(this.resourceUrl, {
      params: options,
      observe: "response",
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }
}
