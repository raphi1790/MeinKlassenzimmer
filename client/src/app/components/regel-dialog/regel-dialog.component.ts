import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Regel } from 'src/app/models/regel';

@Component({
    selector: 'app-regel-dialog',
    templateUrl: './regel-dialog.component.html',
    styleUrls: ['./regel-dialog.component.css']
})
export class RegelDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<RegelDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    displayedColumns = ['select', 'type', 'beschreibung'];
    selection = new SelectionModel<Regel>(true, []);
    dataSource: any
    @Output() submitClicked = new EventEmitter<any>();

    isAllSelected() {
        debugger;
        const numSelected = this.selection.selected.length;
        const numRows = this.data.input.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        debugger;
        this.isAllSelected() ?
            this.selection.clear() :
            this.data.input.data.forEach(row => this.selection.select(row));
            console.log(this.selection)
    }

    saveMessage() {
        debugger;
        this.submitClicked.emit(this.selection);
        this.dialogRef.close();
      }

    ngOnInit() {
    }
    onNoClick(): void {
        this.dialogRef.close();
    }


}
