import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IReview } from '../review.model';

@Component({
  standalone: true,
  selector: 'app-review-detail',
  templateUrl: './review-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ReviewDetailComponent {
  review = input<IReview | null>(null);

  previousState(): void {
    window.history.back();
  }
}
