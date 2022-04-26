import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailedComponent } from './task-detailed.component';

describe('TaskDetailedComponent', () => {
  let component: TaskDetailedComponent;
  let fixture: ComponentFixture<TaskDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskDetailedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
