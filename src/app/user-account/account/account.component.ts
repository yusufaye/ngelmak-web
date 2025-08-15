import { AccountCertificationRequest } from "../account-certification-request/account-certification-request.component";
import { AccountService } from "app/core/auth/account.service";
import { Component, inject, OnInit } from "@angular/core";
import { AccountUpdateComponent } from "./account-update/account-update.component";
import { UserPasswordComponent } from "./user-password/user-password.component";
import { UserUpdateComponent } from "../user-update/user-update.component";
import { AccountConfigComponent } from "./account-config/account-config.component";
import { Account } from "app/core/auth/account.model";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-account",
  standalone: true,
  imports: [
    AccountUpdateComponent,
    AccountConfigComponent,
    UserUpdateComponent,
    UserPasswordComponent,
  ],
  templateUrl: "./account.component.html",
  styleUrl: "./account.component.scss",
})
export class AccountComponent implements OnInit {
  account: Account;

  readonly dialog = inject(MatDialog);
  private accountService = inject(AccountService);

  ngOnInit(): void {
    this.accountService
      .identity()
      .subscribe((account) => {this.account = account; console.log(account)});
  }

  certificationRequest() {
    const dialogRef = this.dialog.open(AccountCertificationRequest, {
      disableClose: true,
      enterAnimationDuration: "300ms",
      exitAnimationDuration: "150ms",
    });
    dialogRef.componentInstance.login = this.account.login;
    dialogRef.afterClosed().subscribe(res => res && this.accountService.identity(true).subscribe(account => (this.account=account)));
  }
}
