import { TestBed } from '@angular/core/testing';

import { OpenCreateBoardModalService } from './open-create-board-modal.service';

describe('OpenCreateBoardModalService', () => {
  let service: OpenCreateBoardModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenCreateBoardModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
