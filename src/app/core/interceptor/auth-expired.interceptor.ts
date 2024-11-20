import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import { SignInService } from 'app/authentication/sign-in/sign-in.service';

@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {
  private readonly signInService = inject(SignInService);
  private readonly stateStorageService = inject(StateStorageService);
  private readonly router = inject(Router);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          if (err.status === 401 && err.url && !err.url.includes('api/account')) {
            this.stateStorageService.storeUrl(this.router.routerState.snapshot.url);
            this.signInService.signOut();
            this.router.navigate(['/sign-in']);
          }
        },
      }),
    );
  }
}
