import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-startseite',
  templateUrl: './startseite.component.html',
  styleUrls: ['./startseite.component.css']
})
export class StartseiteComponent implements OnInit {
  fullImagePath: string

  constructor() { 
     this.fullImagePath = '/assets/images/pencils.jpg'
  }

  ngOnInit() {
  }

}
