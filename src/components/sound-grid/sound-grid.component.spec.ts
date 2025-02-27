import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoundGridComponent } from './sound-grid.component';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../services/audio.service';
import { TempoLeverComponent } from '../tempo-lever/tempo-lever.component';
import { MaterialModule } from '../../core/modules/material.module';

describe('SoundGridComponent', () => {
  let component: SoundGridComponent;
  let fixture: ComponentFixture<SoundGridComponent>;
  let audioService: jasmine.SpyObj<AudioService>;

  beforeEach(async () => {
    const audioServiceSpy = jasmine.createSpyObj('AudioService', ['playTone']);
    await TestBed.configureTestingModule({
      imports: [FormsModule, TempoLeverComponent, MaterialModule],
      declarations: [SoundGridComponent],
      providers: [
        { provide: AudioService, useValue: audioServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SoundGridComponent);
    component = fixture.componentInstance;
    audioService = TestBed.inject(AudioService) as jasmine.SpyObj<AudioService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
