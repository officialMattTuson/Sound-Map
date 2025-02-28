import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cell, Grid } from '../shared/models/grid.model';

@Injectable({
  providedIn: 'root',
})
export class SoundGridApiService {
  private readonly apiUrl = 'http://localhost:5000/grids';

  constructor(private readonly http: HttpClient) {}

  loadSavedGrids(): Observable<Grid[]> {
    return this.http.get<Grid[]>(this.apiUrl);
  }

  saveGrid(gridName: string, grid: Cell[][]): Observable<Grid> {
    return this.http.post<Grid>(this.apiUrl, { name: gridName, grid });
  }

  loadGrid(gridId: string): Observable<Grid> {
    return this.http.get<Grid>(`${this.apiUrl}/${gridId}`);
  }

  deleteGrid(gridId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${gridId}`);
  }
}
