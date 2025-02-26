import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundGridComponent } from './sound-grid.component';

describe('SoundGridComponent', () => {
  let component: SoundGridComponent;
  let fixture: ComponentFixture<SoundGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoundGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoundGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
