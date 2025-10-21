import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { map, switchMap, filter } from 'rxjs/operators';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { DataService } from './data.service';

@Injectable()
export class UserService implements DataService {
  private dbPath = '/users';
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private http = inject(HttpClient);

  constructor() {
    console.log('📊 UserService constructor called');
  }

  getUser(): Observable<User[]> {
    console.log('📊 getUser called');
    
    return authState(this.auth).pipe(
      filter(user => !!user),
      switchMap(user => {
        console.log('📊 User authenticated, querying Firestore for uid:', user!.uid);
        
        const userDocRef = doc(this.firestore, `${this.dbPath}/${user!.uid}`);
        
        return new Observable<User[]>(observer => {
          getDoc(userDocRef).then(docSnapshot => {
            if (docSnapshot.exists()) {
              // Existing user
              const data = docSnapshot.data() as User;
              observer.next([new User({ ...data, uid: user!.uid })]);
              observer.complete();
            } else {
              // New user - create default document
              const newUser = new User({
                uid: user!.uid,
                email: user!.email || '',
                displayName: user!.displayName || '',
                photoURL: user!.photoURL || '',
                schulklassen: [],
                klassenlisten: [],
                schulzimmer: [],
                regeln: [],
                sitzordnungen: []
              });
              
              // Save new user document
              this.updateUser(newUser);
              observer.next([newUser]);
              observer.complete();
            }
          }).catch(error => {
            console.error('📊 Error fetching user document:', error);
            observer.error(error);
          });
        });
      })
    );
  }

  mapUser(apply: (users: User[]) => void) {
    console.log('📊 mapUser called');
    this.getUser().subscribe({
      next: (users) => {
        console.log('📊 mapUser received users:', users);
        apply(users);
      },
      error: (error) => {
        console.error('📊 mapUser error:', error);
      }
    });
  }

  async updateUser(data: User): Promise<void> {
    console.log('📊 updateUser called with:', data);
    
    try {
      const currentUser = this.auth.currentUser;
      
      if (currentUser) {
        const userDocRef = doc(this.firestore, this.dbPath, currentUser.uid);
        await setDoc(userDocRef, JSON.parse(JSON.stringify(data)), { merge: true });
        console.log('📊 updateUser completed');
      } else {
        console.error('📊 updateUser error: No authenticated user');
      }
    } catch (error) {
      console.error('📊 updateUser error:', error);
      throw error;
    }
  }
}