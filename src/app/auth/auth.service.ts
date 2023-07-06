import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userIsAuthenticated = false;
  userId = 'xyz';

  constructor() { }

  login(){
    this.userIsAuthenticated = true;
  }

  logout(){
    this.userIsAuthenticated = false;
  }
}
