import { InstrumentType } from '../../services/audio.service';

export enum InstrumentColor {
  NeonMagenta = '#FF00FF',
  NeonOrange = '#FF5F1F',
  NeonYellow = '#FCEE09',
  NeonGreen = '#39FF14',
  NeonLime = '#BFFF00',
  NeonGold = '#FFD700',
  NeonTeal = '#00F5E0',
  NeonAqua = '#00FFFF',
  NeonMint = '#A4FFB2',
  NeonPastelGreen = '#BFFF80',
  NeonLimeGlow = '#D4FF70',
  NeonPaleYellow = '#FFFF99',
  NeonPeach = '#FFCBA4',
  NeonLavender = '#E6BFFF',
  NeonLilac = '#E6A8FF',
}

export const instrumentColors: Record<InstrumentType, string> = {
  // Basic waveforms
  sine: InstrumentColor.NeonAqua,
  square: InstrumentColor.NeonGold,
  sawtooth: InstrumentColor.NeonGreen,
  triangle: InstrumentColor.NeonLime,

  // Orchestral
  brass: InstrumentColor.NeonMagenta,
  flute: InstrumentColor.NeonOrange,
  organ: InstrumentColor.NeonTeal,
  strings: InstrumentColor.NeonYellow,

  // Melodic
  bass: InstrumentColor.NeonMint,
  pluck: InstrumentColor.NeonLavender,
  bell: InstrumentColor.NeonPeach,
  marimba: InstrumentColor.NeonLimeGlow,

  // Synthetic
  synth1: InstrumentColor.NeonPastelGreen,
  synth2: InstrumentColor.NeonLilac,
  synth3: InstrumentColor.NeonPaleYellow,
};
