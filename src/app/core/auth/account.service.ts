import { HttpClient } from "@angular/common/http";
import { inject, Injectable, Signal, signal } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, of, ReplaySubject } from "rxjs";
import { catchError, shareReplay, tap } from "rxjs/operators";

import { Account } from "app/core/auth/account.model";
import { StateStorageService } from "app/core/auth/state-storage.service";
import { ApplicationConfigService } from "../config/application-config.service";

@Injectable({ providedIn: "root" })
export class AccountService {
  private userIdentity = signal<Account | null>(null);
  private authenticationState = new ReplaySubject<Account | null>(1);
  private accountCache$?: Observable<Account> | null;

  private http = inject(HttpClient);
  private router = inject(Router);
  private stateStorageService = inject(StateStorageService);
  private applicationConfigService = inject(ApplicationConfigService);

  save(account: Account): Observable<{}> {
    return this.http.post(
      this.applicationConfigService.getEndpointFor("api/account"),
      account
    );
  }

  requestCertification(request: {
    officialDocType;
    officialDocIdentification;
  }): Observable<{}> {
    return this.http.put(
      `${this.applicationConfigService.getEndpointFor(
        "api/account"
      )}/account-request-certification`,
      request,
      { observe: "response" }
    );
  }

  authenticate(identity: Account | null): void {
    this.userIdentity.set(identity);
    this.authenticationState.next(this.userIdentity());
    if (!identity) {
      this.accountCache$ = null;
    }
  }

  trackCurrentAccount(): Signal<Account | null> {
    return this.userIdentity.asReadonly();
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    const userIdentity = this.userIdentity();
    if (!userIdentity) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    return userIdentity.authorities.some((authority: string) =>
      authorities.includes(authority)
    );
  }

  identity(force?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || force) {
      this.accountCache$ = this.fetchUserAccount().pipe(
        tap((account: Account) => {
          this.authenticate(account);

          // After retrieve the account info, the language will be changed to
          // the user's preferred language configured in the account setting
          // unless user have choosed other language in the current session
          // if (!this.stateStorageService.getLocale()) {
          //   this.translateService.use(account.langKey);
          // }

          this.navigateToStoredUrl();
        }),
        shareReplay()
      );
    }
    return this.accountCache$.pipe(catchError(() => of(null)));
  }

  isAuthenticated(): boolean {
    return this.userIdentity() !== null;
  }

  getAuthenticationState(): Observable<Account | null> {
    return this.authenticationState.asObservable();
  }

  private fetchUserAccount(): Observable<Account> {
    return this.http.get<Account>(
      this.applicationConfigService.getEndpointFor("api/account")
    );
  }

  private navigateToStoredUrl(): void {
    // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
    // if login is successful, go to stored previousState and clear previousState
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }
}
