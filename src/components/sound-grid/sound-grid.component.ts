import { Component, OnInit } from '@angular/core';
import { AudioService, InstrumentType } from '../../services/audio.service';
import { instrumentColors } from '../../core/instrument-colors';
import { TempoLeverComponent } from '../tempo-lever/tempo-lever.component';

interface Cell {
  active: boolean;
  instrument: InstrumentType;
}

@Component({
  selector: 'app-sound-grid',
  imports: [TempoLeverComponent],
  templateUrl: './sound-grid.component.html',
  styleUrl: './sound-grid.component.scss',
})
export class SoundGridComponent implements OnInit {
  grid: Cell[][] = [];
  frequencies: number[] = [];
  baseFrequencies: number[] = [
    261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25,
  ];
  beatsPerMinute: number = 240;
  instrumentCategories = [
    {
      name: 'Basic',
      instruments: [
        'sine',
        'square',
        'sawtooth',
        'triangle',
      ] as InstrumentType[],
    },
    {
      name: 'Orchestral',
      instruments: ['brass', 'flute', 'organ', 'strings'] as InstrumentType[],
    },
    {
      name: 'Melodic',
      instruments: ['bass', 'pluck', 'bell', 'marimba'] as InstrumentType[],
    },
    {
      name: 'Synthetic',
      instruments: ['synth1', 'synth2', 'synth3'] as InstrumentType[],
    },
  ];

  currentInstrument: InstrumentType = 'sine';
  isPlaying: boolean = false;
  currentColumn: number = 0;
  playbackInterval: any;

  instrumentColors = instrumentColors;

  constructor(private readonly audioService: AudioService) {}

  ngOnInit(): void {
    this.initializeGrid();
    window.addEventListener('resize', () => this.initializeGrid());
  }

  initializeGrid(): void {
    const numRows = Math.floor(window.innerHeight / 35);
    const numCols = Math.floor(window.innerWidth / 55);
    this.grid = Array(numRows)
      .fill(null)
      .map(() =>
        Array(numCols)
          .fill(null)
          .map(() => ({ active: false, instrument: 'sine' }))
      );

    this.generateFrequencies(numCols);
  }

  generateFrequencies(numCols: number): void {
    this.frequencies = [];
    const baseLength = this.baseFrequencies.length;

    for (let i = 0; i < numCols; i++) {
      this.frequencies.push(
        this.baseFrequencies[i % baseLength] * 2 ** Math.floor(i / baseLength)
      );
    }
  }

  selectInstrument(type: InstrumentType): void {
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
    const gridWidth =
      document.querySelector('.grid')?.clientWidth || window.innerWidth;
    const numCols = this.grid[0].length;
    const cellWidth = gridWidth / numCols;

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
}
