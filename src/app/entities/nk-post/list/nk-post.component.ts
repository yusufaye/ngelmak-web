import { Component, inject, NgZone, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { combineLatest, Subscription, tap } from "rxjs";

import { FormsModule } from "@angular/forms";
import { ITEMS_PER_PAGE, PAGE_HEADER } from "app/config/pagination.constants";
import { DataUtils } from "app/core/util/data-util.service";
import { IPost } from "app/entities/models/nk-post.model";
import SharedModule from "app/shared/shared.module";
import { SortService, sortStateSignal, type SortState } from "app/shared/sort";

import { HttpResponse } from "@angular/common/http";
import { MatCardModule } from "@angular/material/card";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { AuthenticationService } from "app/core/auth/auth.service";
import { AccountService } from "app/entities/nk-account/nk-account.service";
import { DurationPipe } from "app/shared/date";
import { IPage } from "app/shared/pagination/pagination.model";
import { PostService } from "../nk-post.service";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { PostUpdateComponent } from "../update/nk-post-update.component";

@Component({
  standalone: true,
  selector: "app-post",
  templateUrl: "./nk-post.component.html",
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    DurationPipe,
    MatDividerModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class PostComponent implements OnInit {
  subscription: Subscription | null = null;
  posts = signal<IPost[]>(null);
  hasPrevious = signal(false);
  hasNext = signal(false);
  isLoading = signal(false);

  sortState = sortStateSignal({});

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;
  query = "";

  public router = inject(Router);
  protected postService = inject(PostService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected dataUtils = inject(DataUtils);
  protected authService = inject(AuthenticationService);
  readonly dialog = inject(MatDialog);
  
  account = inject(AccountService).trackCurrentAccount();

  protected ngZone = inject(NgZone);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap])
      .pipe(
        tap(([params]) => {
          this.query = params.get("q");
          const page = params.get(PAGE_HEADER);
          this.page = +(page ?? 1);
        }),
        tap(() => this.loadAll())
      )
      .subscribe();
    this.open();
  }

  loadAll(): void {
    const { page, query } = this;
    this.isLoading.set(true);
    const pageToLoad: number = page;
    const req = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      q: query,
    };
    this.postService.query(req).subscribe({
      next: (res: HttpResponse<IPage<IPost>>) => {
        this.onResponseSuccess(res);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  open() {
    const dialogRef = this.dialog.open(PostUpdateComponent, {
      enterAnimationDuration: "300ms",
      exitAnimationDuration: "150ms",
      disableClose: true,
      width: "80vw",
      maxWidth: "100vw",
      maxHeight: "80vw",
    });

    dialogRef
      .afterClosed()
      .subscribe((res) => res && this.loadAll());
  }

  search(query: string): void {
    this.handleNavigation(this.page, query);
  }

  filterFollowing(): void {}

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(this.page);
  }

  navigateToPage(page: number): void {
    this.handleNavigation(page, this.query);
  }

  protected onResponseSuccess(response: HttpResponse<IPage<IPost>>): void {
    const { body } = response;
    // console.log(body);
    this.hasNext.set(body.hasNext);
    this.hasPrevious.set(body.hasPrevious);
    this.totalItems = body.totalElements;
    this.posts.set(body.content ?? []);
  }

  protected handleNavigation(page: number, query?: string): void {
    const queryParamsObj = { q: query, page, size: this.itemsPerPage };
    this.ngZone.run(() => {
      this.router.navigate(["/", query.length > 0 ? "search" : ""], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}
