import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { EntityArrayResponseType, PostService } from 'app/entities/post/post.service';
import { SortService, sortStateSignal } from 'app/shared/sort';
import { Subscription } from 'rxjs';
import { IPost } from '../post.model';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-post-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './post-table.component.html',
  styleUrl: './post-table.component.scss'
})
export class PostTableComponent implements OnInit {
  private postService = inject(PostService);
  private sortService = inject(SortService);

  dataSource: MatTableDataSource<IPost> = new MatTableDataSource<IPost>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  visibleColumns = [ 'at', 'status', 'keywords', 'title', 'subject', 'visibility', 'actions'];

  subscription: Subscription | null = null;
  posts?: IPost[];
  post?: IPost;
  isLoading = false;

  sortState = sortStateSignal({});
  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;

  ngOnInit(): void {
    const { page } = this;

    this.isLoading = true;
    const pageToLoad: number = page;
    const queryObject: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      // sort: this.sortService.buildSortParam(this.sortState()),
    };

    this.postService.query(queryObject).subscribe({
      next: (res: EntityArrayResponseType) => {
        this.posts = res.body;
        this.dataSource.data = this.posts;
      },
      complete:() =>  (this.isLoading = false),
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
