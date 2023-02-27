import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Network } from '@capacitor/network';
import { Toast } from '@capacitor/toast';
import { Preferences } from '@capacitor/preferences';
import { PluginListenerHandle } from '@capacitor/core';
import { StorageKeys } from '../../types/api-types';


@Injectable({
  providedIn: 'root'
})
export class SharedmethodsService {

  networkListener: PluginListenerHandle;

  constructor(
    public loadingCtrl: LoadingController,
  ) { }

  async showLoader(message: string, duration = 5000) {
    const loading = await this.loadingCtrl.create({
      message,
      duration
    });
    await loading.present();
  }

  async hideLoader() {
    await this.loadingCtrl.dismiss();
  }

  async showToast(text = 'Something went wrong, please try again!') {
    await Toast.show({
      text
    });
  }

  async saveDataToStorage(key, data) {
    Preferences.set({
      key,
      value: JSON.stringify(data)
    });
  }

  async readDataFromStorage(key) {
    const { value } = await Preferences.get({ key });
    return JSON.parse(value);
  }

  async addNetworkEventListener(customCallbackFunc: (
    params: { networkListener: PluginListenerHandle; connected: boolean }
  ) => any) {
    this.networkListener = await Network.addListener('networkStatusChange',
      status => customCallbackFunc(
        { networkListener: this.networkListener, connected: status.connected }
      ));
    const currentStatus = await Network.getStatus();
    customCallbackFunc({ networkListener: this.networkListener, connected: currentStatus.connected });
  }

  removeNetworkEventListener(listener: PluginListenerHandle) {
    if (listener) {listener.remove();}
  }

  // Output: 'date' or 'datetime' or 'datetime-no-seconds'
  getCurrentDateTime(output='datetime') {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today. getDate();
    const date = year + '-' + ('0' + month).substr(-2) + '-' + ('0' + day).substr(-2);
    if (output === 'date') {
      return date;
    } else if (output === 'datetime-no-seconds') {
      const currentHours = ('0' + today.getHours()).substr(-2);
      const currentMins = ('0' + today.getMinutes()).substr(-2);
      const time = currentHours + ':' + currentMins;
      const dateTime = date + ' ' + time;
      return dateTime;
    } else {
      const currentHours = ('0' + today.getHours()).substr(-2);
      const currentMins = ('0' + today.getMinutes()).substr(-2);
      const currentSecs = ('0' + today.getSeconds()).substr(-2);
      const time = currentHours + ':' + currentMins + ':' + currentSecs;
      const dateTime = date + ' ' + time;
      return dateTime;
    }
  }

  async getUserData() {
    return this.readDataFromStorage(StorageKeys.userData);
  }

  async generateOptions(entry) {
    // generate key value pairs for select options from array
    if (entry.options) {
      const options = [];
      entry.options.forEach((option) => {
        // TODO: Change to label:value implementation
        options.push(option.name );
      });
      return options;
    }
  }
}
