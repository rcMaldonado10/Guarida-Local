import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

  authToken: any;
  admin: any;

  constructor(private http: Http) { }

  registerAdmin(admin) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/admin/register', admin, {headers: headers})
      .map(res => res.json());
  }

  authenticateAdmin(admin) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/admin/authenticate', admin, { headers: headers })
      .map(res => res.json());
  }

  getProfile() {
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/admin/profile', { headers: headers })
      .map(res => res.json());
  }

  storeAdminData(token, admin) {
    localStorage.setItem('token', token);
    localStorage.setItem('admin', JSON.stringify(admin));
    this.authToken = token;
    this.admin = admin;
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

  loggedIn() {
    return tokenNotExpired();
  }

  logout() {
    this.authToken = null;
    this.admin = null;
    localStorage.clear();
  }
}
