import { User } from "../models/user";

export abstract class DataService {
    abstract mapUser(any): any;
    abstract updateUser(user:User): void;
  }