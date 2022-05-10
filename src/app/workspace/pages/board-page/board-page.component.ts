import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { mergeMap, Observable, Subscription } from 'rxjs';
import { IColumn } from 'src/app/api/models/api.model';
import { BoardsService } from 'src/app/api/services/boards/boards.service';
import { ColumnsService } from 'src/app/api/services/columns/columns.service';
import { UsersService } from 'src/app/api/services/users/users.service';
import { clearColumns, fetchColumns } from 'src/app/store/actions/columns.actions';
import { fetchUsers } from 'src/app/store/actions/users.actions';
import { selectColumns } from 'src/app/store/selectors/columns.selectors';
import { CreateColumnModalComponent } from '../../components/create-column-modal/create-column-modal.component';
import { IBoardItem } from '../../models/board-item.model';
import { IColumnItem } from '../../models/column-item.model';

@Component({
  selector: 'app-board-page',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.scss'],
})
export class BoardPageComponent implements OnInit, OnDestroy {
  private boardId!: string;

  public boardTitle!: string;

  public columns$!: Observable<IColumnItem[]>;

  private columnsCount!: number;

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private usersService: UsersService,
    private boardsService: BoardsService,
    private columnsService: ColumnsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.boardId = this.route.snapshot.params.id;
    this.columns$ = this.store.select(selectColumns);
    this.loadUsers();
    this.loadColumns();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.store.dispatch(clearColumns());
  }

  private updateColumnsState = (board: IBoardItem) => {
    if (board.columns) {
      const columnsOrders: number[] = board.columns.map(column => column.order);
      this.columnsCount = columnsOrders.length ? Math.max(...columnsOrders) : 0;
      this.store.dispatch(fetchColumns({ columns: board.columns || [] }));
    }
  };

  private loadUsers = (): void => {
    const subscription = this.usersService.getUsers().subscribe(users => {
      this.store.dispatch(fetchUsers({ users }));
    });

    this.subscriptions.push(subscription);
  };

  private loadColumns = (): void => {
    const subscription = this.boardsService.getBoardById(this.boardId).subscribe((board: IBoardItem) => {
      this.boardTitle = board.title;
      this.updateColumnsState(board);
    });

    this.subscriptions.push(subscription);
  };

  private createColumn = (title: string): void => {
    const newColumn: IColumn = {
      title,
      order: this.columnsCount + 1,
    };
    this.columnsService.createColumn(this.boardId, newColumn);

    const subscription = this.columnsService
      .createColumn(this.boardId, newColumn)
      .pipe(mergeMap(() => this.boardsService.getBoardById(this.boardId)))
      .subscribe((board: IBoardItem) => this.updateColumnsState(board));
    this.subscriptions.push(subscription);
  };

  public openDialog(): void {
    const dialogRef = this.dialog.open(CreateColumnModalComponent, {
      width: '300px',
      position: {
        top: 'calc(70px + 2rem)',
      },
    });

    const subscription = dialogRef.afterClosed().subscribe(title => {
      if (title) this.createColumn(title);
    });
    this.subscriptions.push(subscription);
  }
}
