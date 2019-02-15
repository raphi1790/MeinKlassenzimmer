import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-regel-info-dialog',
  templateUrl: './regel-info-dialog.component.html',
  styleUrls: ['./regel-info-dialog.component.css']
})
export class RegelInfoDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RegelInfoDialogComponent>,) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }


}
