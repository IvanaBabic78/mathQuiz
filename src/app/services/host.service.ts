import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const SERVER_URL = environment.serviceUrl;
const HOST_API_URLS = {
  QUESTION: '/admin/competition/question'
};

@Injectable({
  providedIn: 'root'
})
export class HostService {

  constructor() { }
}
