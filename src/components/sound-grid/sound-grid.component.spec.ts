import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cell, SoundGridComponent } from './sound-grid.component';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AudioService } from '../../services/audio.service';
import { Grid, SoundGridService } from '../../services/sound-grid.service';
import { instrumentColors } from '../../core/instrument-colors';
import { pianoFrequencies } from '../../core/piano-frequencies';
import { TempoLeverComponent } from '../tempo-lever/tempo-lever.component';
import { MaterialModule } from '../../core/modules/material.module';

describe('SoundGridComponent', () => {
  let component: SoundGridComponent;
  let fixture: ComponentFixture<SoundGridComponent>;
  let audioService: jasmine.SpyObj<AudioService>;
  let soundGridService: jasmine.SpyObj<SoundGridService>;

  beforeEach(async () => {
    const audioServiceSpy = jasmine.createSpyObj('AudioService', ['playTone']);
    const soundGridServiceSpy = jasmine.createSpyObj('SoundGridService', [
      'loadSavedGrids',
      'saveGrid',
      'loadGrid',
      'deleteGrid',
    ]);

    await TestBed.configureTestingModule({
      imports: [FormsModule, TempoLeverComponent, MaterialModule],
      declarations: [SoundGridComponent],
      providers: [
        { provide: AudioService, useValue: audioServiceSpy },
        { provide: SoundGridService, useValue: soundGridServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SoundGridComponent);
    component = fixture.componentInstance;
    audioService = TestBed.inject(AudioService) as jasmine.SpyObj<AudioService>;
    soundGridService = TestBed.inject(
      SoundGridService
    ) as jasmine.SpyObj<SoundGridService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize grid on init', () => {
    spyOn(component, 'initializeGrid');
    component.ngOnInit();
    expect(component.initializeGrid).toHaveBeenCalled();
  });

  it('should add columns to the grid', () => {
    const initialColumns = component.numberOfColumns;
    component.addColumns();
    expect(component.numberOfColumns).toBe(
      initialColumns + component.columnsToAdd
    );
    expect(component.grid[0].length).toBe(
      initialColumns + component.columnsToAdd
    );
  });

  it('should toggle cell activation and play tone', () => {
    const row = 0;
    const col = 0;
    component.toggleCell(row, col);
    expect(component.grid[row][col].active).toBeTrue();
    expect(audioService.playTone).toHaveBeenCalledWith(
      pianoFrequencies[row],
      component.currentInstrument
    );
  });

  it('should return correct cell color', () => {
    const cell: Cell = { active: true, instrument: 'sine' };
    expect(component.getCellColor(cell)).toBe(
      instrumentColors[cell.instrument]
    );
  });

  it('should reset the grid', () => {
    component.grid[0][0].active = true;
    component.resetGrid();
    expect(component.grid[0][0].active).toBeFalse();
  });

  it('should set tempo and restart playback', () => {
    spyOn(component, 'stopPlayback');
    spyOn(component, 'startPlayback');
    component.setTempo(120);
    expect(component.beatsPerMinute).toBe(120);
    expect(component.stopPlayback).toHaveBeenCalled();
    expect(component.startPlayback).toHaveBeenCalled();
  });

  it('should load saved grids', () => {
    const grids = [{ id: '1', name: 'Test Grid', grid: [] }];
    soundGridService.loadSavedGrids.and.returnValue(of(grids));
    component.loadSavedGrids();
    expect(component.savedGrids).toEqual(grids);
  });

  it('should save grid', () => {
    component.gridName = 'Test Grid';
    soundGridService.saveGrid.and.returnValue(of());
    spyOn(window, 'alert');
    component.saveGrid();
    expect(soundGridService.saveGrid).toHaveBeenCalledWith(
      'Test Grid',
      component.grid
    );
    expect(window.alert).toHaveBeenCalledWith('Grid saved successfully!');
  });

  it('should load grid', () => {
    const gridData: Grid = {
      name: 'grid',
      grid: [[{ active: false, instrument: 'sine' }]],
    };
    component.selectedGridId = '1';
    soundGridService.loadGrid.and.returnValue(of(gridData));
    component.loadGrid();
    expect(component.grid).toEqual(gridData.grid);
  });

  it('should delete grid', () => {
    component.selectedGridId = '1';
    soundGridService.deleteGrid.and.returnValue(of());
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    component.deleteGrid();
    expect(soundGridService.deleteGrid).toHaveBeenCalledWith('1');
    expect(window.alert).toHaveBeenCalledWith('Grid deleted successfully!');
  });
});
