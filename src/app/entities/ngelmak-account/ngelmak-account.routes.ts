import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { NgelmakAccountComponent } from './list/ngelmak-account.component';
import { NgelmakAccountDetailComponent } from './detail/ngelmak-account-detail.component';
import { NgelmakAccountUpdateComponent } from './update/ngelmak-account-update.component';
import NgelmakAccountResolve from './route/ngelmak-account-routing-resolve.service';

const ngelmakAccountRoute: Routes = [
  {
    path: '',
    component: NgelmakAccountComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NgelmakAccountDetailComponent,
    resolve: {
      ngelmakAccount: NgelmakAccountResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NgelmakAccountUpdateComponent,
    resolve: {
      ngelmakAccount: NgelmakAccountResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NgelmakAccountUpdateComponent,
    resolve: {
      ngelmakAccount: NgelmakAccountResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ngelmakAccountRoute;
