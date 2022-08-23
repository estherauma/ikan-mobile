import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    public http: HttpClient
  ) { }

  get() {}

  post() {}

  /**
   * Replace entire resource
   */
  put() {}

  /**
   * Updates only parts of the entire resource
   */
  patch() {}

  delete() {}
}
