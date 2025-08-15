import { inject, Injectable } from '@angular/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { mergeMap, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SignInService {
  private accountService = inject(AccountService);
  private authServerProvider = inject(AuthServerProvider);

  signIn(credentials): Observable<Account> {
    return this.authServerProvider.signIn(credentials).pipe(mergeMap(() => this.accountService.identity(true)))
  }

  signOut(): void {
    this.authServerProvider.signOut().subscribe({ complete: () => this.accountService.authenticate(null) });
  }
}
