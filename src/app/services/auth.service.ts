import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../common/models/User';

const SERVER_URL = environment.serviceUrl;
const API_URLS = {
  LOGIN: '/login',
  LOGIN_TEAM: '/teamlogin',
  LOGOUT: '/logout',
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginAsTeam(loginCredentials: any): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post<any>(SERVER_URL + API_URLS.LOGIN_TEAM, loginCredentials, httpOptions)
    .pipe(
      catchError(this.handleError<any>('login'))
    );
  }

  constructor(private http: HttpClient) { }

  login(loginCredentials: any): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post<any>(SERVER_URL + API_URLS.LOGIN, loginCredentials, httpOptions);
  //  .pipe(
  //    catchError(this.handleError<any>('login'))
  //  );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  onMessage(message: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<any>(SERVER_URL + "/message", message, httpOptions)
    .pipe(
      catchError(this.handleError<any>('login'))
    );
  }
  
}
