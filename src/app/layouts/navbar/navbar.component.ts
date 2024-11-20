import { Component, inject, signal, OnInit, Injectable, } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import SharedModule from 'app/shared/shared.module';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { LANGUAGES } from 'app/config/language.constants';
import { AccountService } from 'app/core/auth/account.service';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { scaleInOut400ms } from 'app/shared/animations/scale-in-out.animation';
import { SignInService } from 'app/authentication/sign-in/sign-in.service';
import { ClickOutsideDirective } from 'app/shared/directives/click-outside.directive';

@Injectable({ providedIn: 'root' })
export class NavbarService {
  private subject = new BehaviorSubject<boolean>(false);
  subject$ = this.subject.asObservable();

  triggerUpdate(value: boolean) {
    this.subject.next(value);
  }
}

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [
    RouterModule,
    SharedModule,
    HasAnyAuthorityDirective,
    ClickOutsideDirective,
    MatTooltipModule,
  ],
  animations: [scaleInOut400ms],
})
export default class NavbarComponent implements OnInit {

  private stateStorageService = inject(StateStorageService);
  private sidebarBehavior = inject(NavbarService);
  private accountService = inject(AccountService);
  private signInService = inject(SignInService);
  private router = inject(Router);
  account = inject(AccountService).trackCurrentAccount();

  resize$ = fromEvent(window, 'resize');

  inProduction?: boolean;
  isNavbarCollapsed = signal(true);
  languages = LANGUAGES;
  openAPIEnabled?: boolean;


  isDarkMode: boolean = true; // Manage the dark mode state
  isSidebarOpened: boolean = false;
  showAppsDropdown: boolean = false;
  showUserSettings: boolean = false;

  ngOnInit(): void {
    this.updateSideView(); // Detect the initial size of the window.
    this.accountService.identity().subscribe(); // update user account from the cache.
    this.resize$
      // .pipe(
      //   map((i: any) => i),
      //   debounceTime(500) // He waits > 0.5s between 2 events emitted before running the next.
      // )
      .subscribe(() => (this.updateSideView()));
  }

  private updateSideView() {
    if (window.innerWidth >= 1024) {
      this.isSidebarOpened = true;
    } else {
      this.isSidebarOpened = false;
    }
    this.sidebarBehavior.triggerUpdate(this.isSidebarOpened);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.remove('light'); // Add .light class to <html>
      document.documentElement.classList.add('dark'); // Add .dark class to <html>
    } else {
      document.documentElement.classList.remove('dark'); // Remove .dark class
      document.documentElement.classList.add('light'); // Add .light class to <html>
    }
  }

  toggleSidebar() {
    this.isSidebarOpened = !this.isSidebarOpened;
    this.sidebarBehavior.triggerUpdate(this.isSidebarOpened);
  }

  changeLanguage(languageKey: string): void {
    this.stateStorageService.storeLocale(languageKey);
    // this.translateService.use(languageKey);
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed.set(true);
  }

  login(): void {
    this.router.navigate(['/sign-in']);
  }

  logout(): void {
    this.collapseNavbar();
    this.signInService.signOut();
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed.update(isNavbarCollapsed => !isNavbarCollapsed);
  }
}
