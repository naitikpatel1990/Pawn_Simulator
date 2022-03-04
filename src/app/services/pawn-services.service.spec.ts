import { TestBed } from '@angular/core/testing';

import { PawnServicesService } from './pawn-services.service';

describe('PawnServicesService', () => {
  let service: PawnServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PawnServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
