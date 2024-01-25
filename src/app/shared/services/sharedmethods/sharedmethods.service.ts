import { Injectable } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { Network } from '@capacitor/network';
import { Toast } from '@capacitor/toast';
import { Preferences } from '@capacitor/preferences';
import { PluginListenerHandle } from '@capacitor/core';
import { StorageKeys } from '../../types/api-types';
import { Device } from '@capacitor/device';
import {v4 as uuidv4} from 'uuid';
import { UserRole } from '../../types/api-types';


@Injectable({
  providedIn: 'root'
})
export class SharedmethodsService {
  public deviceUuid: any;
  networkListener: PluginListenerHandle;
  isIos = false;

  constructor(
    public loadingCtrl: LoadingController,
    public platform: Platform,
  ) {
    if (this.platform.is('ios')) {
      this.isIos = true;
    }
  }

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

  async showToast(text = 'Hooray!', duration: 'short' | 'long' = 'short') {
    await Toast.show({
      text,
      duration
    });
  }

  async saveDataToStorage(key, data) {
    Preferences.set({
      key,
      value: typeof data === 'string' ? data : JSON.stringify(data)
    });
  }

  async readDataFromStorage(key) {
    if (!key) { return null; }
    const { value } = await Preferences.get({ key });
    if (typeof value === 'string' && value.length > 0) {
      return this.isValidJSON(value) ? JSON.parse(value) : value;
    } else {
      return value ? value : null;
    }
  }

  isValidJSON(str: string) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
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

  async checkInternetConnectionStatus() {
    let internetConnectionStatus = false;
    await Network.getStatus().then(state => {
      internetConnectionStatus = state.connected;
    });
    return internetConnectionStatus;
  }

  async getDeviceInfo() {
    return await Device.getInfo() || null;
  }

  async getDeviceUuid() {
    const deviceInfo = await Device.getId();
    this.deviceUuid = deviceInfo?.identifier;
  }

  async isAndroidVersionAbove(minVersion: number) {
    try {
      if (!minVersion) {
        return false;
      }
      const deviceInfo = await this.getDeviceInfo();
      if (deviceInfo?.operatingSystem !== 'android' || !deviceInfo?.osVersion) {
        return false;
      }
      const osVersion = deviceInfo?.osVersion.split('.');
      if (!osVersion || !osVersion?.length) {
        return false;
      }
      const major = osVersion[0];
      if (major && parseInt(major, 10) > minVersion) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // TODO: refactor fn
  getChapterBackground(id, type ='chapter') {
    if (id === '1') {
      if (type === 'subchapter') return 'assets/imgs/bg-pre-departure-tinted.svg'
      return 'assets/imgs/bg-pre-departure.svg';
    } else if (id === '2') {
      if (type === 'subchapter') return 'assets/imgs/bg-life-on-board-tinted.svg'
      return 'assets/imgs/bg-life-on-board.svg';
    } else if (id === '3') {
      if (type === 'subchapter') return 'assets/imgs/bg-your-work-tinted.svg'
      return 'assets/imgs/bg-your-work.svg';
    }
    return '';
  }

  // Change page additional text array of objects into an object
  convertAdditionalTextToObj(additionalText) {
    if (additionalText != null || additionalText !== undefined) {
      const textDataObject = {};
      for (const item of additionalText) {
        textDataObject[item.label] = item.value;
      }
      return textDataObject;
    } else  {
      return { };
    }
  }


  getStatusClass(status: string) {
    return status?.toLowerCase().includes('pending') ? 'pending' :
      status?.toLowerCase().includes('inactive') ? 'inactive' :
      status?.toLowerCase().includes('active') ? 'active' :
      status?.toLowerCase().includes('engaged') ? 'engaged' :
      '';
  }

  generateAppRef() {
    return uuidv4();
  }

  getProfileUrlBasedOnRole(role: string) {
    switch (role) {
      case UserRole.worker:
        return '/worker/profile';
      default:
        return '';
    }
  }
}
