import { TestBed } from '@angular/core/testing';

import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { SoundGridApiService } from './sound-grid-api.service';
import { provideHttpClient } from '@angular/common/http';
import { Grid } from '../shared/models/grid.model';
import { Instrument } from '../core/models/instrument.model';

describe('SoundGridApiService', () => {
  let service: SoundGridApiService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5000/grids';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SoundGridApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(SoundGridApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve saved grids', () => {
    // Arrange
    const mockGrids: Grid[] = [
      { _id: '1', name: 'Grid 1', grid: [[]] },
      { _id: '2', name: 'Grid 2', grid: [[]] }
    ];

    // Act
    service.loadSavedGrids().subscribe(grids => {
      // Assert
      expect(grids.length).toBe(2);
      expect(grids).toEqual(mockGrids);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
  });

  it('should save a grid', () => {
    // Arrange
    const mockGrid: Grid = { _id: '1', name: 'New Grid', grid: [[{active: true, instrument: Instrument.Bell}], [{active: true, instrument: Instrument.Flute}]] };

    // Act
    service.saveGrid('New Grid', [[{active: true, instrument: Instrument.Bell}], [{active: true, instrument: Instrument.Flute}]]).subscribe(grid => {
      // Assert
      expect(grid).toEqual(mockGrid);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'New Grid', grid: [[{active: true, instrument: Instrument.Bell}], [{active: true, instrument: Instrument.Flute}]] });
  });

  it('should load a specific grid', () => {
    // Arrange
    const gridId = '1';
    const mockGrid: Grid = { _id: gridId, name: 'Loaded Grid', grid: [[{active: false, instrument: Instrument.Sine}], [{active: true, instrument: Instrument.Flute}]] };

    // Act
    service.loadGrid(gridId).subscribe(grid => {
      // Assert
      expect(grid).toEqual(mockGrid);
    });

    const req = httpMock.expectOne(`${apiUrl}/${gridId}`);
    expect(req.request.method).toBe('GET');
  });

  it('should delete a grid', () => {
    // Arrange
    const gridId = '1';

    // Act
    service.deleteGrid(gridId).subscribe(response => {
      // Assert
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/${gridId}`);
    expect(req.request.method).toBe('DELETE');
  });
});
