import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-einteilung-info-dialog',
  templateUrl: './einteilung-info-dialog.component.html',
  styleUrls: ['./einteilung-info-dialog.component.css']
})
export class EinteilungInfoDialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<EinteilungInfoDialogComponent>,) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
