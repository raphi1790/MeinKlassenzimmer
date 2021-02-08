import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';

import { Schulklasse } from '../../models/schulklasse';
import { Schulzimmer } from '../../models/schulzimmer';
import { Regel } from '../../models/regel';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { RegelFilter } from '../../helpers/regel.filter';
import { UserService } from '../../services/user.service';
import { map } from 'rxjs/operators';
import { User } from '../../models/user';
import { DummyService } from 'src/app/services/dummy.service';
import { Sitzordnung } from 'src/app/models/sitzordnung';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaveSnackBarComponent } from '../save-snack-bar/save-snack-bar.component';
import { Name } from 'src/app/models/name';
import * as uuidv4 from 'uuid/v4';

@Component({
    selector: 'app-sitzordnung-management',
    templateUrl: './sitzordnung.management.component.html',
    styleUrls: ['./sitzordnung.management.component.css']
})
export class SitzordnungManagementComponent implements OnInit {



    myUser: User
    klassenToPerson: Schulklasse[];
    zimmerToPerson: Schulzimmer[];
    sitzordnungenToPerson: Sitzordnung[]
    sitzordnungenToPersonOriginal: Sitzordnung[]
    isLoadingData: boolean;
    isSaving: boolean;
    savingIsActiv: boolean;
    regelnToPerson: Regel[];
    selectedSitzordnung: Sitzordnung;
    selectedSitzordnungNameInput: string;
    selectedSchulklasse: Schulklasse;
    selectedSchulzimmer: Schulzimmer;
    relevantSchulklasse: Schulklasse;
    relevantSchulzimmer: Schulzimmer;
    relevantRegeln: Regel[];
    relevantSitzordnung: Sitzordnung;

    displayedColumns: string[] = ['name', "klasse", 'zimmer', 'action'];
    dataSource: MatTableDataSource<Sitzordnung>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;


    myListForm: FormGroup
    name: FormControl;
    klasse: FormControl;
    zimmer: FormControl;
    formSubmitAttempt: boolean;

    regelFilter: RegelFilter;



    constructor(
        // private userService: UserService,
        private dummyService: DummyService,
        private _snackBar: MatSnackBar
    ) {
        this.regelFilter = new RegelFilter()

    }




    loadInputData() {
        debugger;
        this.myUser = this.dummyService.getUser()
        this.sitzordnungenToPerson = this.myUser.sitzordnungen
        this.sitzordnungenToPersonOriginal = JSON.parse(JSON.stringify(this.sitzordnungenToPerson));
        this.klassenToPerson = this.myUser.schulklassen
        this.zimmerToPerson = this.myUser.schulzimmer
        this.regelnToPerson = this.myUser.regeln
        console.log(this.myUser)
        console.log(this.zimmerToPerson)
        this.isLoadingData = false;

        this.dataSource = new MatTableDataSource(this.sitzordnungenToPerson);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;


    }
    // loadInputData() {
    //     this.userService.getUser().snapshotChanges().pipe(
    //         map(changes =>
    //             changes.map(c =>
    //                 ({ uid: c.payload.doc['id'], ...c.payload.doc.data() })
    //             )
    //         )
    //     ).subscribe(users => {
    //         debugger;
    //         this.myUser = new User(users[0])
    //         this.klassenToPerson = this.myUser.schulklassen
    //         this.regelnToPerson = this.myUser.regeln
    //         this.zimmerToPerson = this.myUser.schulzimmer
    //         this.sitzordnungenToPerson = this.myUser.sitzordnungen
    //         this.sitzordnungenToPersonOriginal = JSON.parse(JSON.stringify(this.sitzordnungenToPerson));
    //         // console.log(this.myUser)
    //         // console.log(this.klassenToPerson)
    //         this.isLoadingData = false;
    //         this.dataSource = new MatTableDataSource(this.sitzordnungenToPerson);
    //         this.dataSource.paginator = this.paginator;
    //         this.dataSource.sort = this.sort;


    //     });


    // }

