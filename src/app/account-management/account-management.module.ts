import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import entityRoutes from 'app/entities/entity.routes';
import AccountManagementComponent from './account-management.component';
import { AccountComponent } from './account/account.component';
import PasswordComponent from './password/password.component';

const routes: Routes = [
  {
    path: '',
    component: AccountManagementComponent,
    canActivate: [UserRouteAccessService],
    children: [
      {
        path: '',
        title: 'global.menu.account.myaccount',
        component: AccountComponent,
      },
      {
        path: 'password',
        component: PasswordComponent,
        title: 'global.menu.account.password',
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
