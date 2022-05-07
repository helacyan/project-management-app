import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { IColumn } from 'src/app/api/models/api.model';
import { ColumnsService } from 'src/app/api/services/columns/columns.service';
import { fetchColumns } from 'src/app/store/actions/columns.actions';
import { selectColumns } from 'src/app/store/selectors/columns.selector';
import { CreateColumnModalComponent } from '../../components/create-column-modal/create-column-modal.component';
import { IColumnItem } from '../../models/column-item.model';

@Component({
  selector: 'app-board-page',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.scss'],
})
export class BoardPageComponent implements OnInit, OnDestroy {
  private boardId!: string;

  private columnsCount!: number;

  public columns$!: Observable<IColumnItem[]>;

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private columnsService: ColumnsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.boardId = this.route.snapshot.params['id'];
    this.columns$ = this.store.select(selectColumns);
    this.loadColumns();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.store.dispatch(fetchColumns({ columns: [] }));
  }

  private loadColumns = (): void => {
    const subscription = this.columnsService.getColumns(this.boardId).subscribe({
      next: (columns: IColumnItem[]) => {
        this.store.dispatch(fetchColumns({ columns }));
        this.columnsCount = columns.length;
      },
      error: () => {
        this.store.dispatch(fetchColumns({ columns: [] }));
      },
    });

    this.subscriptions.push(subscription);
  };

  private createColumn = (title: string): void => {
    const newColumn: IColumn = {
      title,
      order: this.columnsCount + 1,
    };
    this.columnsService.createColumn(this.boardId, newColumn);
  };

  public openDialog(): void {
    const dialogRef = this.dialog.open(CreateColumnModalComponent, {
      width: '300px',
    });

    const subscription = dialogRef.afterClosed().subscribe(title => {
      if (title && typeof title === 'string') {
        this.createColumn(title);
        this.loadColumns();
      }
    });
    this.subscriptions.push(subscription);
  }
}
