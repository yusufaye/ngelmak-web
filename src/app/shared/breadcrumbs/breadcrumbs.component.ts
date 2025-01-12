import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-breadcrumbs',
  template: `
    <div class="flex items-center">
      <ng-container style="text-align: center;">
        <jhi-breadcrumb>
          <a [routerLink]="['/']" style="text-decoration: none;">
            <mat-icon>home</mat-icon>
          </a>
        </jhi-breadcrumb>
      </ng-container>
      <ng-container *ngFor="let crumb of crumbs">
        <div class="w-5 h-5 inline-block bg-bleu rounded-full ltr:mr-2 rtl:ml-2"></div>
        <jhi-breadcrumb>
          <a [routerLink]="[]" jhiTranslate="{{ crumb }}"></a>
        </jhi-breadcrumb>
      </ng-container>
    </div>
  `,
})
export class BreadcrumbsComponent implements OnInit {
  @Input() crumbs: string[] = [];
  crumbsTranslates: string[] = [];
  // .nationalite.delete.question
  constructor() {}

  ngOnInit() {
    this.crumbs = this.crumbs.map(el => `examenDecDscApp.${el}`);
  }
}
