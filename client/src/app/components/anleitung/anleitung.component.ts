import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-anleitung',
  templateUrl: './anleitung.component.html',
  styleUrls: ['./anleitung.component.css']
})
export class AnleitungComponent implements OnInit {
  fullImagePathSitzordnung: string;
  fullImagePathSchulzimmer: string;
  fullImagePathGruppeneinteilung: string;
  fullImagePathSchulklasse: string;
  fullImagePathProfil: string;

  constructor() {
    this.fullImagePathSitzordnung = '/assets/images/Sitzordnung.jpg';
    this.fullImagePathSchulzimmer = '/assets/images/Schulzimmer_erfassen.jpg';
    this.fullImagePathGruppeneinteilung = '/assets/images/Gruppeneinteilung.jpg';
    this.fullImagePathSchulklasse = '/assets/images/Schulklasse_erfassen.jpg';
    this.fullImagePathProfil = '/assets/images/Profilfoto.jpg';
   }

  ngOnInit() {
  }

}
