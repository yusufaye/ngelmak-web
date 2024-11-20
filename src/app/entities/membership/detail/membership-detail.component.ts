import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IMembership } from '../membership.model';

@Component({
  standalone: true,
  selector: 'app-membership-detail',
  templateUrl: './membership-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class MembershipDetailComponent {
  membership = input<IMembership | null>(null);

  previousState(): void {
    window.history.back();
  }
}
