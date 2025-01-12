import { HttpResponse } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { combineLatest } from "rxjs";

import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SORT } from "app/config/navigation.constants";
import { ITEMS_PER_PAGE } from "app/config/pagination.constants";
import { Account } from "app/core/auth/account.model";
import { AccountService } from "app/core/auth/account.service";
import { IPage } from "app/shared/pagination/pagination.model";
import SharedModule from "app/shared/shared.module";
import { SortService, sortStateSignal } from "app/shared/sort";
import { UserManagementService } from "../service/user-management.service";

@Component({
  standalone: true,
  selector: "app-user-management",
  templateUrl: "./user-management.component.html",
  imports: [RouterModule, SharedModule, MatTooltipModule, MatPaginatorModule],
})
export default class UserManagementComponent implements OnInit, AfterViewInit {
  currentAccount = inject(AccountService).trackCurrentAccount();
  private router = inject(Router);
  private userService = inject(UserManagementService);
  private sortService = inject(SortService);
  private activatedRoute = inject(ActivatedRoute);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  users = signal<Account[] | null>(null);
  isLoading = signal(false);
  totalItems = signal(0);
  size = ITEMS_PER_PAGE;
  page!: number;
  sortState = sortStateSignal({});

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = "Éléments par page :";
    this.paginator._intl.firstPageLabel = "Première page";
    this.paginator._intl.lastPageLabel = "Dernière page";
    this.paginator._intl.nextPageLabel = "Page suivante";
    this.paginator._intl.previousPageLabel = "Page précédente";
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} sur ${length}`;
    };
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  setActive(user: Account, isActivated: boolean): void {
    this.userService
      .update({ ...user, activated: isActivated })
      .subscribe(() => this.loadAll());
  }

  trackIdentity(_index: number, item: Account): number {
    return item.id!;
  }

  loadAll(): void {
    this.isLoading.set(true);
    this.userService
      .query({
        page: this.page - 1,
        size: this.size,
        sort: this.sortService.buildSortParam(this.sortState(), "id"),
      })
      .subscribe({
        next: ({ body }: HttpResponse<IPage<Account>>) => {
          this.isLoading.set(false);
          this.totalItems.set(Number(body.totalElements));
          this.users.set(body.content);
        },
        error: () => this.isLoading.set(false),
      });
  }

  private handleNavigation(): void {
    combineLatest([
      this.activatedRoute.data,
      this.activatedRoute.queryParamMap,
    ]).subscribe(([data, params]) => {
      const page = Number(params.get("page"));
      this.page = page ?? 1;
      this.sortState.set(
        this.sortService.parseSortParam(params.get(SORT) ?? data["defaultSort"])
      );
      this.loadAll();
    });
  }

  pageChange({ pageIndex, pageSize }): void {
    this.page = pageIndex;
    this.size = pageSize;
    this.router.navigate(["./"], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        page: this.page,
        sort: this.sortService.buildSortParam(this.sortState()),
      },
    });
  }
}
