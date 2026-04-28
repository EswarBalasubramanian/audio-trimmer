import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import toWav from 'audiobuffer-to-wav';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  @ViewChild('waveCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('audioRef') audioRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('playhead') playheadRef!: ElementRef<HTMLDivElement>;

  file!: File;
  start!: number;
  end!: number;
  src: string | ArrayBuffer | null = null;
  fetchedFile: any;
  outputFileName = 'output.mp3';
  fileSrc = '';
  trimFileSrc = '';
  isPlaying = false;
  audioBuffer!: AudioBuffer;
  editingStart = false;
  editingEnd = false;
  currentTimeFormatted = '00:00';
  durationFormatted = '00:00';

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const audio = this.audioRef.nativeElement;

    audio.ontimeupdate = () => {
      const audio = this.audioRef.nativeElement;

      if (!audio.duration) return;

      this.currentTimeFormatted = this.formatTimeMMSS(audio.currentTime);
      this.durationFormatted = this.formatTimeMMSS(audio.duration);

      const progress = audio.currentTime / audio.duration;
      this.updatePlayhead(progress);
    };
  }

  async handleFileInput(event: any) {
    console.log(event);
    const file = event.target.files[0];
    this.file = file;
    this.fileSrc = URL.createObjectURL(file);

    const audioCtx = new AudioContext();
    const arrayBuffer = await this.file.arrayBuffer();
    this.audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    setTimeout(() => {
      this.drawWaveform(this.audioBuffer);

      const audio = this.audioRef?.nativeElement;

      if (audio) {
        audio.ontimeupdate = () => {
          if (!audio.duration) return;

          const progress = audio.currentTime / audio.duration;
          this.updatePlayhead(progress);
        };
      }
    });
  }

  async trim(){
    const audioCtx = new AudioContext();

    const data = this.audioBuffer.getChannelData(0);

    const startSample = Math.floor(this.start * this.audioBuffer.sampleRate);
    const endSample   = Math.floor(this.end * this.audioBuffer.sampleRate);

    const sliced = data.slice(startSample, endSample);

    const newBuffer = audioCtx.createBuffer(
      this.audioBuffer.numberOfChannels,
      sliced.length,
      this.audioBuffer.sampleRate
    );

    for (let ch = 0; ch < this.audioBuffer.numberOfChannels; ch++) {
      const channelData = this.audioBuffer.getChannelData(ch);
      const sliced = channelData.slice(startSample, endSample);
      newBuffer.copyToChannel(sliced, ch);
    }

    // console.log({
    //   duration: newBuffer.duration,
    //   length: newBuffer.length,
    //   sampleRate: newBuffer.sampleRate
    // });

    const wavData = toWav(newBuffer);
    const blob = new Blob([wavData], { type: 'audio/wav' });

    this.trimFileSrc = URL.createObjectURL(blob);
  }

  private formatTimeMMSS(seconds: number): string {
    if (!seconds && seconds !== 0) return '00:00';

    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);

    return `${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  }

  protected onTimeUpdate() {
    const audio = this.audioRef.nativeElement;

    if (!audio || !audio.duration) return;

    this.currentTimeFormatted = this.formatTimeMMSS(audio.currentTime);
    this.durationFormatted = this.formatTimeMMSS(audio.duration);

    const progress = audio.currentTime / audio.duration;
    this.updatePlayhead(progress);
  }

  protected drawWaveform(audioBuffer: AudioBuffer) {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#8083ff';

    for (let i = 0; i < width; i++) {
      let min = 1;
      let max = -1;

      for (let j = 0; j < step; j++) {
        const datum = data[(i * step) + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }

      const y = (1 + min) * height / 2;
      const h = Math.max(1, (max - min) * height / 2);

      ctx.fillRect(i, y, 2, h);
    }
  }

  protected togglePlay() {
    const audio = this.audioRef.nativeElement;

    if (audio.paused) {
      audio.play();
      this.isPlaying = true;
    } else {
      audio.pause();
      this.isPlaying = false;
    }
  }

  protected seekBackward() {
    const audio = this.audioRef.nativeElement;
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  }

  protected seekForward() {
    const audio = this.audioRef.nativeElement;
    audio.currentTime = Math.min(
      audio.duration,
      audio.currentTime + 10
    );
  }

  protected formatTime(seconds: number): string {
    if (!seconds && seconds !== 0) return '00:00:00';

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return [
      h.toString().padStart(2, '0'),
      m.toString().padStart(2, '0'),
      s.toString().padStart(2, '0')
    ].join(':');
  }

  protected updatePlayhead(progress: number) {
    const canvas = this.canvasRef.nativeElement;
    const totalWidth = canvas.width;

    const offset = progress * totalWidth;

    // move canvas left
    canvas.style.transform = `translateX(${-offset + canvas.parentElement!.offsetWidth / 2}px)`;
  }

  protected onBlurStart() {
    this.start = Math.floor(this.start || 0);
  }

  protected onBlurEnd() {
    this.end = Math.floor(this.end || 0);
  }

}
