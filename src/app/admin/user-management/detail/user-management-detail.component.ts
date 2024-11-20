import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import SharedModule from 'app/shared/shared.module';

import { User } from '../user-management.model';

@Component({
  standalone: true,
  selector: 'app-user-mgmt-detail',
  templateUrl: './user-management-detail.component.html',
  imports: [RouterModule, SharedModule],
})
export default class UserManagementDetailComponent {
  route = inject(ActivatedRoute);
  user: User | null = null;

  ngOnInit(): void {
    this.user = this.route.snapshot.data['user'];
  }
}
