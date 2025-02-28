import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MaterialModule } from '../../core/modules/material.module';
import { AlertService } from '../../shared/services/alert.service';
import { SoundGridApiService } from '../../services/sound-grid-api.service';
import { FormsModule } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { GridService } from '../../services/grid.service';
import { Grid } from '../../shared/models/grid.model';

@Component({
  selector: 'app-sound-grid-controls',
  imports: [MaterialModule, FormsModule],
  templateUrl: './sound-grid-controls.component.html',
  styleUrl: './sound-grid-controls.component.scss',
})
export class SoundGridControlsComponent implements OnInit, OnChanges {
  @Output() addColumns = new EventEmitter<number>();
  @Output() playback = new EventEmitter<void>();
  @Output() stop = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();

  @Input() isPlaying = false;
  @Input() drawer!: MatDrawer;

  gridName = '';
  selectedGridId = '';
  savedGrids: Grid[] = [];

  constructor(
    private readonly alertService: AlertService,
    private readonly gridService: GridService,
    private readonly soundGridApiService: SoundGridApiService
  ) {}

  ngOnInit(): void {
    this.loadSavedGrids();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isPlaying']) {
      this.isPlaying = changes['isPlaying'].currentValue;
    }
  }

  closeDrawer(): void {
    this.drawer.close();
  }

  onStartPlayback(): void {
    this.playback.emit();
  }

  onStopPlayback(): void {
    this.stop.emit();
  }

  onClearGrid(): void {
    this.clear.emit();
  }

  onAddColumns(): void {
    this.addColumns.emit();
  }

  saveGrid(): void {
    if (!this.gridName) {
      this.alertService.error('Please enter a name for your grid');
      return;
    }

    const grid = this.gridService.getGrid();
    this.soundGridApiService.saveGrid(this.gridName, grid).subscribe({
      next: (grid) => {
        this.loadSavedGrids();
        this.gridService.addToGridList(grid);
        this.gridName = '';
        this.alertService.success('Grid saved successfully!');
      },
      error: (error: string) => this.alertService.error(error),
    });
  }

  loadGrid(grid: any): void {
    this.selectedGridId = grid._id;
    if (!this.selectedGridId) {
      this.alertService.error('Please select a grid to load');
      return;
    }

    this.soundGridApiService.loadGrid(this.selectedGridId).subscribe({
      next: (data) => {
        this.gridService.setGrid(data.grid);
        this.gridService.setSelectedGridId(data._id);
      },
      error: (error: string) => this.alertService.error(error),
    });
  }

  deleteGrid(): void {
    if (!this.selectedGridId) {
      this.alertService.error('Please select a grid to delete');
      return;
    }

    this.soundGridApiService.deleteGrid(this.selectedGridId).subscribe({
      next: () => {
        this.loadSavedGrids();
        this.gridService.removeFromGridList(this.selectedGridId);
        this.selectedGridId = '';
        this.alertService.success('Grid deleted successfully!');
      },
      error: (error: string) => this.alertService.error(error),
    });
  }

  loadSavedGrids(): void {
    this.soundGridApiService.loadSavedGrids().subscribe({
      next: (grids) => {
        grids.forEach((grid) => {
          this.gridService.addToGridList(grid);
        });
        this.savedGrids = grids;
      },
      error: (error: string) => this.alertService.error(error),
    });
  }
}
