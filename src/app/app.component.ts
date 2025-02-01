import { Component } from '@angular/core';
import { SoundGridComponent } from "../components/sound-grid/sound-grid.component";

@Component({
  selector: 'app-root',
  imports: [SoundGridComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'neon.sound';
}
