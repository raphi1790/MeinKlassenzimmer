// src/app/auth/auth.service.ts
import { Injectable, NgZone, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from '../../models/user';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  authState: any;
  user: Observable<User>;
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore,
    private ngZone: NgZone,
    private injector: Injector
  ) {
    
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });

    // Initialize the user observable with proper error handling and null safety
    this.user = this.afAuth.authState.pipe(
      startWith(null), // Start with null to prevent undefined issues
      switchMap(user => {
        if (user && user.uid) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
    
    this.firestore.collection('test').doc('test_constructor').set({
      timestamp: new Date()
    }).then(() => {
      console.log('📊 Firestore connection test successful');
    }).catch(error => {
      console.error('📊 Firestore connection test failed:', error);
    });
  }

  public async login() {
    // DON'T wrap the entire method in ngZone.run()!
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      
      console.log('🔐 Starting login...');
      const credential = await this.afAuth.signInWithPopup(provider);

      if (!credential) {
        throw new Error('No credential after sign-in');
      }

      console.log('✅ Sign-in successful, getting user...');
      const firebaseUser = await this.afAuth.currentUser;
      if (!firebaseUser) {
        throw new Error('No Firebase user after sign-in');
      }

      console.log('👤 User obtained, writing test document...');
      
      debugger;
      // AngularFirestore works here because we're NOT inside ngZone.run()
      await this.firestore.collection('test').doc('test_login').set({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userId: firebaseUser.uid
      });
      console.log('✅ Test login document written via AngularFirestore');

      // Update user data
      console.log('📝 Updating user data...');
      await this.updateUserData(firebaseUser);

      // ONLY wrap navigation in ngZone if needed
      console.log('🚀 Navigating to dashboard...');
      await this.ngZone.run(() => this.router.navigate(['/dashboard']));

      // Store token
      if (credential) {
        this.getToken(credential);
      }

      console.log('✅ Login process completed');
    } catch (error) {
      console.error('❌ Error during login:', error);
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  }

  public logout() {
    this.afAuth.signOut();
    this.router.navigate(['/']);
    localStorage.clear();
  }

  public isAuthenticated(): boolean {
    // always authenticated if in develop-mode
    return environment.production ? this.authState !== null : true;
  }

  private get currentUser(): any {
    return this.isAuthenticated ? this.authState : null;
  }

  private getToken(result: any) {
    var token = result.credential.accessToken;
    localStorage.setItem('tokenId', token);
  }

  private async updateUserData(user: firebase.User | null): Promise<void> {
    if (!user) return;

    try {
      // FIX 4: Use Firebase SDK directly to avoid injection issues
      const userDoc = firebase.firestore().collection('users').doc(user.uid);
      
      const data: User = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
      };

      await userDoc.set(data, { merge: true });
      this.userSubject.next(data);
      console.log('✅ User data updated successfully via Firebase SDK');
    } catch (error) {
      console.error('❌ Error updating user data:', error);
      throw error;
    }
  }
}