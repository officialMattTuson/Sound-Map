import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Grid {
  id?: string;
  name: string;
  grid: any[][];
}

@Injectable({
  providedIn: 'root',
})
export class SoundGridService {
  private readonly apiUrl = 'http://localhost:5000/grids';

  constructor(private readonly http: HttpClient) {}

  loadSavedGrids(): Observable<Grid[]> {
    return this.http.get<Grid[]>(this.apiUrl);
  }

  saveGrid(gridName: string, grid: any[][]): Observable<Grid> {
    return this.http.post<Grid>(this.apiUrl, { name: gridName, grid });
  }

  loadGrid(gridId: string): Observable<Grid> {
    return this.http.get<Grid>(`${this.apiUrl}/${gridId}`);
  }

  deleteGrid(gridId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${gridId}`);
  }
}
