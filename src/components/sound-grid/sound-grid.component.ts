import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../services/audio.service';
import { instrumentColors } from '../../core/models/instrument-colors';
import { TempoLeverComponent } from '../tempo-lever/tempo-lever.component';
import {
  instrumentCategories,
  Instrument,
} from '../../core/models/instrument.model';
import { pianoFrequencies } from '../../core/models/piano-frequencies';
import { MaterialModule } from '../../core/modules/material.module';
import { SoundGridControlsComponent } from '../sound-grid-controls/sound-grid-controls.component';
import { MatDrawer } from '@angular/material/sidenav';
import { Cell } from '../../shared/models/grid.model';
import { GridService } from '../../services/grid.service';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-sound-grid',
  imports: [
    TempoLeverComponent,
    FormsModule,
    MaterialModule,
    SoundGridControlsComponent,
  ],
  templateUrl: './sound-grid.component.html',
  styleUrl: './sound-grid.component.scss',
})
export class SoundGridComponent implements OnInit {
  grid: Cell[][] = [];
  frequencies = pianoFrequencies;

  beatsPerMinute = 240;
  instrumentCategories = instrumentCategories;
  currentInstrument = Instrument.Sine;
  isPlaying = false;
  currentColumn = 0;
  playbackInterval: any;

  numberOfColumns = 48;
  numberOfRows = 24;
  columnsToAdd = 8;

  instrumentColors = instrumentColors;

  @ViewChild('drawer') drawer!: MatDrawer;

  constructor(
    private readonly audioService: AudioService,
    private readonly gridService: GridService
  ) {}

  ngOnInit(): void {
    this.initializeGrid();
    window.addEventListener('resize', () => this.initializeGrid());
    this.observeGridChanges();
  }

  observeGridChanges(): void {
    this.gridService.selectedGridId
      .pipe(switchMap((id) => this.gridService.getGridById(id)))
      .subscribe((grid) => {
        if (!grid) {
          return;
        }
        this.grid = grid.grid;
      });
  }

  initializeGrid(): void {
    this.grid = Array.from({ length: this.numberOfRows }, () =>
      Array.from({ length: this.numberOfColumns }, () => ({
        active: false,
        instrument: this.currentInstrument,
      }))
    );
  }

  addColumns() {
    this.numberOfColumns += this.columnsToAdd;
    this.grid.forEach((row) => {
      for (let i = 0; i < this.columnsToAdd; i++) {
        row.push({ active: false, instrument: this.currentInstrument });
      }
    });

    setTimeout(() => {
      const gridElement = document.querySelector('.grid') as HTMLElement;
      if (gridElement) {
        gridElement.scrollLeft = gridElement.scrollWidth;
      }
    }, 50);
  }
  selectInstrument(type: Instrument): void {
    this.currentInstrument = type;
  }

  toggleCell(row: number, col: number): void {
    const cell = this.grid[row][col];
    cell.active = !cell.active;

    if (cell.active) {
      cell.instrument = this.currentInstrument;
      this.audioService.playTone(this.frequencies[row], cell.instrument);
    }
    this.gridService.setGrid(this.grid);
  }

  getPlaybackLinePosition(): string {
    if (!this.grid || this.grid[0].length === 0) return '0%';

    const gridWidth = this.numberOfColumns * 48;
    const cellWidth = gridWidth / this.numberOfColumns;

    return `${this.currentColumn * cellWidth}px`;
  }

  resetGrid(): void {
    this.grid.forEach((row) => row.forEach((cell) => (cell.active = false)));
  }

  startPlayback(): void {
    const stepInterval = 60_000 / this.beatsPerMinute;

    if (this.isPlaying) {
      clearInterval(this.playbackInterval);
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;

    document.documentElement.style.setProperty(
      '--step-interval',
      `${stepInterval}ms`
    );

    this.playbackInterval = setInterval(() => {
      this.updatePlayback();
    }, stepInterval);
  }

  private updatePlayback(): void {
    for (let row = 0; row < this.grid.length; row++) {
      const cell = this.grid[row][this.currentColumn];
      if (cell.active) {
        this.audioService.playTone(this.frequencies[row], cell.instrument);
      }
    }

    this.currentColumn = (this.currentColumn + 1) % this.grid[0].length;
  }

  stopPlayback(): void {
    clearInterval(this.playbackInterval);
    this.currentColumn = 0;
    this.isPlaying = false;
  }

  setTempo(newBPM: number) {
    this.beatsPerMinute = newBPM;
    this.stopPlayback();
    this.startPlayback();
  }
}
