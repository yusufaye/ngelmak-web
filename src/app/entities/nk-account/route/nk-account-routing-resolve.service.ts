import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INkAccount } from '../nk-account.model';
import { NkAccountService } from '../nk-account.service';

const nkAccountResolve = (route: ActivatedRouteSnapshot): Observable<null | INkAccount> => {
  const id = route.params['id'];
  if (id) {
    return inject(NkAccountService)
      .find(id)
      .pipe(
        mergeMap((nkAccount: HttpResponse<INkAccount>) => {
          if (nkAccount.body) {
            return of(nkAccount.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default nkAccountResolve;
