import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verwaltung',
  templateUrl: './verwaltung.component.html',
  styleUrls: ['./verwaltung.component.css']
})
export class VerwaltungComponent implements OnInit {
  showKlassen : boolean;
  constructor() { 
    this.showKlassen = true;
  }

  ngOnInit() {
  }

}
