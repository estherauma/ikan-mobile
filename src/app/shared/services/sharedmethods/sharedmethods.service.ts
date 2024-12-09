import { Injectable } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { Network } from '@capacitor/network';
import { Toast } from '@capacitor/toast';
import { Preferences } from '@capacitor/preferences';
import { PluginListenerHandle } from '@capacitor/core';
import { StorageKeys, analyticsEventsData } from '../../types/api-types';
import { Device } from '@capacitor/device';
import {v4 as uuidv4} from 'uuid';
import { UserRole } from '../../types/api-types';
import { Validators } from '@angular/forms';
import { Camera, CameraSource } from '@capacitor/camera';


@Injectable({
  providedIn: 'root'
})
export class SharedmethodsService {
  public deviceUuid: any;
  networkListener: PluginListenerHandle;
  isIos = false;
  isAndroid = false;
  public analyticsEventParams: analyticsEventsData;
  currentPlatform: string = '';
  loader: any;

  constructor(
    public loadingCtrl: LoadingController,
    public platform: Platform,
  ) {
    if (this.platform.is('ios')) {
      this.isIos = true;
      this.isAndroid = false;
    } else {
      this.isIos = false;
      this.isAndroid = true;
    }
    this.currentPlatform = this.getCurrentPlatform();
    this.setAnalyticsEventParams();
  }

  async showWaitLoader(message: string = 'Please wait') {
    this.loader = await this.loadingCtrl.create({
      message,
      spinner: 'bubbles',
    });
    await this.loader.present();
  }

  async dismissLoader() {
    this.loader.dismiss();
  }

