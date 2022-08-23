import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Toast } from '@capacitor/toast';



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

  async showToast(text= 'Something went wrong, please try again!') {
    await Toast.show({
      text
    });
  }
}
