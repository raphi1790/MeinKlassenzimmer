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
import { LoggingService } from '../logging.service';
import { 
  Firestore, 
  doc, 
  setDoc, 
  docData,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  getDoc
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
  private logger = inject(LoggingService);

  authState: FirebaseUser | null = null;
  user: Observable<User | null>;
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    this.logger.auth('AuthService constructor');
    
    // Subscribe to auth state changes
    authState(this.auth).subscribe((auth) => {
      this.authState = auth;
      this.logger.auth('Auth state changed', { email: auth?.email || 'null' });
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
  }

  public async login() {
    try {
      const provider = new GoogleAuthProvider();
      
      this.logger.auth('Starting login process');
      const credential = await signInWithPopup(this.auth, provider);

      if (!credential) {
        throw new Error('No credential after sign-in');
      }

      this.logger.auth('Sign-in successful');
      const firebaseUser = credential.user;
      
      if (!firebaseUser) {
        throw new Error('No Firebase user after sign-in');
      }

      this.logger.auth('User obtained, writing test document');
      
      // Write test document using modern API
      const testDocRef = doc(this.firestore, 'test', 'test_login');
      await setDoc(testDocRef, {
        timestamp: serverTimestamp(),
        userId: firebaseUser.uid
      });
      this.logger.db('Test login document written successfully');

      // Update user data
      this.logger.db('Updating user data');
      await this.updateUserData(firebaseUser);

      // Navigate to dashboard
      this.logger.auth('Navigating to main page');
      await this.router.navigate(['/']);

      // Store token in localStorage
      const token = await firebaseUser.getIdToken();
      localStorage.setItem('tokenId', token);

      this.logger.auth('Login process completed successfully');
    } catch (error) {
      this.logger.error('Error during login', error);
      throw error;
    }
  }

  public async logout() {
    try {
      await signOut(this.auth);
      await this.router.navigate(['/']);
      localStorage.clear();
      this.logger.auth('Logged out successfully');
    } catch (error) {
      this.logger.error('Error during logout', error);
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
      const userDocSnapshot = await getDoc(userDocRef);

      // If user exists in the new collection, update merge with new auth data
      if (userDocSnapshot.exists()) {
        const existingData = userDocSnapshot.data() as User;
        const updatedData: User = {
          ...existingData,
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
        };
        await setDoc(userDocRef, updatedData, { merge: true });
        this.userSubject.next(updatedData);
        this.logger.auth('User data updated successfully');
      } else {
        // User doesn't exist, check if they exist in users_old collection
        this.logger.auth('User not found in users collection, checking users_old');
        const migratedData = await this.migrateUserFromOldCollection(user.email || '', user);
        
        if (migratedData) {
          // User was found and migrated
          this.userSubject.next(migratedData);
          this.logger.auth('User successfully migrated from users_old collection');
        } else {
          // User is completely new, create default document
          const newUserData: User = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
          };
          await setDoc(userDocRef, newUserData, { merge: true });
          this.userSubject.next(newUserData);
          this.logger.auth('New user created successfully');
        }
      }
    } catch (error) {
      this.logger.error('Error updating user data', error);
      throw error;
    }
  }

  private async migrateUserFromOldCollection(email: string, firebaseUser: FirebaseUser): Promise<User | null> {
    try {
      // Query users_old collection by email
      const userOldCollectionRef = collection(this.firestore, 'users_old');
      const q = query(userOldCollectionRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        this.logger.auth('No matching user found in users_old collection');
        return null;
      }

      // Get the first matching document
      const oldUserDoc = querySnapshot.docs[0];
      const oldUserData = oldUserDoc.data() as any;

      this.logger.auth('Found user in users_old collection, migrating data', { oldUid: oldUserDoc.id });

      // Prepare migrated data with new UID and current Firebase user's displayName and photoURL
      const migratedData: User = {
        ...oldUserData,
        uid: firebaseUser.uid, // Replace with current authentication UID
        email: email,
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
      };

      // Write migrated data to users collection
      const userDocRef = doc(this.firestore, 'users', firebaseUser.uid);
      await setDoc(userDocRef, migratedData, { merge: true });

      this.logger.db('User data migrated from users_old to users collection', { 
        oldUid: oldUserDoc.id, 
        newUid: firebaseUser.uid 
      });

      return migratedData;
    } catch (error) {
      this.logger.error('Error migrating user from users_old collection', error);
      return null;
    }
  }
}