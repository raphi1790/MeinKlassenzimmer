import { Observable } from 'rxjs';
import { User } from "../models/user";

export abstract class DataService {
    abstract mapUser(): Observable<User>;
    abstract updateUser(user:User): void;
  }