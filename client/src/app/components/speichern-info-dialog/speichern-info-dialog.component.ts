import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-speichern-info-dialog',
  templateUrl: './speichern-info-dialog.component.html',
  styleUrls: ['./speichern-info-dialog.component.css']
})
export class SpeichernInfoDialogComponent implements OnInit {

 
  constructor( public dialogRef: MatDialogRef<SpeichernInfoDialogComponent>,) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
