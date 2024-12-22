import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserPrivilege } from '../ngelmak-account-privilege.model';
import { UserPrivilegeService } from '../service/ngelmak-account-privilege.service';

const userPrivilegeResolve = (route: ActivatedRouteSnapshot): Observable<null | IUserPrivilege> => {
  const id = route.params['id'];
  if (id) {
    return inject(UserPrivilegeService)
      .find(id)
      .pipe(
        mergeMap((userPrivilege: HttpResponse<IUserPrivilege>) => {
          if (userPrivilege.body) {
            return of(userPrivilege.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default userPrivilegeResolve;
