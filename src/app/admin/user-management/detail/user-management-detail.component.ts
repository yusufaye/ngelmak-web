import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { IUserPrivilege } from "app/entities/user-privilege/user-privilege.model";
import SharedModule from "app/shared/shared.module";

import { MatDialog } from "@angular/material/dialog";
import { Account } from "app/core/auth/account.model";
import { IPrivilege } from "app/entities/privilege/privilege.model";
import { PrivilegeService } from "app/entities/privilege/service/privilege.service";
import { AlertService } from "app/shared/alert/alert.service";
import { CertificationResetComponent } from "./certification-reset/certification-reset.component";
import { CertificationComponent } from "./certification/certification.component";
import { PrivilegeGrantComponent } from "./privilege-grant/privilege-grant.component";

@Component({
  standalone: true,
  selector: "app-user-mgmt-detail",
  templateUrl: "./user-management-detail.component.html",
  imports: [RouterModule, SharedModule],
})
export default class UserManagementDetailComponent {
  route = inject(ActivatedRoute);
  readonly dialog = inject(MatDialog);
  private privilegeService = inject(PrivilegeService);
  private alertService = inject(AlertService);

  privileges: IUserPrivilege[] = [];
  account: Account | null = null;
  isRevoking = signal(false);

  ngOnInit(): void {
    this.account = this.route.snapshot.data["account"];
    this.loadPrivileges();
  }

  loadPrivileges() {
    this.privilegeService
      .findByLogin(this.account.login)
      .subscribe((res) => (this.privileges = res.body));
  }

  grant() {
    const dialogRef = this.dialog.open(PrivilegeGrantComponent, {
      enterAnimationDuration: "300ms",
      exitAnimationDuration: "150ms",
    });
    dialogRef.componentInstance.login = this.account.login;

    dialogRef
      .afterClosed()
      .subscribe((privilege: IPrivilege) => this.loadPrivileges());
  }

  certificate() {
    const dialogRef = this.dialog.open(CertificationComponent, {
      enterAnimationDuration: "300ms",
      exitAnimationDuration: "150ms",
    });
    
    dialogRef.componentInstance.login = this.account.login;

    dialogRef
      .afterClosed()
      .subscribe((account: Account) => (this.account = account || this.account));
  }

  uncertificate() {
    const dialogRef = this.dialog.open(CertificationResetComponent, {
      enterAnimationDuration: "300ms",
      exitAnimationDuration: "150ms",
    });
    dialogRef.componentInstance.login = this.account.login;

    dialogRef
      .afterClosed()
      .subscribe((account: Account) => (this.account = account || this.account));
  }

  revoke(id: number) {
    this.isRevoking.set(true);
    this.privilegeService.revoke(id).subscribe({
      next: () => {
        this.isRevoking.set(false);
        this.alertService.addAlert({ type: "success", message: "Le privilège est retiré à l'utilisateur." });
        this.loadPrivileges();
      },
      error: () => {
        this.isRevoking.set(false);
        this.alertService.addAlert({ type: "error", message: "Une erreur s'est produite." });
      },
    });
  }

  assign(id: number) {
    this.isRevoking.set(true);
    this.privilegeService.assign(id).subscribe({
      next: () => {
        this.isRevoking.set(false);
        this.alertService.addAlert({ type: "success", message: "Privilège attribuée avec succès !" });
        this.loadPrivileges();
      },
      error: () => {
        this.isRevoking.set(false);
        this.alertService.addAlert({ type: "error", message: "Une erreur s'est produite." });
      },
    });
  }

  activate(id: number) {
  }

  previousState(): void {
    window.history.back();
  }
}
