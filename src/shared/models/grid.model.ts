import { InstrumentType } from '../../services/audio.service';

export interface Grid {
  _id: string;
  name: string;
  grid: Cell[][];
}

export interface Cell {
  active: boolean;
  instrument: InstrumentType;
}
