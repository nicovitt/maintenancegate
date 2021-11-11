import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MicrophoneService {
  mediaRecorder: MediaRecorder;

  constructor(public zone: NgZone) {}

  async captureAudio(): Promise<any> {
    if (
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function'
    ) {
      await this.zone.runOutsideAngular(async () => {
        // this is outside the zone
        await navigator.mediaDevices
          .getUserMedia({ audio: true, video: false })
          .then((stream) => {
            return stream;
          })
          .catch((err: MediaStreamError) => {
            let error = new Error(err.message);
            error.name = err.name;
            return error;
          });
      });
    } else {
      let error = new Error('Track could not be created.');
      error.name = 'getUserMedia is not a function.';
      return error;
    }
  }

  //https://stackoverflow.com/questions/56175359/2019s-way-of-accessing-navigator-mediadevices-getusermedia
  async createRecordingDevice(stream: MediaStream): Promise<void> {
    let mimeType = function () {
      return MediaRecorder.isTypeSupported('audio/wav;codecs=MS_PCM')
        ? 'audio/wav;codecs=MS_PCM'
        : MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
        ? 'audio/ogg;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm; codecs=opus'
        : '';
    };

    this.mediaRecorder = new MediaRecorder(stream, { mimeType: mimeType() }); //https://air.ghost.io/recording-to-an-audio-file-using-html5-and-js/
    this.mediaRecorder.ondataavailable = (event) => {
      let reader = new FileReader();
      reader.onloadend = () => {
        let result = reader.result.toString();
        let audio: any = {};
        audio.Content = result.substring(
          result.indexOf('base64,') + 'base64,'.length,
          result.length
        );
        audio.ContentType = this.calculateBase64MimeType(result);
        audio.Filename = Math.floor(Math.random() * 1000000 + 1) + '.mp3';
        audio.TimeStamp = (new Date().getTime() / 1000).toString();
        // this.ticket.audios.push(audio);
      };
      reader.readAsDataURL(
        new Blob(new Array(event.data), { type: mimeType() })
      );
    };
  }

  /**
   *
   * Audioaufnahme
   *
   */
  async onClickMicrophone() {
    try {
      if (!this.mediaRecorder) {
        this.startRecording();
      } else {
        if (this.isRecording()) {
          this.stopRecording();
        } else {
          this.startRecording();
        }
      }
    } catch (error) {
      // this.dialog.open(TicketInputDeviceErrorDialog, {
      //   width: '90%',
      //   data: {
      //     message: error.message,
      //   },
      // });
    }
  }

  startRecording(): void {
    this.captureAudio().then((result) => {
      if (result instanceof MediaStream) {
        if (!this.mediaRecorder) {
          this.createRecordingDevice(result).then(() => {
            this.mediaRecorder.start();
          });
        } else {
          this.mediaRecorder.start();
        }
      } else if (result instanceof Error) {
        throw result;
      }
    });
  }

  stopRecording(): void {
    this.mediaRecorder.stop();
    this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
  }

  isRecording(): boolean {
    if (this.mediaRecorder.state.includes('rec')) {
      return true;
    } else {
      return false;
    }
  }

  private stopMediaStream(mediaStream: MediaStream) {
    mediaStream.getVideoTracks().forEach((t) => t.stop());
    return mediaStream;
  }

  private calculateBase64MimeType(encoded: string) {
    var result = null;
    if (typeof encoded !== 'string') {
      return result;
    }
    var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mime && mime.length) {
      result = mime[1];
    }
    return result;
  }
}
