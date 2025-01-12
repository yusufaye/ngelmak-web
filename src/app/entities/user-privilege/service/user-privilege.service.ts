import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { createRequestOption } from 'app/core/request/request-util';
import { IUserPrivilege } from '../nk-account-privilege.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

export type EntityResponseType = HttpResponse<IUserPrivilege>;
export type EntityArrayResponseType = HttpResponse<IUserPrivilege[]>;

@Injectable({ providedIn: 'root' })
export class UserPrivilegeService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/nk-account-privileges');

  create(userPrivilege: IUserPrivilege): Observable<EntityResponseType> {
    return this.http
      .post<IUserPrivilege>(this.resourceUrl, userPrivilege, { observe: 'response' });
  }

  update(userPrivilege: IUserPrivilege): Observable<EntityResponseType> {
    return this.http
      .put<IUserPrivilege>(`${this.resourceUrl}/${userPrivilege.id}`, userPrivilege, { observe: 'response' });
  }

  partialUpdate(userPrivilege: IUserPrivilege): Observable<EntityResponseType> {
    return this.http
      .patch<IUserPrivilege>(`${this.resourceUrl}/${userPrivilege.id}`, userPrivilege, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IUserPrivilege>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IUserPrivilege[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

}
