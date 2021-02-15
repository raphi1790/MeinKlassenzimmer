import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from "../models/user";

export abstract class DataService {
    abstract mapUser(apply): any;
    abstract updateUser(user:User): void;
  }