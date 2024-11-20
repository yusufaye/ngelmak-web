import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import AccountManagementComponent from './account-management.component';
import PasswordComponent from './password/password.component';
import entityRoutes from 'app/entities/entity.routes';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  {
    path: '',
    data: {
      // authorities: [Authority.ADMIN],
    },
    component: AccountManagementComponent,
    canActivate: [UserRouteAccessService],
    children: [
      {
        path: '',
        title: 'Mon compte',
        component: AccountComponent,
      },
      {
        path: 'password',
        component: PasswordComponent,
        title: 'global.menu.account.password',
        canActivate: [UserRouteAccessService],
      },
      ...entityRoutes,
    ]
  },
];

@NgModule({
  declarations: [AccountManagementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class AccountManagementModule { }
