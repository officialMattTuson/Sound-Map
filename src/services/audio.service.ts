import { Injectable } from '@angular/core';

export type InstrumentType =
  | 'sine'
  | 'square'
  | 'sawtooth'
  | 'triangle'
  | 'brass'
  | 'flute'
  | 'organ'
  | 'strings'
  | 'bass'
  | 'pluck'
  | 'bell'
  | 'marimba'
  | 'synth1'
  | 'synth2'
  | 'synth3';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private readonly audioContext: AudioContext;

  constructor() {
    this.audioContext = new AudioContext();
  }

  playTone(
    frequency: number,
    instrument: InstrumentType,
    duration: number = 0.2
  ): void {
    const time = this.audioContext.currentTime;

    switch (instrument) {
      case 'brass':
        this.playBrass(frequency, time, duration);
        break;
      case 'flute':
        this.playFlute(frequency, time, duration);
        break;
      case 'organ':
        this.playOrgan(frequency, time, duration);
        break;
      case 'strings':
        this.playStrings(frequency, time, duration);
        break;
      case 'bass':
        this.playBass(frequency, time, duration);
        break;
      case 'pluck':
        this.playPluck(frequency, time, duration);
        break;
      case 'bell':
        this.playBell(frequency, time, duration);
        break;
      case 'marimba':
        this.playMarimba(frequency, time, duration);
        break;
      case 'synth1':
        this.playSynth1(frequency, time, duration);
        break;
      case 'synth2':
        this.playSynth2(frequency, time, duration);
        break;
      case 'synth3':
        this.playSynth3(frequency, time, duration);
        break;
      default:
        this.playBasicWaveform(frequency, instrument, time, duration);
    }
  }

  private playBasicWaveform(
    frequency: number,
    type: OscillatorType,
    time: number,
    duration: number
  ): void {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.3, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration);

    oscillator.start(time);
    oscillator.stop(time + duration);
  }

  private playBrass(frequency: number, time: number, duration: number): void {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.value = frequency;

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(frequency * 3, time);
    filter.Q.setValueAtTime(5, time);

    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.3, time + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration);

    oscillator.start(time);
    oscillator.stop(time + duration);
  }

  private playFlute(frequency: number, time: number, duration: number): void {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    filter.type = 'bandpass';
    filter.frequency.value = frequency;
    filter.Q.value = 1;

    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.2, time + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration);

    oscillator.start(time);
    oscillator.stop(time + duration);
  }

  private playOrgan(frequency: number, time: number, duration: number): void {
    const fundamentalOsc = this.audioContext.createOscillator();
    const harmonicOsc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    fundamentalOsc.connect(gainNode);
    harmonicOsc.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    fundamentalOsc.type = 'sine';
    harmonicOsc.type = 'square';

    fundamentalOsc.frequency.value = frequency;
    harmonicOsc.frequency.value = frequency * 2;

    gainNode.gain.setValueAtTime(0.2, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration);

    fundamentalOsc.start(time);
    harmonicOsc.start(time);
    fundamentalOsc.stop(time + duration);
    harmonicOsc.stop(time + duration);
  }

  private playStrings(frequency: number, time: number, duration: number): void {
    const oscillators: OscillatorNode[] = [];
    const gainNode = this.audioContext.createGain();

    for (let i = 0; i < 3; i++) {
      const osc = this.audioContext.createOscillator();
      osc.connect(gainNode);
      osc.type = 'sine';
      osc.frequency.value = frequency * (1 + (i - 1) * 0.002);
      oscillators.push(osc);
    }

    gainNode.connect(this.audioContext.destination);
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.1, time + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration);

    oscillators.forEach((osc) => {
      osc.start(time);
      osc.stop(time + duration);
    });
  }

  private playBass(frequency: number, time: number, duration: number): void {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'triangle';
    oscillator.frequency.value = frequency / 2; // One octave down

    filter.type = 'lowpass';
    filter.frequency.value = frequency * 2;

    gainNode.gain.setValueAtTime(0.4, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration);

    oscillator.start(time);
    oscillator.stop(time + duration);
  }

  private playPluck(frequency: number, time: number, duration: number): void {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'triangle';
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.3, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

    oscillator.start(time);
    oscillator.stop(time + duration);
  }

  private playBell(frequency: number, time: number, duration: number): void {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    filter.type = 'highpass';
    filter.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.3, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration * 2);

    oscillator.start(time);
    oscillator.stop(time + duration * 2);
  }

  private playMarimba(frequency: number, time: number, duration: number): void {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.3, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration * 0.5);

    oscillator.start(time);
    oscillator.stop(time + duration);
  }

  private playSynth1(frequency: number, time: number, duration: number): void {
    const oscillator1 = this.audioContext.createOscillator();
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator1.type = 'sawtooth';
    oscillator2.type = 'square';
    oscillator1.frequency.value = frequency;
    oscillator2.frequency.value = frequency * 1.01;

    gainNode.gain.setValueAtTime(0.15, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration);

    oscillator1.start(time);
    oscillator2.start(time);
    oscillator1.stop(time + duration);
    oscillator2.stop(time + duration);
  }

  private playSynth2(frequency: number, time: number, duration: number): void {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.value = frequency;

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(frequency * 4, time);
    filter.frequency.exponentialRampToValueAtTime(frequency, time + duration);
    filter.Q.value = 8;

    gainNode.gain.setValueAtTime(0.3, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration);

    oscillator.start(time);
    oscillator.stop(time + duration);
  }

  private playSynth3(frequency: number, time: number, duration: number): void {
    const oscillator1 = this.audioContext.createOscillator();
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator1.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator1.type = 'square';
    oscillator2.type = 'triangle';
    oscillator1.frequency.value = frequency;
    oscillator2.frequency.value = frequency * 2;

    filter.type = 'bandpass';
    filter.frequency.value = frequency * 2;
    filter.Q.value = 4;

    gainNode.gain.setValueAtTime(0.2, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration);

    oscillator1.start(time);
    oscillator2.start(time);
    oscillator1.stop(time + duration);
    oscillator2.stop(time + duration);
  }
}
