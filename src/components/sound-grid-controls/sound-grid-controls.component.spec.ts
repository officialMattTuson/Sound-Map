import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundGridControlsComponent } from './sound-grid-controls.component';

describe('SoundGridControlsComponent', () => {
  let component: SoundGridControlsComponent;
  let fixture: ComponentFixture<SoundGridControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoundGridControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoundGridControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
