import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';

/**
 * Application wide Module
 */
@NgModule({
  imports: [AlertComponent, AlertErrorComponent,],
  exports: [
    CommonModule,
    FontAwesomeModule,
    AlertComponent,
    AlertErrorComponent,
  ],
})
export default class SharedModule {}