    getSchulzimmerName(sitzordnung: Sitzordnung): string {

        let schulzimmerName = this.zimmerToPerson.filter(zimmer => zimmer.id == sitzordnung.schulzimmerId)[0].name
        return schulzimmerName
    }
    getSchulklassenName(sitzordnung: Sitzordnung): string {
        let schulklassenName = this.klassenToPerson.filter(klasse => klasse.id == sitzordnung.schulklassenId)[0].name
        return schulklassenName
    }
    createButtonActive(): boolean {
        return (
            this.myListForm.valid
        )
    }
    isFieldValid(form: FormGroup, field: string) {
        return (
            (!form.get(field).valid && (form.get(field).touched
                || form.get(field).dirty)) ||
            (form.get(field).untouched && this.formSubmitAttempt)

        );
    }
    createFormControls() {
        this.name = new FormControl(null, [Validators.required, Validators.minLength(2)]);
        this.klasse = new FormControl(null, Validators.required);
        this.zimmer = new FormControl(null, Validators.required);


    }
    createForm() {
        this.myListForm = new FormGroup({
            name: this.name,
            klasse: this.klasse,
            zimmer: this.zimmer
        });
    }
    canDeactivate() {
        debugger;
        return !this.savingIsActiv;
    }


    createSitzordnung(): void {
        debugger;
        let sitzordnungTmp = new Sitzordnung();
        sitzordnungTmp.personId = this.myUser.uid;
        sitzordnungTmp.id = uuidv4();
        sitzordnungTmp.name = this.selectedSitzordnungNameInput
        sitzordnungTmp.schulklassenId = this.selectedSchulklasse.id
        sitzordnungTmp.schulzimmerId = this.selectedSchulzimmer.id
        sitzordnungTmp.seatings = null
        this.sitzordnungenToPerson.push(sitzordnungTmp);

        this.savingIsActiv = true;

        sitzordnungTmp = null;
        this.selectedSchulklasse = null;
        this.selectedSchulzimmer = null;
        this.selectedSitzordnungNameInput = null;

        this.myListForm.markAsPristine();
        this.myListForm.markAsUntouched();
        this.myListForm.updateValueAndValidity();

        this.dataSource = new MatTableDataSource(this.sitzordnungenToPerson);

    }

    onSelect(selectedSitzordnung: Sitzordnung): void {
        debugger;
        this.selectedSitzordnung = selectedSitzordnung;
        this.relevantSchulklasse = this.klassenToPerson.filter(klasse => klasse.id == selectedSitzordnung.schulklassenId)[0]
        this.relevantSchulzimmer = this.zimmerToPerson.filter(zimmer => zimmer.id == selectedSitzordnung.schulzimmerId)[0]
        this.relevantRegeln = this.regelFilter.filterRegelBySchulklasse(this.regelnToPerson,
            this.klassenToPerson, this.relevantSchulklasse)

    }

    deleteSitzordnung(selectedSitzordnung: Sitzordnung): void {
        debugger;
        this.sitzordnungenToPerson = this.sitzordnungenToPerson.filter(
            item =>
                item.id !== selectedSitzordnung.id);
        this.selectedSitzordnung = null;
        this.savingIsActiv = true;
        this.dataSource = new MatTableDataSource(this.sitzordnungenToPerson);

    }

    onNameChange(newName: Name): void {
        debugger;
        let oldName = this.sitzordnungenToPerson.filter(sitzordnung => sitzordnung.id == newName.id)[0].name;
        if (oldName != newName.text) {
            this.sitzordnungenToPerson.filter(sitzordnung => sitzordnung.id == newName.id)[0].name = newName.text;
            this.savingIsActiv = true;
        }

    }

    updateSitzordnung(updatedSitzordnung: Sitzordnung): void {
        debugger;
        this.sitzordnungenToPerson = this.sitzordnungenToPerson.filter(
            item =>
                item.id !== updatedSitzordnung.id)
        if (typeof this.sitzordnungenToPerson == 'undefined') {
            console.log("sitzordnungToPerson is undefined");
        }
        else {
            this.sitzordnungenToPerson.push(updatedSitzordnung);
        }
        this.savingIsActiv = true;
        
    }




    cancel() {
        debugger;
        this.sitzordnungenToPerson = JSON.parse(JSON.stringify(this.sitzordnungenToPersonOriginal));
        this.dataSource = new MatTableDataSource(this.sitzordnungenToPerson);
        this.savingIsActiv = false;
    }

    saveSitzordnungen(): void {
        console.log("saving", this.sitzordnungenToPerson)
        // debugger;
        // this.savingIsActiv = false;
        // this.isSaving = true;
        // this.myUser.sitzordnungen = this.sitzordnungenToPerson
        // this.userService.updateUser(this.myUser);
        // this.isSaving = false;
        // this.sitzordnungenToPersonOriginal = this.sitzordnungenToPerson;
        // this.openSavingSnackBar()

    }
    openSavingSnackBar() {
        this._snackBar.openFromComponent(SaveSnackBarComponent, {
            duration: 2000,
        });

    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }






    ngOnInit() {
        this.createFormControls();
        this.createForm();
        this.isLoadingData = true;
        this.loadInputData();

    }

}