import { Injectable, inject } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable()
export class AppPageTitleStrategy extends TitleStrategy {

  override updateTitle(routerState: RouterStateSnapshot): void {
    let pageTitle = this.buildTitle(routerState);
    if (!pageTitle) {
      pageTitle = 'global.title';
    }
    // this.translateService.get(pageTitle).subscribe(title => {
    //   document.title = title;
    // });
  }
}
