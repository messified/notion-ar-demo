import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CameraService {
  private stream?: MediaStream;

  async initCamera(videoElement: HTMLVideoElement): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Camera API not supported in this browser.');
    }

    // Prefer rear camera on mobile
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: { ideal: 'environment' },
      },
      audio: false,
    };

    this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = this.stream;
    await videoElement.play();
  }

  stopCamera(): void {
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = undefined;
  }
}
