import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AudioService, InstrumentType } from '../../services/audio.service';
import { instrumentColors } from '../../core/instrument-colors';
import { TempoLeverComponent } from '../tempo-lever/tempo-lever.component';
import { instrumentCategories, Instrument } from '../../core/instrument.model';
import { SoundGridService } from '../../services/sound-grid.service';
import { pianoFrequencies } from '../../core/piano-frequencies';
import { MaterialModule } from '../../core/modules/material.module';

interface Cell {
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

  getCellColor(cell: Cell): string {
    return cell.active ? this.instrumentColors[cell.instrument] : '#573a46';
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
      error: (err) => console.error('Failed to load saved grids:', err),
    });
  }

  saveGrid(): void {
    if (!this.gridName) {
      alert('Please enter a name for your grid');
      return;
    }

    this.soundGridService.saveGrid(this.gridName, this.grid).subscribe({
      next: () => {
        this.loadSavedGrids();
        this.gridName = '';
        alert('Grid saved successfully!');
      },
      error: (error) => console.log(error),
    });
  }

  loadGrid(): void {
    if (!this.selectedGridId) {
      alert('Please select a grid to load');
      return;
    }

    this.soundGridService.loadGrid(this.selectedGridId).subscribe({
      next: (data) => (this.grid = data.grid),
      error: () => alert('Failed to load grid'),
    });
  }

  deleteGrid(): void {
    if (!this.selectedGridId) {
      alert('Please select a grid to delete');
      return;
    }

    if (!confirm('Are you sure you want to delete this grid?')) return;

    this.soundGridService.deleteGrid(this.selectedGridId).subscribe({
      next: () => {
        this.loadSavedGrids();
        this.selectedGridId = '';
        alert('Grid deleted successfully!');
      },
      error: () => alert('Failed to delete grid'),
    });
  }
}
