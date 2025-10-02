import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { User } from '../models/user';
import { map, switchMap, filter } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { DataService } from "./data.service";

@Injectable()
export class UserService implements DataService {
  private dbPath = '/users';
  
  constructor(
    private http: HttpClient, 
    private afAuth: AngularFireAuth, 
    private firestore: AngularFirestore
  ) {
    console.log('📊 UserService constructor called');
  }

  getUser(): Observable<User[]> {
  console.log('📊 getUser called');
  
  return this.afAuth.authState.pipe(
    filter(user => !!user),
    switchMap(user => {
      console.log('📊 User authenticated, querying Firestore for uid:', user.uid);
      
      return this.firestore.doc<User>(`${this.dbPath}/${user.uid}`).get().pipe(
        map(doc => {
          if (doc.exists) {
            // Existing user
            const data = doc.data() as User;
            return [new User({ ...data, uid: user.uid })];
          } else {
            // New user - create default document
            const newUser = new User({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              schulklassen: [],
              klassenlisten: [],
              schulzimmer: [],
              regeln: [],
              sitzordnungen: []
            });
            
            // Save new user document
            this.updateUser(newUser);
            
            return [newUser];
          }
        })
      );
    })
    );
  }

  mapUser(apply) {
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

  updateUser(data: User) {
    console.log('📊 updateUser called with:', data);
    
    // Get current user directly from AngularFireAuth
    this.afAuth.currentUser.then(currentUser => {
      if (currentUser) {
        const userRef = this.firestore.collection(this.dbPath).doc(currentUser.uid);
        userRef.set(JSON.parse(JSON.stringify(data)), { merge: true });
        console.log('📊 updateUser completed');
      } else {
        console.error('📊 updateUser error: No authenticated user');
      }
    }).catch(error => {
      console.error('📊 updateUser error:', error);
    });
  }
}