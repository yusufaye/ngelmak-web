import { Component, OnInit, inject } from "@angular/core";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AlertService } from "app/shared/alert/alert.service";

import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { SignInService } from "app/authentication/sign-in/sign-in.service";
import { AuthenticationService } from "app/core/auth/auth.service";
import SharedModule from "app/shared/shared.module";

@Component({
  standalone: true,
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
})
export default class SignInComponent implements OnInit {
  private signInService = inject(SignInService);
  private authService = inject(AuthenticationService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);

  signInForm = this.fb.group({
    username: ["admin", [Validators.required]],
    password: ["admin", [Validators.required]],
    rememberMe: [true, [Validators.required]],
  });

  hide = true;

  ngOnInit(): void {
    // if already authenticated then navigate to home page
    this.authService.identity().subscribe(() => {
      if (this.authService.isAuthenticated()) {
        this.router.navigate([""]);
      }
    });
  }

  signIn(): void {
    const credentials = this.signInForm.getRawValue();
    this.signInService.signIn(credentials).subscribe({
      next: () => {
        // There were no routing during signIn (eg from navigationToStoredUrl)
        if (!this.router.getCurrentNavigation()) {
          this.router.navigate([""]);
        } else {
          console.log("Current Navigation", this.router.getCurrentNavigation());
        }
        this.alertService.addAlert({
          type: "success",
          message: "Connexion avec succès!",
        });
      },
      error: () => {
        this.alertService.addAlert({
          type: "error",
          message:
            "<strong>Erreur d&apos;authentification !</strong> Veuillez vérifier vos identifiants de connexion.",
        });
      },
    });
  }
}
