import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AlertComponent } from "./shared/alert/alert.component";

@Component({
  standalone: true,
  selector: "app-root",
  template: `
    <router-outlet></router-outlet>
    <app-alert></app-alert>
  `,
  imports: [RouterOutlet, AlertComponent],
})
export class AppComponent {}
