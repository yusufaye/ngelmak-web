import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { NkAccountComponent } from './list/nk-account.component';
import { NkAccountDetailComponent } from './detail/nk-account-detail.component';
import { NkAccountUpdateComponent } from './update/nk-account-update.component';
import NkAccountResolve from './route/nk-account-routing-resolve.service';

const nkAccountRoute: Routes = [
  {
    path: '',
    component: NkAccountComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NkAccountDetailComponent,
    resolve: {
      nkAccount: NkAccountResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NkAccountUpdateComponent,
    resolve: {
      nkAccount: NkAccountResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NkAccountUpdateComponent,
    resolve: {
      nkAccount: NkAccountResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default nkAccountRoute;
