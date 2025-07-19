import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-startseite',
  templateUrl: './startseite.component.html',
  styleUrls: ['./startseite.component.css']
})
export class StartseiteComponent implements OnInit {

  constructor(private router: Router) { 

  }
  start() {
    this.router.navigateByUrl('/anleitung');

  }

  ngOnInit() {
  }

}
