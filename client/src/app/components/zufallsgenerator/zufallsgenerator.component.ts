import { Component, OnInit, ViewChild } from '@angular/core';
import { DummyService } from '../../services/dummy.service';
import { Schulklasse } from '../../models/schulklasse';
import { Schueler } from '../../models/schueler';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Randomizer } from '../../helpers/randomizer';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-zufallsgenerator',
  templateUrl: './zufallsgenerator.component.html',
  styleUrls: ['./zufallsgenerator.component.css']
})
export class ZufallsgeneratorComponent implements OnInit {
  

  constructor(private userService:UserService) {
   }
  
  myUser:User
  klassenToPerson: Schulklasse[];
  isLoadingData: boolean;
  selectedSchulklasse: Schulklasse;
  selectedNumberSchuelerInput: number;
  selectedSchueler: Schueler[];
  displayedColumns = ['vorname', 'name'];
  dataSource = new MatTableDataSource<Schueler>();
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

     
  loadInputData() {
    this.userService.getUser().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ uid: c.payload.doc['id'], ...c.payload.doc.data() })
        )
      )
    ).subscribe(users => {
      debugger;
      this.myUser = new User(users[0])
      this.klassenToPerson = this.myUser.schulklassen
      // console.log(this.myUser)
      // console.log(this.klassenToPerson)
      this.isLoadingData = false;
    
    });

  
  }

  selectOneSchueler(){
    
    this.selectSchueler(1)

  }
  selectTwoSchueler(){
    this.selectSchueler(2)

  }
  selectFiveSchueler(){
    this.selectSchueler(5)

  }
  selectInputNumberSchueler(){
    this.selectSchueler(this.selectedNumberSchuelerInput)
  }

  private selectSchueler(numberSelectedSchueler: number){
      let randomizer = new Randomizer()
      let randomizedSchueler = randomizer.shuffle(this.selectedSchulklasse.schueler)
      this.selectedSchueler = randomizedSchueler.slice(0, numberSelectedSchueler)

      this.dataSource.data = this.selectedSchueler;



  }


  ngOnInit(): void {
    this.isLoadingData = true;
    this.loadInputData();

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
