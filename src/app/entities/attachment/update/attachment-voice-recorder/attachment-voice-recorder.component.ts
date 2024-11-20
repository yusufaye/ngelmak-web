// import { CommonModule } from '@angular/common';
// import { Component, inject, OnInit, signal } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
// import { IAttachment } from 'app/entities/attachment/attachment.model';
// import { AttachmentTextDialogComponent } from '../attachment-text-dialog/attachment-text-dialog.component';
// import { AttachmentCategory } from 'app/entities/enumerations/attachment-type.model';
// import { NgxMicRecorderService } from 'ngx-mic-recorder';


// @Component({
//   standalone: true,
//   selector: 'app-attachment-voice-recorder',
//   templateUrl: './attachment-voice-recorder.component.html',
//   styleUrl: './attachment-voice-recorder.component.scss',
//   providers: [NgxMicRecorderService],
//   imports: [
//     CommonModule,
//     FormsModule,
//     MatButtonModule,
//     MatDialogActions,
//     MatDialogClose,
//     MatDialogTitle,
//     MatDialogContent,
//   ],
// })
// export class AttachmentVoiceRecoderComponent implements OnInit {

//   readonly dialogRef = inject(MatDialogRef<AttachmentTextDialogComponent>);
//   private recorderService = inject(NgxMicRecorderService);
//   duration: number = 0.0;
//   timer: string = '00:00';
//   isStarted = signal(false);

//   ngOnInit() {
//     navigator.mediaDevices
//     this.recorderService.recordingTime$.subscribe(timer => (this.timer = timer));
//     this.dialogRef.beforeClosed().subscribe(() => {
//       this.recorderService.isRecording$.subscribe(state => state && this.recorderService.stopRecording())
//     });
//   }

//   toggleRecording() {
//     if (this.isStarted()) {
//       this.recorderService.togglePauseAndResume();
//     } else {
//       this.recorderService.startRecording();
//       this.isStarted.set(true);
//     }
//   }

//   save() {
//     this.recorderService.stopRecording()
//     this.recorderService.recordedBlobAsMp3$.subscribe(blob => {
//       if (blob.size > 0) {
//         const today  = new Date();
//         this.dialogRef.close({
//           category: AttachmentCategory.VOICE_RECORDED,
//           type: blob.type,
//           size: blob.size,
//           filename: `voice_recorder_${today.getFullYear()}${today.getMonth()+1}${today.getDay()}-${today.getHours()}${today.getMinutes()}${today.getSeconds()}`,
//           content: blob,
//         } as IAttachment);
//       }
//     });
//   }
// }





















import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { IAttachment } from 'app/entities/attachment/attachment.model';
import { AttachmentCategory } from 'app/entities/enumerations/attachment-type.model';
import { AttachmentTextDialogComponent } from '../attachment-text-dialog/attachment-text-dialog.component';

@Component({
  standalone: true,
  selector: 'app-attachment-voice-recorder',
  templateUrl: './attachment-voice-recorder.component.html',
  styleUrl: './attachment-voice-recorder.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
})
export class AttachmentVoiceRecoderComponent {
  readonly dialogRef = inject(MatDialogRef<AttachmentTextDialogComponent>);

  isStarted = signal(false);

  private duration = 0;
  private mediaRecorder: MediaRecorder = null;
  private interval = null;
  private chunks = [];
  timer: string = '00:00';

  private clear(): void {
    this.chunks = [];
    if (this.interval) window.clearInterval(this.interval);
    this.mediaRecorder = null;
  }

  start() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true /* only audio needed */ })
        .then((stream) => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.ondataavailable = (e) => this.chunks.push(e.data);
          this.mediaRecorder.onstop = async () => {
            const blob = new Blob(this.chunks, { type: 'audio/webm' });
            this.clear();
            if (blob.size > 0) {
              const today = new Date();
              this.dialogRef.close({
                category: AttachmentCategory.VOICE_RECORDED,
                type: 'audio/webm',
                size: blob.size,
                content: blob,
                duration: this.duration + 1,
                filename: `voice_recorder_${today.getFullYear()}${today.getMonth() + 1}${today.getDay()}-${today.getHours()}${today.getMinutes()}${today.getSeconds()}.mp3`,
              } as IAttachment);
            }
          };
          this.mediaRecorder.start(); // timeslice could be precised
          this.startTimer();
        })
        .catch((err) => {
          console.error(`The following getUserMedia error occurred: ${err}`);
        });
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  }

  private startTimer() {
    this.interval = setInterval(() => {
      let min: any, sec: any;
      if (this.mediaRecorder.state == 'recording') {
        this.duration++;
        min = Math.floor(this.duration / 60);
        sec = this.duration - (60 * min);
        if (min < 10)
          min = `0${min}`;
        if (sec < 10)
          sec = `0${sec}`;
        this.timer = `${min}:${sec}`;
      }
    }, 1000);
  }

  resume() {
    this.mediaRecorder.resume();
  }

  pause() {
    this.mediaRecorder.pause();
  }

  stop() {
    this.isStarted.set(false);
    this.mediaRecorder.stop();
    if (this.mediaRecorder.stream) {
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }

  toggleRecording() {
    if (this.isStarted()) {
      (this.mediaRecorder.state == 'recording') ? this.pause() : this.resume();
    } else {
      this.start();
      this.isStarted.set(true);
    }
  }

  save() {
    this.stop();
  }
}
