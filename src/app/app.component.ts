import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import SharedModule from './shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
  <router-outlet></router-outlet>
  <!-- <app-alert-error></app-alert-error> -->
  `,
  imports: [
    RouterOutlet,
    SharedModule,
  ],
})
export class AppComponent {}
