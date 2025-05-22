import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { env } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PushNotificationData, StorageKeys } from 'src/app/shared/types/api-types';
import { Preferences } from '@capacitor/preferences';
import { SharedmethodsService } from '../sharedmethods/sharedmethods.service';
import { AuthService } from '../auth/auth.service';
import { GlobalErrorHandlerService } from '../error-handler/global-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  headers: HttpHeaders;
  pushNotificationApi: string = env.pushNotificationApi;

  constructor(
    public http: HttpClient,
    public sharedMethods: SharedmethodsService,
    public globalErrorHandler: GlobalErrorHandlerService,
  ) {
    this.setApiRequestHeaders();
  }

  async setApiRequestHeaders() {
    const accessToken = await this.sharedMethods.readDataFromStorage(StorageKeys.apiToken);
    this.headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Bearer ${accessToken}`
    });
  }
  /**
   *
   * @param resourceUrl
   */
  get(resourceUrl, excludeHeaders=false, params={}): Observable<any> {
    const requestUrl = `${env.apiUrl}/${resourceUrl}`;
    if (excludeHeaders) {
      return this.http.get(requestUrl, {params, observe: 'response'});
    }
    return this.http.get(requestUrl, { headers: this.headers, params, observe: 'response' });
  }


  /**
   *
   * @param resourceUrl
   * @param requestData
   * Return the data from a post request
   */
  post(resourceUrl, requestData, excludeHeaders=false, params={}) {
    //TODO: Consider checking status of the request from here and also passing interface for the expected data
    if (excludeHeaders) {
      return this.http.post(`${env.apiUrl}/${resourceUrl}`, requestData, { params });
    }
    return this.http.post(`${env.apiUrl}/${resourceUrl}`, requestData, { headers: this.headers, params });
  }

  /**
   *
   * @param resourceUrl
   * @param resourceId
   * @param requestData
   */
  put(resourceUrl, resourceId, requestData) {
    return this.http.put(`${env.apiUrl}/${resourceUrl}/${resourceId}`, requestData, {headers: this.headers})
  }

  /**
   * @param resourceUrl
   * @param resourceId
   * @param requestData
   */
  patch(resourceUrl, resourceId, requestData) {
    return this.http.patch(`${env.apiUrl}/${resourceUrl}/${resourceId}`, requestData, {headers: this.headers});
  }

  delete(resourceUrl, resourceId) {
    return this.http.delete(`${env.apiUrl}/${resourceUrl}/${resourceId}`, {headers: this.headers});
  }

  uploadPushNotificationData(uploadDetails: PushNotificationData): any {
    return new Promise(async(resolve) => {
      try {
        if (await this.sharedMethods.checkInternetConnectionStatus()) {
          resolve(null);
        }
        const headers = new HttpHeaders({ accept: 'application/json', contentType: 'application/json' });
        const url = `${this.pushNotificationApi}notification-data`;
        this.http.post(url, uploadDetails, { headers })
          .subscribe(async(res) => {
            if (!res) {
              await Preferences.set({
                key: StorageKeys.pushNotificationDataUploaded,
                value: '0'
              });
              resolve(null);
            }
            await Preferences.set({
              key: StorageKeys.pushNotificationDataUploaded,
              value: '1'
            });
            resolve(JSON.parse(JSON.stringify(res)));
          }, async(error) => {
            console.error(error);
            await Preferences.set({
              key: StorageKeys.pushNotificationDataUploaded,
              value: '0'
            });
            console.error(error);
            resolve(null);
          });
      } catch (error) {
        this.globalErrorHandler.handleError(
          error,
          'Error in api.service.ts at uploadPushNotificationData(). Failed to upload push notification data.'
        );
        return null;
      }
    });
  }
}
