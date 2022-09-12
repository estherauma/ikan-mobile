import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Toast } from '@capacitor/toast';
import { Preferences } from '@capacitor/preferences';



@Injectable({
  providedIn: 'root'
})
export class SharedmethodsService {

  constructor(
    public loadingCtrl: LoadingController,
  ) { }

  async showLoader(message: string, duration= 5000) {
    const loading = await this.loadingCtrl.create({
      message,
      duration
    });
    await loading.present();
  }

  async hideLoader() {
    await this.loadingCtrl.dismiss();
  }

  async showToast(text= 'Something went wrong, please try again!') {
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
}
