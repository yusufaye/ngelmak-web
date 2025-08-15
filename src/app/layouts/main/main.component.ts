import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
})
export default class MainComponent implements OnInit {
  // private renderer: Renderer2;

  private router = inject(Router);
  private accountService = inject(AccountService);
  // private rootRenderer = inject(RendererFactory2);

  constructor() {
    // this.renderer = this.rootRenderer.createRenderer(document.querySelector('html'), null);
  }

  ngOnInit(): void {
    // try to log in automatically
    // this.accountService.identity().subscribe();

    // this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
    //   this.appPageTitleStrategy.updateTitle(this.router.routerState.snapshot);
    //   this.renderer.setAttribute(document.querySelector('html'), 'lang', langChangeEvent.lang);
    // });
  }
}
