import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { concat, map, mergeMap, Observable, Subscription } from 'rxjs';
import { IColumn } from 'src/app/api/models/api.model';
import { BoardsService } from 'src/app/api/services/boards/boards.service';
import { ColumnsService } from 'src/app/api/services/columns/columns.service';
import { UsersService } from 'src/app/api/services/users/users.service';
import { UtilsService } from 'src/app/api/services/utils/utils.service';
import {
  addColumn,
  clearColumns,
  disableCdkDrag,
  enableCdkDrag,
  fetchColumns,
  sortColumns,
} from 'src/app/store/actions/columns.actions';
import { fetchUsers, setCurrentUserId } from 'src/app/store/actions/users.actions';
import { selectCdkDragDisabled, selectColumns } from 'src/app/store/selectors/columns.selectors';
import { CreateColumnModalComponent } from '../../components/modals/create-column-modal/create-column-modal.component';
import { IBoardItem } from '../../models/board-item.model';
import { IColumnItem } from '../../models/column-item.model';
import { IUserItem } from '../../models/user-item.model';

@Component({
  selector: 'app-board-page',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.scss'],
})
export class BoardPageComponent implements OnInit, OnDestroy {
  private boardId!: string;

  public boardTitle!: string;

  public columns$!: Observable<IColumnItem[]>;

  private columns!: IColumnItem[];

  public cdkDragDisabled$!: Observable<boolean>;

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private usersService: UsersService,
    private boardsService: BoardsService,
    private columnsService: ColumnsService,
    private utilsService: UtilsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.boardId = this.route.snapshot.params.id;
    this.columns$ = this.store.select(selectColumns);
    this.cdkDragDisabled$ = this.store.select(selectCdkDragDisabled);
    this.initState();
    this.updateColumns();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.store.dispatch(clearColumns());
  }

  updateColumns = (): void => {
    const subscription = this.columns$.subscribe(columns => (this.columns = columns));
    this.subscriptions.push(subscription);
  };

  private initState = (): void => {
    const subscription = this.usersService
      .getUsers()
      .pipe(
        map((users: IUserItem[]) => {
          this.store.dispatch(fetchUsers({ users }));
          const currentUserLogin: string | null = this.utilsService.getLoginFromStorage();
          if (currentUserLogin) {
            const currentUserId: string = users.find(user => user.login === currentUserLogin)?.id || '';
            this.store.dispatch(setCurrentUserId({ currentUserId }));
          }
        }),
        mergeMap(() => this.boardsService.getBoardById(this.boardId))
      )
      .subscribe((board: IBoardItem) => {
        this.boardTitle = board.title;
        this.store.dispatch(fetchColumns({ columns: board.columns || [] }));
      });
    this.subscriptions.push(subscription);
  };

  private createColumn = (title: string): void => {
    const subscription = this.boardsService
      .getBoardById(this.boardId)
      .pipe(
        mergeMap((board: IBoardItem) => {
          const columns = board.columns || [];
          this.store.dispatch(fetchColumns({ columns }));
          const columnsOrders: number[] = columns.map(column => column.order);
          const newColumn: IColumn = {
            title,
            order: columnsOrders.length ? Math.max(...columnsOrders) + 1 : 1,
          };
          return this.columnsService.createColumn(this.boardId, newColumn);
        })
      )
      .subscribe((column: IColumnItem) => {
        this.store.dispatch(addColumn({ column }));
      });

    this.subscriptions.push(subscription);
  };

  public openCreateColumnDialog(): void {
    const dialogRef = this.dialog.open(CreateColumnModalComponent, {
      width: '300px',
      position: {
        top: 'calc(70px + 2rem)',
      },
    });

    const subscription = dialogRef.afterClosed().subscribe(title => {
      if (title && typeof title === 'string') this.createColumn(title);
    });
    this.subscriptions.push(subscription);
  }

  public drop(event: CdkDragDrop<IColumnItem[]>) {
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;

    if (previousIndex === currentIndex) return;
    this.store.dispatch(sortColumns({ previousIndex, currentIndex }));
    this.store.dispatch(disableCdkDrag());

    const updatedColumns: IColumnItem[] = [];

    let requests: Observable<IColumnItem>[] = [];

    const zeroOrderRequest$ = this.columnsService.updateColumn(this.boardId, this.columns[currentIndex].id, {
      title: this.columns[currentIndex].title,
      order: 0,
    });

    const setUpdatedColumns = (cb: (column: IColumnItem, index: number) => IColumnItem | null): void => {
      this.columns.forEach((column, index) => {
        const updatedColumn = cb(column, index);

        if (updatedColumn) {
          const request$ = this.columnsService.updateColumn(this.boardId, column.id, {
            title: updatedColumn.title,
            order: updatedColumn.order,
          });
          requests.push(request$);
          updatedColumns.push(updatedColumn);
        } else {
          updatedColumns.push(column);
        }
      });
    };

    if (previousIndex < currentIndex) {
      const getUpdatedColumn = (column: IColumnItem, index: number): IColumnItem | null => {
        if (index >= previousIndex && index < currentIndex) {
          return {
            id: column.id,
            title: column.title,
            order: column.order > 1 ? column.order - 1 : 1,
            tasks: column.tasks,
          };
        } else if (index === currentIndex) {
          return {
            id: column.id,
            title: column.title,
            order: this.columns[index - 1].order,
            tasks: column.tasks,
          };
        } else {
          return null;
        }
      };

      setUpdatedColumns(getUpdatedColumn);
    }

    if (previousIndex > currentIndex) {
      const getUpdatedColumn = (column: IColumnItem, index: number): IColumnItem | null => {
        if (index > currentIndex && index <= previousIndex) {
          return {
            id: column.id,
            title: column.title,
            order: column.order + 1,
            tasks: column.tasks,
          };
        } else if (index === currentIndex) {
          return {
            id: column.id,
            title: column.title,
            order: this.columns[index + 1].order,
            tasks: column.tasks,
          };
        } else {
          return null;
        }
      };
      setUpdatedColumns(getUpdatedColumn);
      requests = requests.reverse();
    }

    const subscription = concat(zeroOrderRequest$, ...requests).subscribe({
      complete: () => {
        this.store.dispatch(fetchColumns({ columns: updatedColumns }));
        this.store.dispatch(enableCdkDrag());
      },
    });

    this.subscriptions.push(subscription);
  }
}
