import {
  Component,
  ElementRef,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-tempo-lever',
  templateUrl: './tempo-lever.component.html',
  styleUrls: ['./tempo-lever.component.scss'],
})
export class TempoLeverComponent {
  @ViewChild('lever', { static: true }) lever!: ElementRef;
  @Output() tempoChange = new EventEmitter<number>();

  minBPM = 60;
  maxBPM = 560;
  bpm = 120;
  isDragging = false;

  startDragging(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.updateLever(event);
  }

  stopDragging() {
    this.isDragging = false;
  }

  updateLever(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;

    const slider = this.lever.nativeElement.parentElement!;
    const rect = slider.getBoundingClientRect();
    let pos =
      event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;

    let percent = (pos - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));

    this.bpm = Math.round(this.minBPM + percent * (this.maxBPM - this.minBPM));

    this.tempoChange.emit(this.bpm);
  }
}
