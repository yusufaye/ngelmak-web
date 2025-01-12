import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { INkAccount } from '../nk-account.model';

@Component({
  standalone: true,
  selector: 'app-nk-account-detail',
  templateUrl: './nk-account-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class NkAccountDetailComponent {
  nkAccount = input<INkAccount | null>(null);

  previousState(): void {
    window.history.back();
  }
}
