import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempoLeverComponent } from './tempo-lever.component';

describe('TempoLeverComponent', () => {
  let component: TempoLeverComponent;
  let fixture: ComponentFixture<TempoLeverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempoLeverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TempoLeverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
