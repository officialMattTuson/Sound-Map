import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AudioService, InstrumentType } from '../../services/audio.service';
import { instrumentColors } from '../../core/models/instrument-colors';
import { TempoLeverComponent } from '../tempo-lever/tempo-lever.component';
import {
  instrumentCategories,
  Instrument,
} from '../../core/models/instrument.model';
import { SoundGridService } from '../../services/sound-grid.service';
import { pianoFrequencies } from '../../core/models/piano-frequencies';
import { MaterialModule } from '../../core/modules/material.module';
import { AlertService } from '../../shared/services/alert.service';

export interface Cell {
  active: boolean;
  instrument: InstrumentType;
}

@Component({
  selector: 'app-sound-grid',
  imports: [TempoLeverComponent, FormsModule, MaterialModule],
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
  gridName = '';
  selectedGridId = '';
  savedGrids: any[] = [];

  numberOfColumns = 48;
  numberOfRows = 24;
  columnsToAdd = 8;

  instrumentColors = instrumentColors;

  constructor(
    private readonly audioService: AudioService,
    private readonly alertService: AlertService,
    private readonly soundGridService: SoundGridService
  ) {}

  ngOnInit(): void {
    this.initializeGrid();
    window.addEventListener('resize', () => this.initializeGrid());
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
  }

  getPlaybackLinePosition(): string {
    if (!this.isPlaying || !this.grid[0]) return '0px';
    const gridWidth = this.numberOfColumns * 48;
    const cellWidth = gridWidth / this.numberOfColumns;

    return `${this.currentColumn * cellWidth}px`;
  }

  resetGrid(): void {
    this.grid.forEach((row) => row.forEach((cell) => (cell.active = false)));
  }

  startPlayback(): void {
    const stepInterval = 60_000 / this.beatsPerMinute;

    if (this.isPlaying) return;

    this.isPlaying = true;
    this.currentColumn = 0;

    document.documentElement.style.setProperty(
      '--step-interval',
      `${stepInterval}ms`
    );

    this.playbackInterval = setInterval(() => {
      for (let row = 0; row < this.grid.length; row++) {
        const cell = this.grid[row][this.currentColumn];
        if (cell.active) {
          this.audioService.playTone(this.frequencies[row], cell.instrument);
        }
      }

      this.currentColumn = (this.currentColumn + 1) % this.grid[0].length;
    }, stepInterval);
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

  loadSavedGrids(): void {
    this.soundGridService.loadSavedGrids().subscribe({
      next: (grids) => (this.savedGrids = grids),
      error: (error: string) => this.alertService.error(error),
    });
  }

  saveGrid(): void {
    if (!this.gridName) {
      this.alertService.error('Please enter a name for your grid');
      return;
    }

    this.soundGridService.saveGrid(this.gridName, this.grid).subscribe({
      next: () => {
        this.loadSavedGrids();
        this.gridName = '';
        this.alertService.success('Grid saved successfully!');
      },
      error: (error: string) => this.alertService.error(error),
    });
  }

  loadGrid(): void {
    if (!this.selectedGridId) {
      this.alertService.error('Please select a grid to load');
      return;
    }

    this.soundGridService.loadGrid(this.selectedGridId).subscribe({
      next: (data) => (this.grid = data.grid),
      error: (error: string) => this.alertService.error(error),
    });
  }

  deleteGrid(): void {
    if (!this.selectedGridId) {
      this.alertService.error('Please select a grid to delete');
      return;
    }

    this.soundGridService.deleteGrid(this.selectedGridId).subscribe({
      next: () => {
        this.loadSavedGrids();
        this.selectedGridId = '';
        this.alertService.success('Grid deleted successfully!');
      },
      error: (error: string) => this.alertService.error(error),
    });
  }
}
