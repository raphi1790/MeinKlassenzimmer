import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-regel-info-dialog',
  templateUrl: './klassenlisten-info-dialog.component.html',
  styleUrls: ['./klassenlisten-info-dialog.component.css']
})
export class KlassenlistenInfoDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<KlassenlistenInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }


}
