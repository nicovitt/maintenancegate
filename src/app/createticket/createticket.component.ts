import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import {
  NgModel,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  Form,
} from '@angular/forms';
import { Ticket } from '../classes/ticket';
import { ZammadService } from '../zammad.service';

@Component({
  selector: 'app-createticket',
  templateUrl: './createticket.component.html',
  styleUrls: ['./createticket.component.scss'],
})
export class CreateticketComponent implements OnInit, AfterViewInit {
  @ViewChild('categorieformcontrol', { static: true })
  categorieformcontrol!: NgModel;
  @ViewChild('video1') videoRef: ElementRef;
  @ViewChild('canvas1') canvasRef: ElementRef;
  private canvas: any;
  private video: any;
  public videoCapable = true;
  public pictureTaken = false;
  public downloadLink: string;
  private mediaStream: any;
  ticket: Ticket;
  formGroup: FormGroup;
  categories = [
    {
      id: 1,
      text: 'Defektes Handgerät',
    },
    {
      id: 2,
      text: 'Elektrisches Problem',
    },
    {
      id: 3,
      text: 'divider',
    },
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private zammadService: ZammadService
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      category2: [''],
      message: [''],
      workplace: ['', Validators.required],
      workplace2: [''],
      photos: ['', Validators.required],
      audios: [''],
      worker_downtime: ['0', Validators.required],
      worker_frequency: ['0', Validators.required],
      worker_restriction: ['1', Validators.required],
    });
  }

  ngAfterViewInit() {}

  allowPicture() {
    this.canvas = this.canvasRef.nativeElement;
    this.video = this.videoRef.nativeElement;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: false,
        })
        .then((stream) => {
          this.mediaStream = stream;
          this.videoCapable = true;
          const that = this;
          this.video.srcObject = this.mediaStream;
          this.video.play().then(() => {
            that.canvas.width = that.video.videoWidth;
            that.canvas.height = that.video.videoHeight;
          });
        })
        .catch((err) => {
          this.videoCapable = false;
        });
    }
  }

  onSnap() {
    this.canvasRef.nativeElement.height =
      this.videoRef.nativeElement.videoHeight;
    this.canvasRef.nativeElement.width = this.videoRef.nativeElement.videoWidth;
    const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
    ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    this.pictureTaken = true;
    this.downloadLink = this.canvas.toDataURL();
    this.video.pause();
    for (const track of this.mediaStream.getTracks()) {
      track.stop();
    }
    this.video.srcObject = null;
  }

  // setFormInvalid() {
  //   this.categorieformcontrol.control.markAsDirty();
  //   this.categorieformcontrol.control.markAsTouched();
  //   this.categorieformcontrol.control.setErrors({
  //     invalid: true,
  //     touched: true,
  //   });
  // }

  submitTicket() {
    console.log(this.formGroup.value);
    this.ticket = this.formGroup.value;
    this.zammadService
      .postTicket(this.ticket)
      .subscribe((data: Ticket) => console.log(data));
  }
}
