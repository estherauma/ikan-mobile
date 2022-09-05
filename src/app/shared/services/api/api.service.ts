import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { env } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  headers: HttpHeaders;

  constructor(
    public http: HttpClient
  ) { }

  async setApiRequestHeaders() {
    const accessToken = '';

    this.headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Bearer ${accessToken}`
    });
  }
  /**
   *
   * @param resourceUrl
   */
  get(resourceUrl): Observable<any> {
    return this.http.get(`${env.apiUrl}/${resourceUrl}`, {observe: 'response'});
  }


  /**
   *
   * @param resourceUrl
   * @param requestData
   * Return the data from a post request
   */
  post(resourceUrl, requestData) {
    //ToDo: Consider checking status of the request from here and also passing interface for the expected data
    return this.http.post(`${env.apiUrl}/${resourceUrl}`, requestData, {headers: this.headers});
  }

  /**
   *
   * @param resourceUrl
   * @param resourceId
   * @param requestData
   */
  put(resourceUrl, resourceId, requestData): void {
    this.http.put(`${env.apiUrl}/${resourceUrl}/${resourceId}/`, requestData, {headers: this.headers})
    .subscribe((response) => response);
  }

  /**
   * @param resourceUrl
   * @param resourceId
   * @param requestData
   */
  patch(resourceUrl, resourceId, requestData) {
    this.http.patch(`${env.apiUrl}/${resourceUrl}/${resourceId}/`, requestData, {headers: this.headers})
    .subscribe((response) => response);
  }

  delete(resourceUrl, resourceId) {
    // ToDo: Implement later when we want to start deleting records.
  }
}
