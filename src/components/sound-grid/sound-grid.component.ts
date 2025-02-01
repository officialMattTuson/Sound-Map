import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AudioService, InstrumentType } from '../../services/audio.service';

interface Cell {
  active: boolean;
  instrument: InstrumentType;
}

@Component({
  selector: 'app-sound-grid',
  imports: [],
  templateUrl: './sound-grid.component.html',
  styleUrl: './sound-grid.component.scss',
})
export class SoundGridComponent implements OnInit {
  grid: Cell[][] = [];
  frequencies: number[] = [];
  baseFrequencies: number[] = [
    261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25,
  ];
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

  instrumentColors: Record<InstrumentType, string> = {
    // Basic waveforms
    sine: '#4CAF50', // Green
    square: '#2196F3', // Blue
    sawtooth: '#F44336', // Red
    triangle: '#9C27B0', // Purple

    // Orchestral
    brass: '#FF9800', // Orange
    flute: '#00BCD4', // Cyan
    organ: '#795548', // Brown
    strings: '#9E9E9E', // Gray

    // Melodic
    bass: '#607D8B', // Blue Gray
    pluck: '#E91E63', // Pink
    bell: '#FFEB3B', // Yellow
    marimba: '#FF5722', // Deep Orange

    // Synthetic
    synth1: '#8BC34A', // Light Green
    synth2: '#673AB7', // Deep Purple
    synth3: '#009688', // Teal
  };

  constructor(private readonly audioService: AudioService, private readonly cdr: ChangeDetectorRef) {}

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
    const gridWidth = document.querySelector('.grid')?.clientWidth || window.innerWidth;
    const numCols = this.grid[0].length;
    const cellWidth = gridWidth / numCols; // Dynamically adjust for grid size
  
    return `${this.currentColumn * cellWidth}px`;
  }
  
  
  resetGrid(): void {
    this.grid.forEach((row) => row.forEach((cell) => (cell.active = false)));
  }

  startPlayback(): void {
    this.isPlaying = true;
    this.currentColumn = 0;
    this.playbackInterval = setInterval(() => {
      for (let row = 0; row < this.grid.length; row++) {
        const cell = this.grid[row][this.currentColumn];
        if (cell.active) {
          this.audioService.playTone(this.frequencies[row], cell.instrument);
        }
      }
  
      this.currentColumn = (this.currentColumn + 1) % this.grid[0].length;
    }, 250); // Adjust speed if needed
  }
  
  stopPlayback(): void {
    clearInterval(this.playbackInterval);
    this.currentColumn = 0;
  }
}
