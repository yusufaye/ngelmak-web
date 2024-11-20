import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INgelmakAccount } from '../ngelmak-account.model';
import { NgelmakAccountService } from '../ngelmak-account.service';

const ngelmakAccountResolve = (route: ActivatedRouteSnapshot): Observable<null | INgelmakAccount> => {
  const id = route.params['id'];
  if (id) {
    return inject(NgelmakAccountService)
      .find(id)
      .pipe(
        mergeMap((ngelmakAccount: HttpResponse<INgelmakAccount>) => {
          if (ngelmakAccount.body) {
            return of(ngelmakAccount.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default ngelmakAccountResolve;
