import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-sitzordnung-info-dialog',
  templateUrl: './sitzordnung-info-dialog.component.html',
  styleUrls: ['./sitzordnung-info-dialog.component.css']
})
export class SitzordnungInfoDialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<SitzordnungInfoDialogComponent>,) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
