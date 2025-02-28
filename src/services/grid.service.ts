import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Cell, Grid } from '../shared/models/grid.model';

@Injectable({
  providedIn: 'root',
})
export class GridService {
  private readonly _grid$ = new BehaviorSubject<Cell[][]>([]);
  public readonly grid = this._grid$.asObservable();

  private readonly _selectedGridId$ = new BehaviorSubject<string>('');
  public readonly selectedGridId = this._selectedGridId$.asObservable();

  private readonly _gridsList$ = new BehaviorSubject<Grid[]>([]);
  public readonly gridsList = this._gridsList$.asObservable();

  constructor() {}

  setGrid(grid: Cell[][]): void {
    this._grid$.next(grid);
  }

  setSelectedGridId(id: string): void {
    this._selectedGridId$.next(id);
  }

  addToGridList(grid: Grid): void {
    const grids = this._gridsList$.getValue();
    if (grids.find((g) => g._id === grid._id)) {
      return;
    }
    grids.push(grid);
    this._gridsList$.next(grids);
  }

  removeFromGridList(id: string): void {
    const grids = this._gridsList$.getValue();
    const index = grids.findIndex((g) => g._id === id);
    if (index === -1) {
      return;
    }
    grids.splice(index, 1);
    this._gridsList$.next(grids);
  }

  resetSelectedGridId(): void {
    this._selectedGridId$.next('');
  }

  getGrid(): Cell[][] {
    return this._grid$.getValue();
  }

  getSelectedGridId(): string {
    return this._selectedGridId$.getValue();
  }

  getGridById(id: string): Observable<Grid | undefined> {
    return of(this._gridsList$.getValue().find((grid) => grid._id === id));
  }
}
