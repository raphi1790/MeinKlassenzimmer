// src/app/services/auth/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { 
  Auth, 
  authState, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User as FirebaseUser 
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc, 
  docData,
  serverTimestamp 
} from '@angular/fire/firestore';
import { User } from '../../models/user';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Modern inject() pattern
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  authState: FirebaseUser | null = null;
  user: Observable<User | null>;
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    console.log('🏗️ AuthService constructor');
    
    // Subscribe to auth state changes
    authState(this.auth).subscribe((auth) => {
      this.authState = auth;
      console.log('🔐 Auth state changed:', auth?.email || 'null');
    });

    // Initialize the user observable
    this.user = authState(this.auth).pipe(
      startWith(null),
      switchMap(user => {
        if (user && user.uid) {
          const userDocRef = doc(this.firestore, `users/${user.uid}`);
          return docData(userDocRef) as Observable<User>;
        } else {
          return of(null);
        }
      })
    );

    // Test Firestore connection in constructor
    const testDocRef = doc(this.firestore, 'test', 'test_constructor');
    setDoc(testDocRef, {
      timestamp: new Date()
    }).then(() => {
      console.log('📊 Firestore connection test successful');
    }).catch(error => {
      console.error('📊 Firestore connection test failed:', error);
    });
  }

  public async login() {
    try {
      const provider = new GoogleAuthProvider();
      
      console.log('🔐 Starting login...');
      const credential = await signInWithPopup(this.auth, provider);

      if (!credential) {
        throw new Error('No credential after sign-in');
      }

      console.log('✅ Sign-in successful');
      const firebaseUser = credential.user;
      
      if (!firebaseUser) {
        throw new Error('No Firebase user after sign-in');
      }

      console.log('👤 User obtained, writing test document...');
      
      // Write test document using modern API
      const testDocRef = doc(this.firestore, 'test', 'test_login');
      await setDoc(testDocRef, {
        timestamp: serverTimestamp(),
        userId: firebaseUser.uid
      });
      console.log('✅ Test login document written successfully');

      // Update user data
      console.log('📝 Updating user data...');
      await this.updateUserData(firebaseUser);

      // Navigate to dashboard
      console.log('🚀 Navigating to dashboard...');
      await this.router.navigate(['/dashboard']);

      // Store token in localStorage
      const token = await firebaseUser.getIdToken();
      localStorage.setItem('tokenId', token);

      console.log('✅ Login process completed successfully');
    } catch (error) {
      console.error('❌ Error during login:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
      throw error;
    }
  }

  public async logout() {
    try {
      await signOut(this.auth);
      await this.router.navigate(['/']);
      localStorage.clear();
      console.log('✅ Logged out successfully');
    } catch (error) {
      console.error('❌ Error during logout:', error);
      throw error;
    }
  }

  public isAuthenticated(): boolean {
    // Always authenticated in development mode
    return environment.production ? this.authState !== null : true;
  }

  private async updateUserData(user: FirebaseUser | null): Promise<void> {
    if (!user) return;

    try {
      const userDocRef = doc(this.firestore, 'users', user.uid);

      const data: User = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
      };

      await setDoc(userDocRef, data, { merge: true });
      this.userSubject.next(data);
      console.log('✅ User data updated successfully');
    } catch (error) {
      console.error('❌ Error updating user data:', error);
      throw error;
    }
  }
}