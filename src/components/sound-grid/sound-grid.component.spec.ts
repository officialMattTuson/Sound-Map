import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SoundGridComponent } from './sound-grid.component';
import { AudioService } from '../../services/audio.service';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../core/modules/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Instrument } from '../../core/models/instrument.model';
import { provideHttpClient } from '@angular/common/http';

describe('SoundGridComponent', () => {
  let component: SoundGridComponent;
  let fixture: ComponentFixture<SoundGridComponent>;
  let audioServiceMock: jasmine.SpyObj<AudioService>;

  beforeEach(() => {
    audioServiceMock = jasmine.createSpyObj('AudioService', ['playTone']);

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MaterialModule,
        NoopAnimationsModule,
        SoundGridComponent,
      ],
      providers: [
        { provide: AudioService, useValue: audioServiceMock },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SoundGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the grid on init', () => {
    spyOn(component, 'initializeGrid');
    component.ngOnInit();
    expect(component.initializeGrid).toHaveBeenCalled();
  });

  it('should add event listener for resize on init', () => {
    spyOn(window, 'addEventListener');
    component.ngOnInit();
    expect(window.addEventListener).toHaveBeenCalledWith(
      'resize',
      jasmine.any(Function)
    );
  });

  it('should initialize grid with correct dimensions', () => {
    component.initializeGrid();
    expect(component.grid.length).toBe(component.numberOfRows);
    expect(component.grid[0].length).toBe(component.numberOfColumns);
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

  it('should scroll right after adding columns', (done) => {
    spyOn(document, 'querySelector').and.returnValue({
      scrollLeft: 0,
      scrollWidth: 500,
    } as HTMLElement);
    component.addColumns();
    setTimeout(() => {
      expect(document.querySelector).toHaveBeenCalledWith('.grid');
      done();
    }, 50);
  });

  it('should toggle a cell and play tone when activated', () => {
    component.initializeGrid();
    const row = 0,
      col = 0;

    component.toggleCell(row, col);
    expect(component.grid[row][col].active).toBeTrue();
    expect(component.grid[row][col].instrument).toBe(
      component.currentInstrument
    );
    expect(audioServiceMock.playTone).toHaveBeenCalledWith(
      component.frequencies[row],
      component.grid[row][col].instrument
    );
  });

  it('should reset the grid', () => {
    component.initializeGrid();
    component.grid[0][0].active = true;
    component.resetGrid();
    expect(
      component.grid.every((row) => row.every((cell) => !cell.active))
    ).toBeTrue();
  });

  it('should start playback and update playback position', (done) => {
    spyOn(component as any, 'updatePlayback');
    component.startPlayback();
    expect(component.isPlaying).toBeTrue();
    setTimeout(() => {
      expect((component as any).updatePlayback).toHaveBeenCalled();
      done();
    }, 60_000 / component.beatsPerMinute);
  });

  it('should stop playback', () => {
    component.isPlaying = true;
    component.stopPlayback();
    expect(component.isPlaying).toBeFalse();
    expect(component.currentColumn).toBe(0);
  });

  it('should update playback position and play active cells', () => {
    component.initializeGrid();
    component.grid[0][0].active = true;
    (component as any).updatePlayback();
    expect(audioServiceMock.playTone).toHaveBeenCalledWith(
      component.frequencies[0],
      component.grid[0][0].instrument
    );
    expect(component.currentColumn).toBe(1);
  });

  it('should get correct playback line position', () => {
    component.numberOfColumns = 50;
    component.currentColumn = 10;
    expect(component.getPlaybackLinePosition()).toBe(
      `${(10 * (50 * 48)) / 50}px`
    );
  });

  it('should set tempo and restart playback', () => {
    spyOn(component, 'stopPlayback');
    spyOn(component, 'startPlayback');
    component.setTempo(180);
    expect(component.beatsPerMinute).toBe(180);
    expect(component.stopPlayback).toHaveBeenCalled();
    expect(component.startPlayback).toHaveBeenCalled();
  });

  it('should set the selected instrument', () => {
    component.selectInstrument(Instrument.Sine);
    expect(component.currentInstrument).toBe('sine');
  });
});
