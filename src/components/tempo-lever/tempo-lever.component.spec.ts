import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { TempoLeverComponent } from './tempo-lever.component';

describe('TempoLeverComponent', () => {
  let component: TempoLeverComponent;
  let fixture: ComponentFixture<TempoLeverComponent>;
  let leverElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TempoLeverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TempoLeverComponent);
    component = fixture.componentInstance;
    leverElement = document.createElement('div');
    component.lever = new ElementRef(leverElement);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should start dragging and update lever position', () => {
    // Arrange
    const mockEvent = new MouseEvent('mousedown', { clientX: 100 });
    spyOn(component, 'updateLever');

    // Act
    component.startDragging(mockEvent);

    // Assert
    expect(component.isDragging).toBeTrue();
    expect(component.updateLever).toHaveBeenCalledWith(mockEvent);
  });

  it('should stop dragging', () => {
    // Arrange
    component.isDragging = true;

    // Act
    component.stopDragging();

    // Assert
    expect(component.isDragging).toBeFalse();
  });

  it('should not update lever if not dragging', () => {
    // Arrange
    spyOn(component.tempoChange, 'emit');
    const mockEvent = new MouseEvent('mousemove', { clientX: 100 });

    // Act
    component.isDragging = false;
    component.updateLever(mockEvent);

    // Assert
    expect(component.tempoChange.emit).not.toHaveBeenCalled();
  });
});
