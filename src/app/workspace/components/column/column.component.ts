import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, mergeMap, Subscription } from 'rxjs';
import { IColumn } from 'src/app/api/models/api.model';
import { BoardsService } from 'src/app/api/services/boards/boards.service';
import { ColumnsService } from 'src/app/api/services/columns/columns.service';
import { OpenConfirmationModalService } from 'src/app/core/components/modal/services/open-modal.service';
import { fetchColumns } from 'src/app/store/actions/columns.actions';
import { IBoardItem } from '../../models/board-item.model';
import { IColumnItem } from '../../models/column-item.model';
import { ITaskItem } from '../../models/task-item.model';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent implements OnInit, OnDestroy {
  private boardId!: string;

  public title$!: BehaviorSubject<string>;

  public tasks!: ITaskItem[];

  public isTitleVisible$!: BehaviorSubject<boolean>;

  public isTitleInputVisible$!: BehaviorSubject<boolean>;

  public editTitleForm!: FormGroup;

  private subscriptions: Subscription[] = [];

  @Input() column!: IColumnItem;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store,
    private boardsService: BoardsService,
    private columnsService: ColumnsService,
    private readonly openConfirmationModalService: OpenConfirmationModalService
  ) {}

  ngOnInit(): void {
    this.boardId = this.route.snapshot.params.id;
    this.title$ = new BehaviorSubject<string>(this.column.title);
    this.tasks = this.column.tasks ? this.column.tasks : [];
    this.isTitleVisible$ = new BehaviorSubject<boolean>(true);
    this.isTitleInputVisible$ = new BehaviorSubject<boolean>(false);
    this.editTitleForm = this.fb.group({
      title: [this.column.title],
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public showEditTitleInput = (): void => {
    this.isTitleVisible$.next(false);
    this.isTitleInputVisible$.next(true);
  };

  private hideEditTitleInput = (): void => {
    this.isTitleVisible$.next(true);
    this.isTitleInputVisible$.next(false);
  };

  private updateColumnsState = (board: IBoardItem) =>
    this.store.dispatch(fetchColumns({ columns: board.columns || [] }));

  private updateColumn = (newColumn: IColumn): void => {
    const subscription = this.columnsService
      .updateColumn(this.boardId, this.column.id, newColumn)
      .pipe(mergeMap(() => this.boardsService.getBoardById(this.boardId)))
      .subscribe((board: IBoardItem) => this.updateColumnsState(board));

    this.subscriptions.push(subscription);
  };

  public onTitleSubmit = (): void => {
    const newTitle = this.editTitleForm.controls.title.value;
    if (this.title$.value !== newTitle) {
      this.title$.next(newTitle);
      const newColumn: IColumn = {
        title: newTitle,
        order: this.column.order,
      };
      this.updateColumn(newColumn);
    }

    this.hideEditTitleInput();
  };

  public onTitleCancel = (): void => {
    this.hideEditTitleInput();
  };

  private deleteColumn = (): void => {
    const subscription = this.columnsService
      .deleteColumn(this.boardId, this.column.id)
      .pipe(mergeMap(() => this.boardsService.getBoardById(this.boardId)))
      .subscribe((board: IBoardItem) => this.updateColumnsState(board));

    this.subscriptions.push(subscription);
  };

  public onDeleteButtonClick() {
    const subscription = this.openConfirmationModalService.openConfirmationDialog().subscribe(res => {
      if (res === true) {
        this.deleteColumn();
      }
    });

    this.subscriptions.push(subscription);
  }
}
