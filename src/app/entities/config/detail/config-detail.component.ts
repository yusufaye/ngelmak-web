import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IConfig } from '../config.model';

@Component({
  standalone: true,
  selector: 'app-config-detail',
  templateUrl: './config-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ConfigDetailComponent {
  config = input<IConfig | null>(null);

  previousState(): void {
    window.history.back();
  }
}
