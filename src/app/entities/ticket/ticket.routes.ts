import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { TicketComponent } from './list/ticket.component';
import { TicketDetailComponent } from './detail/ticket-detail.component';
import { TicketUpdateComponent } from './update/ticket-update.component';
import TicketResolve from './route/ticket-routing-resolve.service';

const ticketRoute: Routes = [
  {
    path: '',
    component: TicketComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TicketDetailComponent,
    resolve: {
      ticket: TicketResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TicketUpdateComponent,
    resolve: {
      ticket: TicketResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TicketUpdateComponent,
    resolve: {
      ticket: TicketResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ticketRoute;
