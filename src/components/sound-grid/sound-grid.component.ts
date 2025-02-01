import { Component, OnInit } from '@angular/core';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-sound-grid',
  imports: [],
  templateUrl: './sound-grid.component.html',
  styleUrl: './sound-grid.component.scss',
})
export class SoundGridComponent implements OnInit {
  grid: { active: boolean }[][] = [];
  frequencies: number[] = [];
  baseFrequencies: number[] = [
    261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25,
  ];

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
          .map(() => ({ active: false }))
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

  toggleCell(row: number, col: number): void {
    this.grid[row][col].active = !this.grid[row][col].active;
    if (this.grid[row][col].active) {
      this.audioService.playTone(this.frequencies[row]);
    }
  }

  resetGrid(): void {
    this.grid.forEach((row) => row.forEach((cell) => (cell.active = false)));
  }
}
