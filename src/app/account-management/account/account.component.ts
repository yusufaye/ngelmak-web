import { Component } from '@angular/core';
import { AccountUpdateComponent } from './account-update/account-update.component';
import { UserPasswordComponent } from './user-password/user-password.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { AccountConfigComponent } from './account-config/account-config.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [AccountUpdateComponent, AccountConfigComponent, UserUpdateComponent, UserPasswordComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent { }
