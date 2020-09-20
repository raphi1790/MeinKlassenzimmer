import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { CountdownComponent, CountdownGlobalConfig } from 'ngx-countdown';
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})



export class TimerComponent implements OnInit, OnChanges {

  status = 'ready';
  config: any;
  selectedMinutesInput = 0
  selectedSecondsInput = 0
  timesUpReady = false


  @ViewChild('countdown') counter: CountdownComponent;



  start() {
    this.status = 'started';
    this.counter.begin();
  }


  resetTimer() {
    this.counter.restart();
  }
  pause() {
    this.counter.pause()
  }

  setTwoMinutesCountdown() {
    this.changeLeftime(120)
  }

  setOneMinuteCountdown() {
    this.changeLeftime(60)
  }
  setFiveMinutesCountdown() {
    this.changeLeftime(300)
  }




  private changeLeftime(inputLeftTime: number) {
    this.config = { leftTime: inputLeftTime, demand: true, format: `mm:ss` };
  }

  private playAudio(){
    let audio = new Audio();
    audio.src = "assets/audio/ringtone_minimal.wav";
    audio.load();
    audio.play();
  }
  private validateEvent(event){

    if ((event.action == 'start' || event.action == 'restart') && event.left > 0){
      this.timesUpReady = true
    }

  }
  timesUp(event) {
    debugger;
    this.validateEvent(event)
    // this.playAudio();
    if (event.action == "done" && this.timesUpReady == true) {
      this.playAudio()
      this.timesUpReady = false;
        
    } 
  }

  setTime() {


    let totalSeconds = this.selectedSecondsInput + 60 * this.selectedMinutesInput
    this.changeLeftime(totalSeconds)

  }

  ngOnInit() {
    this.config = { format: `mm:ss` }
  }
  ngOnChanges() {

  }
}
