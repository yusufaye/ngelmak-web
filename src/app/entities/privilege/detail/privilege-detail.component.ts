import { Component, input, signal } from "@angular/core";
import { RouterModule } from "@angular/router";

import SharedModule from "app/shared/shared.module";
import {
  DurationPipe,
  FormatMediumDatetimePipe,
  FormatMediumDatePipe,
} from "app/shared/date";
import { IPrivilege } from "../privilege.model";
import { PrivilegeUpdateComponent } from "../update/privilege-update.component";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from "@angular/forms";
import dayjs from "dayjs/esm";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  standalone: true,
  selector: "app-privilege-detail",
  templateUrl: "./privilege-detail.component.html",
  imports: [
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    PrivilegeUpdateComponent,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
  ],
})
export class PrivilegeDetailComponent {
  isSaving = signal(false);
  isEditing = signal(true);

  privilegeForm = new FormGroup({
    id: new FormControl<number | null>(null),
    name: new FormControl<string | null>(
      null,
      Validators.required
    ),
    createdAt: new FormControl<dayjs.Dayjs | null>(
      null
    ),
    description: new FormControl<string | null>(
      null,
      [Validators.required, Validators.min(20), Validators.maxLength(200)]
    ),
  });

  save() {

  }
}
