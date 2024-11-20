import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PostComponent } from './list/post.component';
import { PostDetailComponent } from './detail/post-detail.component';
import { PostUpdateComponent } from './update/post-update.component';
import PostResolve from './post-routing-resolve.service';
import { PostTableComponent } from './table/post-table.component';

const postRoute: Routes = [
  {
    path: '',
    component: PostTableComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  // {
  //   path: '',
  //   component: PostComponent,
  //   data: {
  //     defaultSort: 'id,' + ASC,
  //   },
  //   canActivate: [UserRouteAccessService],
  // },
  {
    path: ':id/view',
    component: PostDetailComponent,
    resolve: {
      post: PostResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PostUpdateComponent,
    resolve: {
      post: PostResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PostUpdateComponent,
    resolve: {
      post: PostResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default postRoute;
