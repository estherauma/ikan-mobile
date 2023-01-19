import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Network } from '@capacitor/network';
import { Toast } from '@capacitor/toast';
import { Preferences } from '@capacitor/preferences';
import { PluginListenerHandle } from '@capacitor/core';


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
}
