import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { map, switchMap, filter } from 'rxjs/operators';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { DataService } from './data.service';
import { LoggingService } from './logging.service';

@Injectable()
export class UserService implements DataService {
  private dbPath = '/users';
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private http = inject(HttpClient);

  private logger = inject(LoggingService);

  constructor() {
    this.logger.db('UserService constructor called');
  }

  getUser(): Observable<User[]> {
    this.logger.db('getUser called');
    
    return authState(this.auth).pipe(
      filter(user => !!user),
      switchMap(user => {
        this.logger.db('User authenticated, querying Firestore', { userExists: true });
        
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
            this.logger.error('Error fetching user document:', error);
            observer.error(error);
          });
        });
      })
    );
  }

  mapUser(apply: (users: User[]) => void) {
    this.logger.db('mapUser called');
    this.getUser().subscribe({
      next: (users) => {
        this.logger.db('mapUser received users', { count: users.length });
        apply(users);
      },
      error: (error) => {
        this.logger.error('mapUser error:', error);
      }
    });
  }

  async updateUser(data: User): Promise<void> {
    this.logger.db('updateUser called');
    
    try {
      const currentUser = this.auth.currentUser;
      
      if (currentUser) {
        const userDocRef = doc(this.firestore, this.dbPath, currentUser.uid);
        await setDoc(userDocRef, JSON.parse(JSON.stringify(data)), { merge: true });
        this.logger.db('updateUser completed');
      } else {
        this.logger.error('updateUser error: No authenticated user');
      }
    } catch (error) {
      this.logger.error('updateUser error:', error);
      throw error;
    }
  }
}