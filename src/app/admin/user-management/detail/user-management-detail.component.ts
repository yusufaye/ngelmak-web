import { Component, inject } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { AccountService } from 'app/core/auth/account.service';
import SharedModule from "app/shared/shared.module";

import { MatDialog } from "@angular/material/dialog";
import { Account } from 'app/core/auth/account.model';
import { IPrivilege } from 'app/entities/privilege/privilege.model';
import { PrivilegeGrantComponent } from "./privilege-grant/privilege-grant.component";
import { PrivilegeService } from "app/entities/privilege/service/privilege.service";
import { IUser } from "app/entities/user/user.model";

@Component({
  standalone: true,
  selector: "app-user-mgmt-detail",
  templateUrl: "./user-management-detail.component.html",
  imports: [RouterModule, SharedModule],
})
export default class UserManagementDetailComponent {
  route = inject(ActivatedRoute);
  readonly dialog = inject(MatDialog);
  private accountService = inject(AccountService);
  private privilegeService = inject(PrivilegeService);

  user: Account | null = null;

  ngOnInit(): void {
    this.user = this.route.snapshot.data["user"];
    console.log(this.user);
    
  }
  
  loadPrivileges() {
    // this.privilegeService.findByUserLogin(this.account.login).subscribe(res => (this.account = res));
  }

  grant() {
    const dialogRef = this.dialog.open(PrivilegeGrantComponent, {
      enterAnimationDuration: "300ms",
      exitAnimationDuration: "150ms",
    });
    dialogRef.componentInstance.login = this.user.login; 

    dialogRef
      .afterClosed()
      .subscribe((privilege: IPrivilege) => (this.loadPrivileges()));
  }

  previousState(): void {
    window.history.back();
  }
}
