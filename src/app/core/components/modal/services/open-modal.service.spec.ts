import { TestBed } from '@angular/core/testing';

import { OpenConfirmationModalService } from './open-modal.service';

describe('OpenModalService', () => {
  let service: OpenConfirmationModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenConfirmationModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
