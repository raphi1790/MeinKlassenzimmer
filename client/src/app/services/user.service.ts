import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient} from '@angular/common/http';
import 'rxjs/Rx';
import { User } from '../models/user';
import { AuthService } from '../services/auth/auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/firestore";
import { DataService } from "./data.service";



@Injectable()
export class UserService implements DataService{

    private dbPath = '/users';
    usersRef: AngularFirestoreCollection<User> = null
    


  constructor(private http: HttpClient, private authService: AuthService, private firestore: AngularFirestore) { 
    this.usersRef = this.firestore.collection(this.dbPath, ref => ref.where("uid", "==", this.getUserId()));
  }


  private getUserId():string{
    debugger;
    let currentUser = this.authService.authState
    return currentUser.uid;
  }

   getUser(): AngularFirestoreCollection<User> {
    return this.usersRef;
  }

  updateUser(data:User) {
      // console.log(JSON.parse(JSON.stringify(data)))
    this.usersRef.doc(this.getUserId()).set(JSON.parse(JSON.stringify(data)), { merge: true });

 } 
}