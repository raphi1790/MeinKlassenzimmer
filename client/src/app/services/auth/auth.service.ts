// src/app/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { AngularFireAuthModule, AngularFireAuth} from "@angular/fire/auth";
import * as firebase from 'firebase/app';


@Injectable()
export class AuthService {



  userProfile: any;
  authState: any;

  

  constructor(private afAuth: AngularFireAuth, private router: Router) {

    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
    });
    
  }



  login() {
    return this.afAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()).then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        this.authState = result.user;
        this.getToken();
        this.currentUser();
        return true;
      }).catch(function (error) {
        // Handle Errors here.
        return false;
      });
  }



  private getToken() {
    this.afAuth.auth.currentUser.getIdToken(true)
      .then(
        (token) => localStorage.setItem('tokenId', token)).catch(function (error) {
          throw new Error('Token cannot be fetched.');
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
  get currentUser(): any {
    console.log("Current User");
    console.log(this.authState);
    return this.isAuthenticated ? this.authState : null;
  }
  get currentUserId(): string {
    return this.isAuthenticated ? this.authState.uid : '';
  }



}