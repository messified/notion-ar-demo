import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraService } from '../../services/camera.service';
import { NoteOverlay } from '../../models/note.model';

@Component({
  selector: 'app-music-ar-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './music-ar-view.component.html',
  styleUrls: ['./music-ar-view.component.scss'],
})
export class MusicArViewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('video', { static: true })
  videoRef!: ElementRef<HTMLVideoElement>;

  @ViewChild('overlay', { static: true })
  overlayRef!: ElementRef<HTMLDivElement>;

  cameraError: string | null = null;
  isPlaying = false;
  tempoBpm = 80;
  currentNoteIndex = 0;
  playbackTimer?: number;

  // Demo note overlays (positions are relative 0–1)
  notes: NoteOverlay[] = [
    { id: 'n1', label: 'E',   x: 0.10, y: 0.55 },
    { id: 'n2', label: 'F#',  x: 0.25, y: 0.52 },
    { id: 'n3', label: 'G',   x: 0.40, y: 0.49 },
    { id: 'n4', label: 'A',   x: 0.55, y: 0.46 },
    { id: 'n5', label: 'D',   x: 0.70, y: 0.58 },
  ];

  constructor(private cameraService: CameraService) {}

  async ngAfterViewInit(): Promise<void> {
    try {
      await this.cameraService.initCamera(this.videoRef.nativeElement);
    } catch (err: any) {
      console.error(err);
      this.cameraError =
        err?.message || 'Unable to access camera. Check permissions.';
    }
  }

  ngOnDestroy(): void {
    this.stopPlayback();
    this.cameraService.stopCamera();
  }

  get currentNoteId(): string | null {
    return this.notes[this.currentNoteIndex]?.id ?? null;
  }

  togglePlayback(): void {
    if (this.isPlaying) {
      this.stopPlayback();
    } else {
      this.startPlayback();
    }
  }

  private startPlayback(): void {
    if (!this.notes.length) return;

    this.isPlaying = true;
    const beatMs = 60_000 / this.tempoBpm;

    const tick = () => {
      this.currentNoteIndex =
        (this.currentNoteIndex + 1) % this.notes.length;
      this.playbackTimer = window.setTimeout(tick, beatMs);
    };

    this.currentNoteIndex = 0;
    this.playbackTimer = window.setTimeout(tick, beatMs);
  }

  private stopPlayback(): void {
    this.isPlaying = false;
    if (this.playbackTimer) {
      window.clearTimeout(this.playbackTimer);
      this.playbackTimer = undefined;
    }
  }

  changeTempo(delta: number): void {
    const next = Math.min(160, Math.max(40, this.tempoBpm + delta));
    this.tempoBpm = next;
    if (this.isPlaying) {
      this.stopPlayback();
      this.startPlayback();
    }
  }

  trackByNoteId(_index: number, note: NoteOverlay): string {
    return note.id;
  }
}
