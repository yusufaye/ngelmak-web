import { Routes } from '@angular/router';

const entityRoutes: Routes = [
  {
    path: 'authority',
    title: 'ngelmakprojectApp.adminAuthority.home.title',
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'nk-account',
    title: 'ngelmakprojectApp.nkAccount.home.title',
    loadChildren: () => import('./nk-account/nk-account.routes'),
  },
  {
    path: 'privilege',
    title: 'ngelmakprojectApp.privilege.home.title',
    loadChildren: () => import('./privilege/privilege.routes'),
  },
  {
    path: 'config',
    title: 'ngelmakprojectApp.config.home.title',
    loadChildren: () => import('./config/config.routes'),
  },
  {
    path: 'post',
    title: 'post',
    loadChildren: () => import('./post/post.routes'),
  },
  {
    path: 'ticket',
    title: 'ngelmakprojectApp.ticket.home.title',
    loadChildren: () => import('./ticket/ticket.routes'),
  },
  {
    path: 'review',
    title: 'ngelmakprojectApp.review.home.title',
    loadChildren: () => import('./review/review.routes'),
  },
  {
    path: 'membership',
    title: 'ngelmakprojectApp.membership.home.title',
    loadChildren: () => import('./membership/membership.routes'),
  },
];

export default entityRoutes;
