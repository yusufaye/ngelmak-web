import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
;

import SharedModule from 'app/shared/shared.module';

import { IConfig } from '../config.model';
import { ConfigService } from '../service/config.service';

@Component({
  standalone: true,
  templateUrl: './config-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ConfigDeleteDialogComponent {
  config?: IConfig;

  protected configService = inject(ConfigService);


  cancel(): void {
    // this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.configService.delete(id).subscribe(() => {

    });
  }
}
