import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { INgelmakAccount } from '../ngelmak-account.model';

@Component({
  standalone: true,
  selector: 'app-ngelmak-account-detail',
  templateUrl: './ngelmak-account-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class NgelmakAccountDetailComponent {
  ngelmakAccount = input<INgelmakAccount | null>(null);

  previousState(): void {
    window.history.back();
  }
}
