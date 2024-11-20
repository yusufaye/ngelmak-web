import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INgelmakAccount } from './ngelmak-account.model';
import { IHttpRestApiService } from 'app/entities/entity.service';

export type EntityResponseType = HttpResponse<INgelmakAccount>;
export type EntityArrayResponseType = HttpResponse<INgelmakAccount[]>;

@Injectable({ providedIn: 'root' })
export class NgelmakAccountService implements IHttpRestApiService<INgelmakAccount> {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ngelmak-accounts');

  create(ngelmakAccount: INgelmakAccount): Observable<EntityResponseType> {
    return this.http
      .post<INgelmakAccount>(this.resourceUrl, ngelmakAccount, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(ngelmakAccount: INgelmakAccount): Observable<EntityResponseType> {
    return this.http
      .put<INgelmakAccount>(this.resourceUrl, ngelmakAccount, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(ngelmakAccount: INgelmakAccount): Observable<EntityResponseType> {
    return this.http
      .patch<INgelmakAccount>(`${this.resourceUrl}/${this.getNgelmakAccountIdentifier(ngelmakAccount)}`, ngelmakAccount, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<INgelmakAccount>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  findByCurrentUser(): Observable<EntityResponseType> {
    return this.http.get<INgelmakAccount>(`${this.resourceUrl}/current-user`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<INgelmakAccount[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getNgelmakAccountIdentifier(ngelmakAccount: Pick<INgelmakAccount, 'id'>): number | null {
    return ngelmakAccount.id;
  }

  compareNgelmakAccount(o1: Pick<INgelmakAccount, 'id'> | null, o2: Pick<INgelmakAccount, 'id'> | null): boolean {
    return o1 && o2 ? this.getNgelmakAccountIdentifier(o1) === this.getNgelmakAccountIdentifier(o2) : o1 === o2;
  }

  addNgelmakAccountToCollectionIfMissing<Type extends Pick<INgelmakAccount, 'id'>>(
    ngelmakAccountCollection: Type[],
    ...ngelmakAccountsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ngelmakAccounts: Type[] = ngelmakAccountsToCheck.filter(isPresent);
    if (ngelmakAccounts.length > 0) {
      const ngelmakAccountCollectionIdentifiers = ngelmakAccountCollection.map(ngelmakAccountItem =>
        this.getNgelmakAccountIdentifier(ngelmakAccountItem),
      );
      const ngelmakAccountsToAdd = ngelmakAccounts.filter(ngelmakAccountItem => {
        const ngelmakAccountIdentifier = this.getNgelmakAccountIdentifier(ngelmakAccountItem);
        if (ngelmakAccountCollectionIdentifiers.includes(ngelmakAccountIdentifier)) {
          return false;
        }
        ngelmakAccountCollectionIdentifiers.push(ngelmakAccountIdentifier);
        return true;
      });
      return [...ngelmakAccountsToAdd, ...ngelmakAccountCollection];
    }
    return ngelmakAccountCollection;
  }

  protected convertDateFromServer(restNgelmakAccount: INgelmakAccount): INgelmakAccount {
    return {
      ...restNgelmakAccount,
      createdAt: restNgelmakAccount.createdAt ? dayjs(restNgelmakAccount.createdAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<INgelmakAccount>): HttpResponse<INgelmakAccount> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<INgelmakAccount[]>): HttpResponse<INgelmakAccount[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
