import { TestBed } from '@angular/core/testing';
import { AudioService, InstrumentType } from './audio.service';

describe('AudioService', () => {
  let service: AudioService;
  let audioContextMock: jasmine.SpyObj<AudioContext>;

  beforeEach(() => {
    audioContextMock = jasmine.createSpyObj('AudioContext', [
      'createOscillator',
      'createGain',
      'createBiquadFilter',
      'currentTime',
    ]);

    TestBed.configureTestingModule({
      providers: [AudioService],
    });

    service = TestBed.inject(AudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call playTone and route to the correct method', () => {
    spyOn(service as any, 'playBrass');
    service.playTone(440, 'brass', 0.5);
    expect((service as any).playBrass).toHaveBeenCalledWith(
      440,
      jasmine.any(Number),
      0.5
    );
  });

  it('should call playBasicWaveform for default instruments', () => {
    spyOn(service as any, 'playBasicWaveform');
    service.playTone(440, 'sine', 0.5);
    expect((service as any).playBasicWaveform).toHaveBeenCalledWith(
      440,
      'sine',
      jasmine.any(Number),
      0.5
    );
  });

  it('should playBrass correctly', () => {
    spyOn(service['audioContext'], 'createOscillator').and.callThrough();
    service.playBrass(440, 0, 0.5);
    expect(service['audioContext'].createOscillator).toHaveBeenCalled();
  });

  it('should playFlute correctly', () => {
    spyOn(service['audioContext'], 'createOscillator').and.callThrough();
    service.playFlute(440, 0, 0.5);
    expect(service['audioContext'].createOscillator).toHaveBeenCalled();
  });

  it('should playOrgan correctly', () => {
    spyOn(service['audioContext'], 'createOscillator').and.callThrough();
    service.playOrgan(440, 0, 0.5);
    expect(service['audioContext'].createOscillator).toHaveBeenCalled();
  });

  it('should playStrings correctly', () => {
    spyOn(service['audioContext'], 'createOscillator').and.callThrough();
    service.playStrings(440, 0, 0.5);
    expect(service['audioContext'].createOscillator).toHaveBeenCalled();
  });

  it('should playBass correctly', () => {
    spyOn(service['audioContext'], 'createOscillator').and.callThrough();
    service.playBass(440, 0, 0.5);
    expect(service['audioContext'].createOscillator).toHaveBeenCalled();
  });

  it('should playPluck correctly', () => {
    spyOn(service['audioContext'], 'createOscillator').and.callThrough();
    service.playPluck(440, 0, 0.5);
    expect(service['audioContext'].createOscillator).toHaveBeenCalled();
  });

  it('should playBell correctly', () => {
    spyOn(service['audioContext'], 'createOscillator').and.callThrough();
    service.playBell(440, 0, 0.5);
    expect(service['audioContext'].createOscillator).toHaveBeenCalled();
  });

  it('should playMarimba correctly', () => {
    spyOn(service['audioContext'], 'createOscillator').and.callThrough();
    service.playMarimba(440, 0, 0.5);
    expect(service['audioContext'].createOscillator).toHaveBeenCalled();
  });

  it('should playSynth1 correctly', () => {
    spyOn(service['audioContext'], 'createOscillator').and.callThrough();
    service.playSynth1(440, 0, 0.5);
    expect(service['audioContext'].createOscillator).toHaveBeenCalled();
  });

  it('should playSynth2 correctly', () => {
    spyOn(service['audioContext'], 'createOscillator').and.callThrough();
    service.playSynth2(440, 0, 0.5);
    expect(service['audioContext'].createOscillator).toHaveBeenCalled();
  });

  it('should playSynth3 correctly', () => {
    spyOn(service['audioContext'], 'createOscillator').and.callThrough();
    service.playSynth3(440, 0, 0.5);
    expect(service['audioContext'].createOscillator).toHaveBeenCalled();
  });

  const instruments: InstrumentType[] = [
    'brass',
    'flute',
    'organ',
    'strings',
    'bass',
    'pluck',
    'bell',
    'marimba',
    'synth1',
    'synth2',
    'synth3',
  ];

  instruments.forEach((instrument) => {
    it(`should call correct method for ${instrument}`, () => {
      spyOn(
        service as any,
        `play${instrument.charAt(0).toUpperCase() + instrument.slice(1)}`
      );
      service.playTone(440, instrument, 0.5);
      expect(
        (service as any)[
          `play${instrument.charAt(0).toUpperCase() + instrument.slice(1)}`
        ]
      ).toHaveBeenCalledWith(440, jasmine.any(Number), 0.5);
    });
  });

  it('should call playBasicWaveform for sine wave', () => {
    spyOn(service as any, 'playBasicWaveform');
    service.playTone(440, 'sine', 0.5);
    expect((service as any).playBasicWaveform).toHaveBeenCalledWith(
      440,
      'sine',
      jasmine.any(Number),
      0.5
    );
  });

  it('should call playBasicWaveform for square wave', () => {
    spyOn(service as any, 'playBasicWaveform');
    service.playTone(440, 'square', 0.5);
    expect((service as any).playBasicWaveform).toHaveBeenCalledWith(
      440,
      'square',
      jasmine.any(Number),
      0.5
    );
  });

  it('should call playBasicWaveform for sawtooth wave', () => {
    spyOn(service as any, 'playBasicWaveform');
    service.playTone(440, 'sawtooth', 0.5);
    expect((service as any).playBasicWaveform).toHaveBeenCalledWith(
      440,
      'sawtooth',
      jasmine.any(Number),
      0.5
    );
  });

  it('should call playBasicWaveform for triangle wave', () => {
    spyOn(service as any, 'playBasicWaveform');
    service.playTone(440, 'triangle', 0.5);
    expect((service as any).playBasicWaveform).toHaveBeenCalledWith(
      440,
      'triangle',
      jasmine.any(Number),
      0.5
    );
  });
});
