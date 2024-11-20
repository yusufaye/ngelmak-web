import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ConfigComponent } from './list/config.component';
import { ConfigDetailComponent } from './detail/config-detail.component';
import { ConfigUpdateComponent } from './update/config-update.component';
import ConfigResolve from './route/config-routing-resolve.service';

const configRoute: Routes = [
  {
    path: '',
    component: ConfigComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConfigDetailComponent,
    resolve: {
      config: ConfigResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConfigUpdateComponent,
    resolve: {
      config: ConfigResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConfigUpdateComponent,
    resolve: {
      config: ConfigResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default configRoute;
