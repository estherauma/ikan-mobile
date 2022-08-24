import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    public http: HttpClient
  ) { }

  get(resourceUrl) {}

  post(resourceUrl) {}

  /**
   * Replace entire resource
   */
  put(resourceUrl) {}

  /**
   * Updates only parts of the entire resource
   */
  patch(resourceUrl) {}

  delete(resourceUrl) {}
}
