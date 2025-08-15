import { HttpClient, HttpResponse } from "@angular/common/http";
import { inject, Injectable, signal, Signal } from "@angular/core";
import { catchError, Observable, of, tap } from "rxjs";

import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";
import { INkAccount } from "app/entities/models/nk-account.model";
import { IHttpRestApiService } from "../entity.service";

export type EntityResponseType = HttpResponse<INkAccount>;
export type EntityArrayResponseType = HttpResponse<INkAccount[]>;

@Injectable({ providedIn: "root" })
export class NkAccountService implements IHttpRestApiService<INkAccount> {
  private nkAccount = signal<INkAccount | null>(null);
  private nkAccountCache$?: Observable<INkAccount> | null;

  private http = inject(HttpClient);
  private applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl =
    this.applicationConfigService.getEndpointFor("api/accounts");

  trackCurrentUser(): Signal<INkAccount | null> {
    return this.nkAccount.asReadonly();
  }

  currentNkAccount(force?: boolean): Observable<INkAccount | null> {
    if (!this.nkAccountCache$ || force) {
      this.nkAccountCache$ = this.findByCurrentUser().pipe(
        tap((nkAccount: INkAccount) => {
          this.nkAccount.set(nkAccount);
          if (!nkAccount) {
            this.nkAccountCache$ = null;
          }
        })
      );
    }
    return this.nkAccountCache$.pipe(catchError(() => of(null)));
  }

  setNkAccount(nkAccount: INkAccount): void {
    this.nkAccount.set(nkAccount);
    if (!nkAccount) {
      this.nkAccountCache$ = null;
    }
  }

  findByCurrentUser(): Observable<INkAccount> {
    return this.http.get<INkAccount>(`${this.resourceUrl}/authicated-user`);
  }

  create(nkAccount: INkAccount): Observable<EntityResponseType> {
    return this.http.post<INkAccount>(this.resourceUrl, nkAccount, {
      observe: "response",
    });
  }

  update(nkAccount: INkAccount): Observable<EntityResponseType> {
    return this.http.put<INkAccount>(this.resourceUrl, nkAccount, {
      observe: "response",
    });
  }

  updateAvatar(file: File): Observable<EntityResponseType> {
    const data: FormData = new FormData();
    data.append("file", file);
    return this.http.put<INkAccount>(
      `${this.resourceUrl}/upload-avatar`,
      data,
      {
        observe: "response",
      }
    );
  }

  updateBanner(file: File): Observable<EntityResponseType> {
    const data: FormData = new FormData();
    data.append("file", file);
    return this.http.put<INkAccount>(
      `${this.resourceUrl}/upload-banner`,
      data,
      {
        observe: "response",
      }
    );
  }

  partialUpdate(nkAccount: INkAccount): Observable<EntityResponseType> {
    return this.http.patch<INkAccount>(
      `${this.resourceUrl}/${nkAccount.id}`,
      nkAccount,
      { observe: "response" }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<INkAccount>(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  findByUser(id: number): Observable<EntityResponseType> {
    return this.http.get<INkAccount>(`${this.resourceUrl}/user/${id}`, {
      observe: "response",
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<INkAccount[]>(this.resourceUrl, {
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
