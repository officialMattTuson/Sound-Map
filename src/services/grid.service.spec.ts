import { TestBed } from '@angular/core/testing';
import { GridService } from './grid.service';
import { Cell, Grid } from '../shared/models/grid.model';

describe('GridService', () => {
  let service: GridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get grid', () => {
    // Arrange
    const grid: Cell[][] = [];

    // Act
    service.setGrid(grid);

    // Assert
    expect(service.getGrid()).toEqual(grid);
  });

  it('should set and get selected grid id', () => {
    // Arrange
    const id = '123';

    // Act
    service.setSelectedGridId(id);

    // Assert
    expect(service.getSelectedGridId()).toBe(id);
  });

  it('should add to grid list', () => {
    const grid: Grid = { _id: '123', name: 'Test', grid: [] };
    service.addToGridList(grid);
    service.gridsList.subscribe((grids) => {
      expect(grids).toContain(grid);
    });
  });

  it('should not add duplicate grid to grid list', () => {
    const grid: Grid = { _id: '123', name: 'Test', grid: [] };
    service.addToGridList(grid);
    service.addToGridList(grid);
    service.gridsList.subscribe((grids) => {
      expect(grids.length).toBe(1);
    });
  });

  it('should remove from grid list', () => {
    const grid: Grid = { _id: '123', name: 'Test', grid: [] };
    service.addToGridList(grid);
    service.removeFromGridList(grid._id);
    service.gridsList.subscribe((grids) => {
      expect(grids).not.toContain(grid);
    });
  });

  it('should reset selected grid id', () => {
    service.setSelectedGridId('123');
    service.resetSelectedGridId();
    expect(service.getSelectedGridId()).toBe('');
  });

  it('should get grid by id', (done) => {
    const grid: Grid = { _id: '123', name: 'Test', grid: [] };
    service.addToGridList(grid);
    service.getGridById(grid._id).subscribe((foundGrid) => {
      expect(foundGrid).toEqual(grid);
      done();
    });
  });

  it('should return undefined for non-existing grid id', (done) => {
    service.getGridById('non-existing-id').subscribe((foundGrid) => {
      expect(foundGrid).toBeUndefined();
      done();
    });
  });
});
