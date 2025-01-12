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
import { IPage } from "app/shared/pagination/pagination.model";
import { PostService } from "../post.service";
import { DurationPipe } from "app/shared/date";

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

  public router = inject(Router);
  protected postService = inject(PostService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected dataUtils = inject(DataUtils);

  protected ngZone = inject(NgZone);

  trackId = (_index: number, item: IPost) => item.id;

  ngOnInit(): void {
    this.subscription = combineLatest([
      this.activatedRoute.queryParamMap,
      this.activatedRoute.data,
    ])
      .pipe(
        tap(([params, data]) =>
          this.fillComponentAttributeFromRoute(params, data)
        ),
        tap(() => this.loadAll())
      )
      .subscribe();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  loadAll(): void {
    const { page } = this;
    this.isLoading.set(true);
    const pageToLoad: number = page;
    const req = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    this.postService.query(req).subscribe({
      next: (res: HttpResponse<IPage<IPost>>) => {
        this.onResponseSuccess(res);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(this.page, event);
  }

  navigateToPage(page: number): void {
    this.handleNavigation(page, this.sortState());
  }

  protected fillComponentAttributeFromRoute(
    params: ParamMap,
    data: Data
  ): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    this.sortState.set(
      this.sortService.parseSortParam(
        params.get(SORT) ?? data[DEFAULT_SORT_DATA]
      )
    );
  }

  protected onResponseSuccess(response: HttpResponse<IPage<IPost>>): void {
    const { body } = response;
    this.hasNext.set(body.hasNext);
    this.hasPrevious.set(body.hasPrevious);
    this.totalItems = body.totalElements;
    this.posts.set(body.content ?? []);
  }

  protected handleNavigation(page: number, sortState: SortState): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(["./"], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}
