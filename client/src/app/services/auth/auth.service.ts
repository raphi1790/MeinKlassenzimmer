// src/app/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import {  AngularFireAuth} from "@angular/fire/auth";
import { auth } from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../../models/user';
import { Observable, of } from 'rxjs';
import { switchMap} from 'rxjs/operators';


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
    return this.afAuth.auth.signInWithPopup(
      new auth.GoogleAuthProvider()).then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        this.updateUserData(result.user);
        this.authState = result.user;
        this.getToken();
        this.currentUser();
        
        return true;
      }).catch(function (error) {
        // Handle Errors here.
        return false;
      });
  }



  public logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/'])
    localStorage.clear();


  }

  public isAuthenticated(): boolean {

    return this.authState !== null;

  }

   private get currentUser(): any {
    // console.log("Current User");
    // console.log(this.authState);
    return this.isAuthenticated ? this.authState : null;
  }



  private getToken() {
    this.afAuth.auth.currentUser.getIdToken(true)
      .then(
        (token) => localStorage.setItem('tokenId', token)).catch(function (error) {
          throw new Error('Token cannot be fetched.');
        });
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

  


 
  // get currentUserId(): string {
  //   return this.isAuthenticated ? this.authState.uid : '';
  // }



}
