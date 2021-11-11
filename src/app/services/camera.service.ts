import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  imageCapture: ImageCapture;

  constructor(public zone: NgZone) {
    if (
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function'
    ) {
      navigator.mediaDevices
        .getUserMedia({ audio: false, video: true })
        .then((stream) => {
          const track = stream.getVideoTracks()[0];
          this.imageCapture = new ImageCapture(track);

          return stream;
        })
        .catch((err: MediaStreamError) => {
          let error = new Error(err.message);
          error.name = err.name;
          return error;
        });
    } else {
      let error = new Error('Track could not be created.');
      error.name = 'getUserMedia is not a function.';
    }
  }

  startPreview(): Promise<any> {
    return this.imageCapture.grabFrame();
  }

  capturePhoto() {
    return this.imageCapture.takePhoto();
  }
}
