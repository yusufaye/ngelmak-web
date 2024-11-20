import { Routes } from '@angular/router';
import SignInComponent from './authentication/sign-in/sign-in.component';
import { errorRoute } from 'app/layouts/error/error.route';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('app/layouts/main/main.module').then(m => m.MainModule),
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    title: 'sign-in.title',
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    title: 'sign-up.title',
  },
  ...errorRoute,
];
