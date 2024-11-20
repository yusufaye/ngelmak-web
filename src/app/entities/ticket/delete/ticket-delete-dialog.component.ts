import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
;

import SharedModule from 'app/shared/shared.module';

import { ITicket } from '../ticket.model';
import { TicketService } from '../service/ticket.service';

@Component({
  standalone: true,
  templateUrl: './ticket-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TicketDeleteDialogComponent {
  ticket?: ITicket;

  protected ticketService = inject(TicketService);


  cancel(): void {
    // this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ticketService.delete(id).subscribe(() => {

    });
  }
}
