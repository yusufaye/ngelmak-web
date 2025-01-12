import { Routes } from '@angular/router';

import { ASC, DESC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PostDetailComponent } from './detail/post-detail.component';
import { PostComponent } from './list/post.component';
import PostResolve from './post-routing-resolve.service';
import { PostUpdateComponent } from './update/post-update.component';

const postRoute: Routes = [
  {
    path: '',
    component: PostComponent,
    data: {
      defaultSort: 'at,' + DESC,
    },
    canActivate: [UserRouteAccessService],
  },
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
