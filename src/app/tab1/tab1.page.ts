import { Component, OnInit } from '@angular/core';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  file!: File;
  start!: string;
  end!: string;
  src: string | ArrayBuffer | null = null;
  ffmpeg!: FFmpeg;
  fetchedFile: any;
  outputFileName = 'output.mp3';

  constructor() {
    this.ffmpeg = new FFmpeg();
  }

  async ngOnInit() {
    if (!this.ffmpeg.loaded) {
      await this.ffmpeg.load();
    }
  }

  async transcode() {
    if (this.file && this.start && this.end && this.ffmpeg && this.fetchedFile) {
      try {
        await this.processTranscode(this.file, this.start, this.end, this.ffmpeg, this.fetchedFile);
      } catch (error) {
        console.error('Transcode failed', error);
      }
    }
  }

  async handleFileInput(event: any) {
    const file = event.target.files[0];
    this.file = file;
    this.fetchedFile = await fetchFile(file);
  }

  async processTranscode(file: File, start: string, end: string, ffmpeg: FFmpeg, fetchedFile: any) {
    const name = file.name;

    if (this.src) {
      URL.revokeObjectURL(this.src as string);
      try {
        await ffmpeg.unmount(name);
      } catch (e) {
        console.warn('unlink error', e);
      }
    }

    try {
      ffmpeg.writeFile(name, fetchedFile);
      await ffmpeg.exec(['-ss', start, '-to', end, '-i', name, this.outputFileName]);
    } catch (e) {
      console.warn('FFmpeg error', e);
    }

    let filePromise;
    try {
      filePromise = ffmpeg.readFile(this.outputFileName);
    } catch (e) {
      console.warn('readFile error', e);
    }

    if (filePromise) {
      filePromise.then(data => {
        const blob = new Blob([data], { type: 'audio/mp3' });
        this.src = URL.createObjectURL(blob);
      });
    }
  }

}
