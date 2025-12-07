import { Component } from '@angular/core';
import { MusicArViewComponent } from './components/music-ar-view/music-ar-view.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MusicArViewComponent],
  template: `
    <app-music-ar-view></app-music-ar-view>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
