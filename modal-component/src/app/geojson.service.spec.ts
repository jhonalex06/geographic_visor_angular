import { TestBed } from '@angular/core/testing';

import { GeojsonService } from './geojson.service';

describe('GeojsonService', () => {
  let service: GeojsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeojsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
