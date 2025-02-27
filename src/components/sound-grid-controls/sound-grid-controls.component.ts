import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MaterialModule } from '../../core/modules/material.module';
import { AlertService } from '../../shared/services/alert.service';
import { SoundGridService } from '../../services/sound-grid.service';
import { FormsModule } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-sound-grid-controls',
  imports: [MaterialModule, FormsModule],
  templateUrl: './sound-grid-controls.component.html',
  styleUrl: './sound-grid-controls.component.scss',
})
export class SoundGridControlsComponent implements OnChanges {
  @Output() addColumns = new EventEmitter<number>();
  @Output() playback = new EventEmitter<void>();
  @Output() selectedGrid = new EventEmitter<any>();
  @Output() stop = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();

  @Input() isPlaying = false;
  @Input() drawer!: MatDrawer;

  gridName = '';
  selectedGridId = '';
  savedGrids: any[] = [];

  constructor(
    private readonly alertService: AlertService,
    private readonly soundGridService: SoundGridService
  ) {}

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

    // method to get grid details
    const grid = [[]];
    this.soundGridService.saveGrid(this.gridName, grid).subscribe({
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
      next: (data) => {
        this.selectedGrid.emit(data.grid);
      },
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

  loadSavedGrids(): void {
    this.soundGridService.loadSavedGrids().subscribe({
      next: (grids) => (this.savedGrids = grids),
      error: (error: string) => this.alertService.error(error),
    });
  }
}
