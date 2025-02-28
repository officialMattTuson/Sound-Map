import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoundGridControlsComponent } from './sound-grid-controls.component';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AlertService } from '../../shared/services/alert.service';
import { Grid, SoundGridApiService } from '../../services/sound-grid-api.service';
import { MatDrawer } from '@angular/material/sidenav';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatButtonHarness } from '@angular/material/button/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('SoundGridControlsComponent', () => {
  let component: SoundGridControlsComponent;
  let fixture: ComponentFixture<SoundGridControlsComponent>;
  let alertService: jasmine.SpyObj<AlertService>;
  let SoundGridApiService: jasmine.SpyObj<SoundGridApiService>;
  let mockDrawer: jasmine.SpyObj<MatDrawer>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    mockDrawer = jasmine.createSpyObj('MatDrawer', ['open', 'close'], {
      opened: false,
    });
    const alertServiceSpy = jasmine.createSpyObj('AlertService', [
      'error',
      'success',
    ]);
    const SoundGridApiServiceSpy = jasmine.createSpyObj('SoundGridApiService', [
      'saveGrid',
      'loadGrid',
      'deleteGrid',
      'loadSavedGrids',
    ]);

    await TestBed.configureTestingModule({
      imports: [FormsModule, SoundGridControlsComponent],
      providers: [
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: SoundGridApiService, useValue: SoundGridApiServiceSpy },
        { provide: MatDrawer, useValue: mockDrawer },
        provideAnimationsAsync(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SoundGridControlsComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    SoundGridApiService = TestBed.inject(
      SoundGridApiService
    ) as jasmine.SpyObj<SoundGridApiService>;
    component.drawer = mockDrawer;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('buttons', () => {
    it('should call onStartPlayback when play button is clicked', () => {
      spyOn(component, 'onStartPlayback');
      const button = fixture.nativeElement.querySelector('.play-button');
      button.click();
      expect(component.onStartPlayback).toHaveBeenCalled();
    });

    it('should call onStopPlayback when stop button is clicked', () => {
      spyOn(component, 'onStopPlayback');
      const button = fixture.nativeElement.querySelector('.stop-button');
      button.click();
      expect(component.onStopPlayback).toHaveBeenCalled();
    });

    it('should call onClearGrid when reset button is clicked', () => {
      spyOn(component, 'onClearGrid');
      const button = fixture.nativeElement.querySelector('.reset-button');
      button.click();
      expect(component.onClearGrid).toHaveBeenCalled();
    });

    it('should call onAddColumns when add button is clicked', () => {
      spyOn(component, 'onAddColumns');
      const button = fixture.nativeElement.querySelector('.add-button');
      button.click();
      expect(component.onAddColumns).toHaveBeenCalled();
    });

    it('should call saveGrid when save button is clicked', async () => {
      spyOn(component, 'saveGrid');
      const button = await loader.getHarness(
        MatButtonHarness.with({ selector: '#save-btn' })
      );
      await button.click();
      expect(component.saveGrid).toHaveBeenCalled();
    });

    it('should call loadGrid when load button is clicked', async () => {
      spyOn(component, 'loadGrid');
      const button = await loader.getHarness(
        MatButtonHarness.with({ selector: '#load-btn' })
      );
      await button.click();
      expect(component.loadGrid).toHaveBeenCalled();
    });

    it('should call deleteGrid when delete button is clicked', async () => {
      spyOn(component, 'deleteGrid');
      const button = await loader.getHarness(
        MatButtonHarness.with({ selector: '#delete-btn' })
      );
      await button.click();
      expect(component.deleteGrid).toHaveBeenCalled();
    });
  });

  it('should emit playback event on start playback', () => {
    // Arrange
    spyOn(component.playback, 'emit');

    // Act
    component.onStartPlayback();

    // Assert
    expect(component.playback.emit).toHaveBeenCalled();
  });

  it('should emit stop event on stop playback', () => {
    // Arrange
    spyOn(component.stop, 'emit');

    // Act
    component.onStopPlayback();

    // Assert
    expect(component.stop.emit).toHaveBeenCalled();
  });

  it('should emit clear event on clear grid', () => {
    // Arrange
    spyOn(component.clear, 'emit');

    // Act
    component.onClearGrid();

    // Assert
    expect(component.clear.emit).toHaveBeenCalled();
  });

  it('should emit addColumns event on add columns', () => {
    // Arrange
    spyOn(component.addColumns, 'emit');

    // Act
    component.onAddColumns();

    // Assert
    expect(component.addColumns.emit).toHaveBeenCalled();
  });

  it('should close drawer', () => {
    // Act
    component.closeDrawer();

    // Assert
    expect(component.drawer.close).toHaveBeenCalled();
  });

  it('should save grid and show success alert', () => {
    // Arrange
    component.gridName = 'Test Grid';
    const gridData: Grid = { name: 'Test Grid', grid: [[]] };
    SoundGridApiService.saveGrid.and.returnValue(of(gridData));
    spyOn(component, 'loadSavedGrids');

    // Act
    component.saveGrid();

    // Assert
    expect(SoundGridApiService.saveGrid).toHaveBeenCalledWith('Test Grid', [[]]);
    expect(component.loadSavedGrids).toHaveBeenCalled();
    expect(component.gridName).toBe('');
    expect(alertService.success).toHaveBeenCalledWith(
      'Grid saved successfully!'
    );
  });

  it('should show error alert if grid name is empty on save', () => {
    // Arrange
    component.gridName = '';

    // Act
    component.saveGrid();

    // Assert
    expect(alertService.error).toHaveBeenCalledWith(
      'Please enter a name for your grid'
    );
  });

  it('should load grid and emit selected grid', () => {
    // Arrange
    component.selectedGridId = '123';
    const gridData: Grid = { name: 'test', grid: [[]] };
    SoundGridApiService.loadGrid.and.returnValue(of(gridData));
    spyOn(component.selectedGrid, 'emit');

    // Act
    component.loadGrid();

    // Assert
    expect(SoundGridApiService.loadGrid).toHaveBeenCalledWith('123');
    expect(component.selectedGrid.emit).toHaveBeenCalledWith(gridData.grid);
  });

  it('should show error alert if no grid is selected on load', () => {
    // Arrange
    component.selectedGridId = '';

    // Act
    component.loadGrid();

    // Assert
    expect(alertService.error).toHaveBeenCalledWith(
      'Please select a grid to load'
    );
  });

  it('should delete grid and show success alert', () => {
    // Arrange
    component.selectedGridId = '123';
    SoundGridApiService.deleteGrid.and.returnValue(of(void 0));
    spyOn(component, 'loadSavedGrids');

    // Act
    component.deleteGrid();

    // Assert
    expect(SoundGridApiService.deleteGrid).toHaveBeenCalledWith('123');
    expect(component.loadSavedGrids).toHaveBeenCalled();
    expect(component.selectedGridId).toBe('');
    expect(alertService.success).toHaveBeenCalledWith(
      'Grid deleted successfully!'
    );
  });

  it('should show error alert if no grid is selected on delete', () => {
    // Arrange
    component.selectedGridId = '';

    // Act
    component.deleteGrid();

    // Assert
    expect(alertService.error).toHaveBeenCalledWith(
      'Please select a grid to delete'
    );
  });

  it('should load saved grids', () => {
    // Arrange
    const gridData: Grid[] = [{ name: 'test', grid: [[]] }];
    SoundGridApiService.loadSavedGrids.and.returnValue(of(gridData));

    // Act
    component.loadSavedGrids();

    // Assert
    expect(SoundGridApiService.loadSavedGrids).toHaveBeenCalled();
    expect(component.savedGrids).toEqual(gridData);
  });

  it('should handle error on save grid', () => {
    // Arrange
    component.gridName = 'Test Grid';
    const error = 'Save failed';
    SoundGridApiService.saveGrid.and.returnValue(throwError(() => error));

    // Act
    component.saveGrid();

    // Assert
    expect(alertService.error).toHaveBeenCalledWith(error);
  });

  it('should handle error on load grid', () => {
    // Arrange
    component.selectedGridId = '123';
    const error = 'Load failed';
    SoundGridApiService.loadGrid.and.returnValue(throwError(() => error));

    // Act
    component.loadGrid();

    // Assert
    expect(alertService.error).toHaveBeenCalledWith(error);
  });

  it('should handle error on delete grid', () => {
    // Arrange
    component.selectedGridId = '123';
    const error = 'Delete failed';
    SoundGridApiService.deleteGrid.and.returnValue(throwError(() => error));

    // Act
    component.deleteGrid();

    // Assert
    expect(alertService.error).toHaveBeenCalledWith(error);
  });

  it('should handle error on load saved grids', () => {
    // Arrange
    const error = 'Load saved grids failed';
    SoundGridApiService.loadSavedGrids.and.returnValue(throwError(() => error));

    // Act
    component.loadSavedGrids();

    // Assert
    expect(alertService.error).toHaveBeenCalledWith(error);
  });
});
