// src/app/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { AngularFireAuth} from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../../models/user';
import { Observable, of } from 'rxjs';
import { switchMap} from 'rxjs/operators';
import firebase from 'firebase/app';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })



export class AuthService {



  authState: any;
  user: Observable<User>;

  

  constructor(private afAuth: AngularFireAuth, private router: Router,
    private firestore: AngularFirestore) {

    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
    })
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges()
        } else {
          return of(null)
        }
      })
    );
  
    
  }

  login() {
    return this.afAuth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()).then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        debugger;
        this.updateUserData(result.user);
        this.authState = result.user;
        this.getToken(result);
        this.currentUser();
        
        return true;
      }).catch(function (error) {
        // Handle Errors here.
        return false;
      });
  }



  public logout() {
    this.afAuth.signOut();
    this.router.navigate(['/'])
    localStorage.clear();


  }

  public isAuthenticated(): boolean {
    // always authenticated if in develop-mode
    return environment.production ? this.authState !== null: true;

  }

   private get currentUser(): any {
    return this.isAuthenticated ? this.authState : null;
  }



  private getToken(result:any) {
    debugger;
    var token = result.credential.accessToken;
    localStorage.setItem('tokenId', token);
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    debugger;
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }

    return userRef.set(data, { merge: true })

  }

  



}
