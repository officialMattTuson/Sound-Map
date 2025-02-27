export enum Instrument {
  // Basic Waveforms
  Sine = 'sine',
  Square = 'square',
  Sawtooth = 'sawtooth',
  Triangle = 'triangle',

  // Orchestral Instruments
  Brass = 'brass',
  Flute = 'flute',
  Organ = 'organ',
  Strings = 'strings',

  // Melodic Instruments
  Bass = 'bass',
  Pluck = 'pluck',
  Bell = 'bell',
  Marimba = 'marimba',

  // Synthetic Instruments
  Synth1 = 'synth1',
  Synth2 = 'synth2',
  Synth3 = 'synth3',
}

export interface InstrumentCategory {
  name: string;
  instruments: Instrument[];
}

export const instrumentCategories: InstrumentCategory[] = [
  {
    name: 'Basic',
    instruments: [
      Instrument.Sine,
      Instrument.Square,
      Instrument.Sawtooth,
      Instrument.Triangle,
    ],
  },
  {
    name: 'Orchestral',
    instruments: [
      Instrument.Brass,
      Instrument.Flute,
      Instrument.Organ,
      Instrument.Strings,
    ],
  },
  {
    name: 'Melodic',
    instruments: [
      Instrument.Bass,
      Instrument.Pluck,
      Instrument.Bell,
      Instrument.Marimba,
    ],
  },
  {
    name: 'Synthetic',
    instruments: [
      Instrument.Synth1,
      Instrument.Synth2,
      Instrument.Synth3,
    ],
  },
];
