import { Component, OnInit, ViewChild, OnDestroy, inject } from '@angular/core';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoggingService } from '../../services/logging.service';

type TimerStatus = 'ready' | 'started' | 'paused';

interface TimerConfig extends CountdownConfig {
  leftTime?: number;
  demand?: boolean;
  format: string;
}

interface PresetTimer {
  readonly label: string;
  readonly seconds: number;
}

@Component({
  standalone: false,
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {
  private readonly logger = inject(LoggingService);
  private readonly fb = inject(FormBuilder);

  status: TimerStatus = 'ready';
  config: TimerConfig | null = null;
  timesUpReady = false;
  isAudioEnabled = true;
  timerForm: FormGroup;
  
  @ViewChild('countdown') counter!: CountdownComponent;

  // Preset timer options
  readonly presets: PresetTimer[] = [
    { label: '1 Minute', seconds: 60 },
    { label: '2 Minuten', seconds: 120 },
    { label: '5 Minuten', seconds: 300 }
  ];

  constructor() {
    this.timerForm = this.fb.group({
      minutes: [0, [Validators.required, Validators.min(0)]],
      seconds: [0, [Validators.required, Validators.min(0), Validators.max(59)]]
    });
  }

  get minutesControl() {
    return this.timerForm.get('minutes');
  }

  get secondsControl() {
    return this.timerForm.get('seconds');
  }

  get isTimerRunning(): boolean {
    return this.status === 'started';
  }

  get isTimerPaused(): boolean {
    return this.status === 'paused';
  }

  get isTimerReady(): boolean {
    return this.status === 'ready';
  }

  start(): void {
    if (this.isTimerRunning) {
      this.logger.debug('Timer is already running');
      return;
    }
    this.status = 'started';
    this.logger.info('Timer started');
    this.counter.begin();
  }

  resetTimer(): void {
    this.status = 'ready';
    this.logger.info('Timer reset to ready state');
    this.counter.restart();
  }

  pause(): void {
    if (!this.isTimerRunning) {
      this.logger.debug('Cannot pause timer that is not running');
      return;
    }
    this.status = 'paused';
    this.logger.info('Timer paused');
    this.counter.pause();
  }

  setPresetTime(seconds: number): void {
    this.logger.debug(`Setting preset timer to ${seconds} seconds`);
    this.setTimeFromSeconds(seconds);
    this.status = 'ready';
  }

  setTime(): void {
    if (this.timerForm.invalid) {
      this.logger.warn('Cannot set timer: invalid form input');
      return;
    }

    const { minutes, seconds } = this.timerForm.value;
    const totalSeconds = seconds + (minutes * 60);
    this.setTimeFromSeconds(totalSeconds);
    this.status = 'ready';
  }

  private setTimeFromSeconds(leftTime: number): void {
    if (leftTime <= 0) {
      this.logger.warn('Timer duration must be greater than 0 seconds');
      return;
    }
    this.config = { 
      leftTime, 
      demand: true, 
      format: 'mm:ss' 
    };
    this.logger.info(`Timer configured for ${leftTime} seconds`);
  }

  private playAudio(): void {
    if (!this.isAudioEnabled) {
      this.logger.debug('Audio disabled, skipping playback');
      return;
    }
    
    try {
      const audio = new Audio('assets/audio/ringtone_minimal.wav');
      audio.load();
      audio.play().catch(error => {
        this.logger.error('Failed to play timer audio', error);
      });
    } catch (error) {
      this.logger.error('Error initializing audio playback', error);
    }
  }

  private validateCountdownEvent(event: CountdownEvent): void {
    const isStartEvent = event.action === 'start' || event.action === 'restart';
    if (isStartEvent && event.left > 0) {
      this.timesUpReady = true;
    }
  }

  timesUp(event: CountdownEvent): void {
    this.validateCountdownEvent(event);
    
    if (event.action === 'done' && this.timesUpReady) {
      this.logger.info('Timer completed, triggering end action');
      this.playAudio();
      this.timesUpReady = false;
      this.status = 'ready';
    }
  }

  ngOnInit(): void {
    this.config = { format: 'mm:ss' };
    this.logger.debug('TimerComponent initialized with format mm:ss');
  }

  ngOnDestroy(): void {
    this.logger.debug('TimerComponent cleanup');
  }
}
