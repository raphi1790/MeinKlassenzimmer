import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-info-dialog',
    templateUrl: './info-dialog.component.html',
    styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<InfoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
    
    @Output() submitClicked = new EventEmitter<any>();


    ngOnInit() {
    }

    confirm(): void {
        debugger;
        // this.submitClicked.emit(true);
        this.dialogRef.close();

    }

    onNoClick(): void {
        this.dialogRef.close();
    }


}
