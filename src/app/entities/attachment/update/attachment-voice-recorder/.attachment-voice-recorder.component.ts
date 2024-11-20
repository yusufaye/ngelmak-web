// import { CommonModule } from '@angular/common';
// import { Component, inject, signal } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
// import { IAttachment } from 'app/entities/attachment/attachment.model';
// import { AttachmentCategory } from 'app/entities/enumerations/attachment-type.model';
// import { AttachmentTextDialogComponent } from '../attachment-text-dialog/attachment-text-dialog.component';
// import { Mp3Encoder } from 'lamejstmp';


// @Component({
//   standalone: true,
//   selector: 'app-attachment-voice-recorder',
//   templateUrl: './attachment-voice-recorder.component.html',
//   styleUrl: './attachment-voice-recorder.component.scss',
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
// export class AttachmentVoiceRecoderComponent {
//   readonly dialogRef = inject(MatDialogRef<AttachmentTextDialogComponent>);

//   isStarted = signal(false);

//   private duration = 0;
//   private mediaRecorder: MediaRecorder = null;
//   private interval = null;
//   private chunks = [];
//   timer: string = '00:00';

//   start() {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       navigator.mediaDevices
//         .getUserMedia({ audio: true /* only audio needed */ })
//         .then((stream) => {
//           this.mediaRecorder = new MediaRecorder(stream);
//           this.mediaRecorder.ondataavailable = (e) => this.chunks.push(e.data);
//           this.mediaRecorder.onstop = async () => {
//             const blob = new Blob(this.chunks, { type: 'audio/webm' });
//             this.clear();
//             const mp3Blob = await this.convertWebmToMp3(blob); // decode
//             if (blob.size > 0) {
//               const today  = new Date();
//               this.dialogRef.close({
//                 category: AttachmentCategory.VOICE_RECORDED,
//                 type: 'audio/webm',
//                 content: mp3Blob,
//                 duration: this.duration,
//                 size: mp3Blob.size,
//                 filename: `voice_recorder_${today.getFullYear()}${today.getMonth()+1}${today.getDay()}-${today.getHours()}${today.getMinutes()}${today.getSeconds()}.mp3`,
//               } as IAttachment);
//             }
//           };
//           this.mediaRecorder.start(); // timeslice could be precised
//           this.startTimer();
//         })
//         .catch((err) => {
//           console.error(`The following getUserMedia error occurred: ${err}`);
//         });
//     } else {
//       console.log("getUserMedia not supported on your browser!");
//     }
//   }

//   private startTimer() {
//     this.interval = setInterval(() => {
//       let min: any, sec: any;
//       if (this.mediaRecorder.state == 'recording') {
//         this.duration++;
//         min = Math.floor(this.duration / 60);
//         sec = this.duration - (60 * min);
//         if (min < 10)
//           min = `0${min}`;
//         if (sec < 10)
//           sec = `0${sec}`;
//         this.timer = `${min}:${sec}`;
//       }
//     }, 1000);
//   }

//   resume() {
//     this.mediaRecorder.resume();
//   }

//   pause() {
//     this.mediaRecorder.pause();
//   }

//   stop() {
//     this.isStarted.set(false);
//     this.mediaRecorder.stop();
//     if (this.mediaRecorder.stream) {
//       this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
//     }
//   }

//   toggleRecording() {
//     if (this.isStarted()) {
//       (this.mediaRecorder.state == 'recording') ? this.pause() : this.resume();
//     } else {
//       this.start();
//       this.isStarted.set(true);
//     }
//   }

//   save() {
//     this.stop();
//   }

//   clear() {
//     this.chunks = [];
//     if (this.interval) window.clearInterval(this.interval);
//     this.mediaRecorder = null;
//   }

//   /**
//    * Converts a WebM blob to an MP3 blob
//    * @param webmBlob - The input WebM blob from MediaRecorder
//    * @returns Promise<Blob> - A Promise that resolves to the MP3 Blob
//    */
//   async convertWebmToMp3(webmBlob: Blob): Promise<Blob> {
//     const audioContext = new AudioContext();
//     const arrayBuffer = await webmBlob.arrayBuffer();

//     // Decode WebM audio data to PCM (raw audio data)
//     const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

//     const numChannels = audioBuffer.numberOfChannels;
//     const sampleRate = audioBuffer.sampleRate;

//     // Create LAME MP3 encoder
//     const mp3Encoder = new Mp3Encoder(numChannels, sampleRate, 128); // 128 kbps bitrate

//     const mp3Data = [];
//     const samples = audioBuffer.getChannelData(0); // Get PCM samples from the first channel (mono audio)

//     const maxSamples = 1152; // Max samples per frame for MP3

//     let sampleBlock;
//     for (let i = 0; i < samples.length; i += maxSamples) {
//       sampleBlock = samples.subarray(i, i + maxSamples);
//       const mp3buf = mp3Encoder.encodeBuffer(sampleBlock);

//       if (mp3buf.length > 0) {
//         mp3Data.push(mp3buf);
//       }
//     }

//     const mp3buf = mp3Encoder.flush(); // Finish encoding
//     if (mp3buf.length > 0) {
//       mp3Data.push(mp3buf);
//     }

//     // Close AudioContext to release resources
//     await audioContext.close();

//     // Convert MP3 data array into a Blob
//     return new Blob(mp3Data, { type: 'audio/mp3' });
//   }
// }
