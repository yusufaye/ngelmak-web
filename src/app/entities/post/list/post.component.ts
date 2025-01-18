import { query } from "@angular/animations";
import { Component, inject, NgZone, OnInit, signal } from "@angular/core";
import {
  ActivatedRoute,
  Data,
  ParamMap,
  Router,
  RouterModule,
} from "@angular/router";
import { combineLatest, Subscription, tap } from "rxjs";

import { FormsModule } from "@angular/forms";
import { DEFAULT_SORT_DATA, SORT } from "app/config/navigation.constants";
import { ITEMS_PER_PAGE, PAGE_HEADER } from "app/config/pagination.constants";
import { DataUtils } from "app/core/util/data-util.service";
import SharedModule from "app/shared/shared.module";
import { SortService, sortStateSignal, type SortState } from "app/shared/sort";
import { IPost } from "../post.model";

import { HttpResponse } from "@angular/common/http";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { DurationPipe } from "app/shared/date";
import { IPage } from "app/shared/pagination/pagination.model";
import { PostService } from "../post.service";

@Component({
  standalone: true,
  selector: "app-post",
  templateUrl: "./post.component.html",
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    DurationPipe,
    MatDividerModule,
    MatCardModule,
    MatIconModule,
  ],
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

  search(query: string): void {
    this.handleNavigation(this.page, query);
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(this.page);
  }

  navigateToPage(page: number): void {
    this.handleNavigation(page, this.query);
  }

  protected onResponseSuccess(response: HttpResponse<IPage<IPost>>): void {
    const { body } = response;
    this.hasNext.set(body.hasNext);
    this.hasPrevious.set(body.hasPrevious);
    this.totalItems = body.totalElements;
    this.posts.set(body.content ?? []);
  }

  protected handleNavigation(page: number, query?: string): void {
    const queryParamsObj = { q: query, page, size: this.itemsPerPage };
    this.ngZone.run(() => {
      this.router.navigate(["./"], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}
