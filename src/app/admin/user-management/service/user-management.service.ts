import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Account } from 'app/core/auth/account.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private http = inject(HttpClient);
  private applicationConfigService = inject(ApplicationConfigService);

  private resourceUrl = this.applicationConfigService.getEndpointFor('api/admin/users');

  create(account: Account): Observable<Account> {
    return this.http.post<Account>(this.resourceUrl, account);
  }

  update(account: Account): Observable<Account> {
    return this.http.put<Account>(this.resourceUrl, account);
  }

  find(login: string): Observable<Account> {
    return this.http.get<Account>(`${this.resourceUrl}/${login}`);
  }

  query(req?: Pagination): Observable<HttpResponse<Account[]>> {
    const options = createRequestOption(req);
    return this.http.get<Account[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(login: string): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${login}`);
  }

  authorities(): Observable<string[]> {
    return this.http
      .get<Array<{ name: string }>>(this.applicationConfigService.getEndpointFor('api/authorities'))
      .pipe(map(authorities => authorities.map(a => a.name)));
  }

  certificate(request: {
    officialDocType;
    officialDocIdentification;
  }): Observable<HttpResponse<Account>> {
    return this.http.put<Account>(`${this.resourceUrl}/certification`, request, { observe: 'response' });
  }

  certificationWithdrawal(login): Observable<HttpResponse<Account>> {
    return this.http.put<Account>(`${this.resourceUrl}/certification-withdrawal/${login}`, {}, { observe: 'response' });
  }

  getAccountCertification(login: string): Observable<HttpResponse<{}>> {
    return this.http.get(`${this.resourceUrl}/certification/${login}`, { observe: 'response' });
  }
}
