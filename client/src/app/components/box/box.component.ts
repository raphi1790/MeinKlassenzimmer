import { getLocaleDateFormat } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegelChecker } from 'src/app/helpers/regel.checker';
import { SitzordnungenRemover } from 'src/app/helpers/sitzordnungen.remover';
import { PositionTisch } from 'src/app/models/position.tisch';
import { Regel } from 'src/app/models/regel';
import { Schulzimmer } from 'src/app/models/schulzimmer';
import { Sitzordnung } from 'src/app/models/sitzordnung';
import { Tisch } from 'src/app/models/tisch';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { v4 as uuidv4 } from 'uuid';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css'],
  providers: [
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: 'noop' }
  ]
})
export class BoxComponent implements OnChanges {

  regelChecker: RegelChecker;
  sitzordnungRemover: SitzordnungenRemover;
  currentTisch: Tisch;
  currentTischNumber: number


  constructor(public dialog: MatDialog) {
    this.regelChecker = new RegelChecker();
    this.sitzordnungRemover = new SitzordnungenRemover()

  }


  @Input('row') row: number;
  @Input('column') column: number;
  @Input('selectedSchulzimmer') selectedSchulzimmer: Schulzimmer;
  @Input('maximalTischNumber') maximalTischNumber: number;
  @Input('regelnToPerson') regelnToPerson: Regel[];
  @Input('sitzordnungenToPerson') sitzordnungenToPerson: Sitzordnung[]

  @Output() noteSchulzimmer: EventEmitter<Schulzimmer> = new EventEmitter<Schulzimmer>();
  @Output() noteSchulzimmerTischNumber: EventEmitter<number> = new EventEmitter<number>();
  @Output() noteSitzordnungen: EventEmitter<Sitzordnung[]> = new EventEmitter<Sitzordnung[]>();

  tischStyle: string
  tischActive: boolean;
  checkboxDisabled: boolean;
  infoDialogRef: MatDialogRef<InfoDialogComponent>;


  getStyle(): void {
    this.currentTisch = this.getTisch(this.row, this.column)
    this.currentTischNumber = this.maximalTischNumber

    this.tischStyle = 'unselectedTischStyle'
    this.tischActive = false
    this.checkboxDisabled = true
    if (this.boxIsSelected()) {
      this.tischStyle = 'selectedTischStyle';
      this.currentTischNumber = this.currentTisch.tischNumber
      this.checkboxDisabled = false
      if (this.currentTisch.active) {
        this.tischActive = true;

      }
    }

  }

  private getTisch(row: number, column: number): Tisch {

    if (this.selectedSchulzimmer.tische !== undefined && this.selectedSchulzimmer.tische !== null) {
      let currentTisch = this.selectedSchulzimmer.tische.filter(tisch => tisch.position.row === row && tisch.position.column === column)[0]
      return currentTisch ? currentTisch : null
    }

  }
  private boxIsSelected(): boolean {
    return this.currentTisch ? true : false
  }


  selectTisch(): void {
    debugger;
    if (this.boxIsSelected()) {
      if (!this.regelChecker.regelExistsToTischId(this.currentTisch.id, this.regelnToPerson)) {

        this.tischStyle = 'unselectedTischStyle';
        this.currentTischNumber = null
        this.maximalTischNumber--
        this.removeTischFromSchulzimmer()
        this.tischActive = false
        this.checkboxDisabled = true
        this.noteSchulzimmer.emit(this.selectedSchulzimmer);
        this.noteSchulzimmerTischNumber.emit(this.maximalTischNumber);

        // remove Tisch from Sitzordnungen
        this.sitzordnungenToPerson = this.sitzordnungRemover.removeTischFromSeating(this.currentTisch, this.sitzordnungenToPerson)
        this.noteSitzordnungen.emit(this.sitzordnungenToPerson)
      } else {
        this.infoDialogRef = this.dialog.open(InfoDialogComponent, {
          data: { text: "Es existieren noch Regeln zu diesem Objekt, weshalb es nicht gelöscht werden kann. Bitte lösche zuerst die entsprechenden Regeln." },
          width: '550px',
        });
      }


    }
    else {
      this.tischStyle = 'selectedTischStyle';
      let newTisch = new Tisch({
        'id': uuidv4(),
        'active': true,
        'position': new PositionTisch(this.row, this.column),
        'schulzimmerId': this.selectedSchulzimmer.id,
        'tischNumber': ++this.maximalTischNumber
      })
      this.selectedSchulzimmer.tische.push(newTisch)
      this.tischActive = true
      this.checkboxDisabled = false
      this.noteSchulzimmer.emit(this.selectedSchulzimmer);
      this.noteSchulzimmerTischNumber.emit(this.maximalTischNumber);
    }


  }

  private removeTischFromSchulzimmer(): void {
    this.selectedSchulzimmer.tische = this.selectedSchulzimmer.tische.filter(tisch =>
      tisch.id !== this.currentTisch.id)
  }
  private updateCurrentTischInSchulzimmer(): void {
    this.selectedSchulzimmer.tische = this.selectedSchulzimmer.tische.filter(tisch =>
      tisch.id !== this.currentTisch.id)
    this.selectedSchulzimmer.tische.push(this.currentTisch)
  }

  activateTisch(): void {
    debugger;
    if (this.boxIsSelected()) {
      if (this.currentTisch.active) {
        if (!this.regelChecker.regelExistsToTischId(this.currentTisch.id, this.regelnToPerson)) {
          // deactivate tisch if there is no corresponding Regel to it
          this.currentTisch.active = false
          this.tischActive = false
          this.updateCurrentTischInSchulzimmer()
          this.noteSchulzimmer.emit(this.selectedSchulzimmer);
          // remove Tisch from Sitzordnungen
          this.sitzordnungenToPerson = this.sitzordnungRemover.removeTischFromSeating(this.currentTisch, this.sitzordnungenToPerson)
          this.noteSitzordnungen.emit(this.sitzordnungenToPerson)

        } else {
          this.infoDialogRef = this.dialog.open(InfoDialogComponent, {
            data: { text: "Es existieren noch Regeln zu diesem Objekt, weshalb es nicht gelöscht werden kann. Bitte lösche zuerst die entsprechenden Regeln." },
            width: '550px',
          });
        }

      } else {
        this.tischActive = true
        this.currentTisch.active = true
        this.updateCurrentTischInSchulzimmer()
        this.noteSchulzimmer.emit(this.selectedSchulzimmer);
      }

    }



  }

  ngOnChanges() {
    this.getStyle();
  }


}



