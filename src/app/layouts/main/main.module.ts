import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import FooterComponent from '../footer/footer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import MainComponent from './main.component';
import NavbarComponent from '../navbar/navbar.component';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import HomeComponent from 'app/home/home.component';
import entityRoutes from 'app/entities/entity.routes';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', title: 'home', component: HomeComponent },
      {
        path: 'ngelmak-administration',
        data: {
          authorities: [Authority.ADMIN],
        },
        canActivate: [UserRouteAccessService],
        loadChildren: () => import('app/admin/admin.routes'),
      },
      {
        path: 'account-management',
        loadChildren: () => import('app/account-management/account-management.module').then(m => m.AccountManagementModule),
      },
      ...entityRoutes, // entities routes
    ]
  },
];

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  ],
  exports: [RouterModule],
})
export class MainModule { }
