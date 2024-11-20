import { Directive, inject, input, TemplateRef, ViewContainerRef, effect, computed } from '@angular/core';

import { AccountService } from 'app/core/auth/account.service';

/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *ngelmakHasAnyAuthority="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *ngelmakHasAnyAuthority="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngelmakHasAnyAuthority]',
})
export default class HasAnyAuthorityDirective {
  public authorities = input<string | string[]>([], { alias: 'ngelmakHasAnyAuthority' });

  private templateRef = inject(TemplateRef<any>);
  private viewContainerRef = inject(ViewContainerRef);

  constructor() {
    const accountService = inject(AccountService);
    const currentAccount = accountService.trackCurrentAccount();
    const hasPermission = computed(() => currentAccount()?.authorities && accountService.hasAnyAuthority(this.authorities()));

    effect(
      () => {
        if (hasPermission()) {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainerRef.clear();
        }
      },
      { allowSignalWrites: true },
    );
  }
}
