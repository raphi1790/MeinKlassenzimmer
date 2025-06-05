import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { User } from '../models/user';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { DataService } from "./data.service";



@Injectable()
export class UserService implements DataService{

    private dbPath = '/users';
    usersRef: AngularFirestoreCollection<User> = null
    


  constructor(private http: HttpClient, private authService: AuthService, private firestore: AngularFirestore) { 
    this.usersRef = this.firestore.collection(this.dbPath, ref => ref.where("uid", "==", this.getUserId()));
  }


  private getUserId():string{
    let currentUser = this.authService.authState
    return currentUser.uid;
  }

   getUser(): AngularFirestoreCollection<User> {
    return this.usersRef;
  }

  mapUser(apply){
    this.getUser().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ uid: c.payload.doc['id'], ...c.payload.doc.data() })
        )
      )
    ).subscribe(apply);
  } 

  updateUser(data:User) {
      // console.log(JSON.parse(JSON.stringify(data)))
    this.usersRef.doc(this.getUserId()).set(JSON.parse(JSON.stringify(data)), { merge: true });

 } 
}