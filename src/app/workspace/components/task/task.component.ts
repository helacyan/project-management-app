import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectUser } from 'src/app/store/selectors/users.selectors';
import { ITaskItem } from '../../models/task-item.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, OnDestroy {
  public title!: string;

  public order!: number;

  public description!: string;

  public executor!: string;

  public done!: boolean;

  private subscriptions: Subscription[] = [];

  @Input() task!: ITaskItem;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.title = this.task.title;
    this.description = this.task.description;
    this.setExecutor();
    this.done = this.task.done;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private setExecutor = (): void => {
    const subscription = this.store.select(selectUser(this.task.userId)).subscribe(user => {
      this.executor = user ? user.name : '';
    });
    this.subscriptions.push(subscription);
  };
}