  async showLoader(message: string, duration = 5000) {
    const loading = await this.loadingCtrl.create({
      message,
      duration
    });
    await loading.present()
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

  async clearPreferences(keysToExclude: string[] = [StorageKeys.appContent]) {
    try {
      const { keys } = await Preferences.keys();
      const keysToDelete = keys.filter((key) => !keysToExclude.includes(key));

      for (const key of keysToDelete) {
        await Preferences.remove({ key });
      }
    } catch (error) {
      console.error('Error clearing preferences', error);
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

  generateWorkerStatus(commonText, isActive=false, isVerified=false) {
    let status = 'active';
    if (!isVerified) {
      status = 'pending';
    } else if (!isActive) {
      status = 'inactive';
    }
  
    return commonText?.[status];
  }

  generateAppRef() {
    return uuidv4();
  }

  getProfileUrlBasedOnRole(role: string) {
    switch (role) {
      case UserRole.worker:
        return '/worker/profile';
      default:
        return 'profile';
    }
  }

  /**
   * Check if a date is within a time frame
   * @param dateToCheck The date to check
   * @param timeFrameInWeeks The timeframe in weeks
   * @param startDate The date to start the time frame from
   * @returns True if the date is within the time frame, false otherwise
   * @example
   * isDateWithinTimeFrame(new Date('2021-01-01'), 1, new Date('2021-01-01')) // true
    */
  isDateWithinTimeFrame(dateToCheck: Date, timeFrameInWeeks = 0, startDate = new Date()) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (timeFrameInWeeks * 7));

    return dateToCheck >= startDate && dateToCheck <= endDate;
  }

  getFormValidators(entry) {
    const validators = [];
    if (entry.isRequired) {
      validators.push(Validators.required);
    }
    if (entry.questionType === 'email' || entry.questionType === 'emailAddress') {
      validators.push(Validators.email);
    }
    return validators;
  }

  convertCamelToSnakeCase(text: string) {
    return text.replace(/(?:^|\.?)([A-Z0-9])/g,  (x, y) => {
      return "_" + y.toLowerCase();
    }).replace(/^_/, "");
  }

  async setAnalyticsEventParams() {
    const user = await this.readDataFromStorage(StorageKeys.userData);
    const language = await this.readDataFromStorage(StorageKeys.currentLanguage);
    let params:analyticsEventsData = {
      appLanguage: language,
      role: user?.role,
      isIos: this.isIos,
      isAndroid: this.isAndroid,
      accountId: user?.id?.slice(-8) || null,
      deviceId: this.deviceUuid?.slice(-8) || null
    };
    this.analyticsEventParams = params;
  }

  getCurrentPlatform() {
    if (this.platform.is('desktop') || this.platform.is('mobileweb') ) {
      return 'web';
    } else if (this.platform.is('ios')) {
      return 'ios';
    } else if (this.platform.is('android')) {
      return 'android';
    }
  }

  async getSelectImageOrPdfAlert(commonText, alertController, uploadService, docsCommonText) {
    const alert = await alertController.create({
      cssClass: 'add-file-alert',
      buttons: [
        {
          text: docsCommonText?.takeAPicture,
          cssClass: 'add-img-btn',
          handler: async() => {
            const fileData = await uploadService.uploadPicture(CameraSource.Camera);
            return { fileData };
          }
        },
        {
          text: docsCommonText?.selectImagesFromPhotos,
          cssClass: 'add-img-btn',
          handler: async() => {
            const fileData = await uploadService.uploadPicture(CameraSource.Photos);
            return { fileData };
          }
        },
        {
          text: docsCommonText?.uploadPdfFile,
          cssClass: 'add-doc-btn',
          handler: async() => {
            const fileData = await uploadService.chooseFile();
            return { fileData };
          }
        },
        {
          text: commonText?.cancel,
          role: 'cancel',
          cssClass: 'cancel-btn',
        }
      ]
    });
    return alert;
  }

  async getFileNameAlert(commonText, alertController, docsCommonText) {
    const alert = await alertController.create({
      cssClass: 'add-file-name-alert',
      backdropDismiss: false,
      header: docsCommonText?.enterFileName,
      message: docsCommonText?.fileNameSubText,
      inputs: [
        {
          name: 'fileName',
          type: 'text',
          placeholder: docsCommonText?.fileNamePlaceholder,
          value: '',
        }
      ],
      buttons: [
        {
          text: commonText?.cancel,
          role: 'cancel',
          cssClass: 'cancel-btn',
        },
        {
          text: commonText?.save,
          cssClass: 'save-btn',
          handler: (data) => {
            return { fileName: data.fileName};
          }
        }
      ],
      
    });
    return alert;
  }

  async addDocument(
    commonText,
    alertController,
    uploadService,
    documentsDataService,
    docsCommonText,
    isEssential: boolean = false,
  ) {
    let newDoc = null;
    const alert = await this.getSelectImageOrPdfAlert(commonText, alertController, uploadService, docsCommonText);
    await alert.present();
    await alert.onDidDismiss().then(async(data) => {
      if ( data.role !== 'cancel' && data?.data?.fileData && Object.keys(data?.data?.fileData).length) {
        const addFileNameAlert = await this.getFileNameAlert(commonText, alertController, docsCommonText);
        await addFileNameAlert.present().then(() => {
          const firstInput: any = document.querySelector('ion-alert input');
          firstInput.focus();
          return;
        });
        await addFileNameAlert.onDidDismiss().then(async(fileNameData) => {
          const { fileData } = data?.data;
          let fileName = fileData.fileName;
          if (fileNameData.role !== 'cancel' && fileNameData?.data.fileName) {
            fileName = fileNameData?.data.fileName;
          }

          const userData = await this.getUserData();
          const now = this.getCurrentDateTime();
          const appRef = this.generateAppRef();
          const dataToSave = {
            appRef,
            userId: userData.id,
            fileName,
            fileUrl: fileData.docType === 'image' ? fileData.webPath : fileData.uriPath,
            fileSize: fileData.fileSize,
            docType: fileData.docType,
            isEssential,
            createdAt: now,
            updatedAt: now,
            createdBy: userData.id,
            updatedBy: userData.id,
          };

          const insertId = await documentsDataService.create(dataToSave);
          if (insertId) {
            const insertedDoc = {
              id: insertId,
              ...dataToSave,
            };
            newDoc = insertedDoc;
          } else {
            if (isEssential) {
              this.showToast(docsCommonText?.essentialDocSaveFailure);
            } else {
              this.showToast(docsCommonText?.docSaveFailure);
            }
          }
        });
      }
    });
    return newDoc;
  }

  checkIf2ObjectsAreEqual(object1, object2) {
    if (!object1 || !object2) return false;
    
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }

    return true;
  }

  generatePdfFileName(pdfName) {
    let name = pdfName?.split('.pdf')[0];
    name = name?.replace(/\s+/g, '--'); // remove spaces from name
    return name + '.pdf';
  }
}
