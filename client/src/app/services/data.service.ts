import { User } from "../models/user";

export abstract class DataService {
    abstract getUser(): any;
    abstract updateUser(user:User): void;
  }