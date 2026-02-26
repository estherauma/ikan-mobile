import { Component, AfterViewInit } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { ModalController } from '@ionic/angular';
import NutrientViewer from "@nutrient-sdk/viewer";
import { GlobalErrorHandlerService } from 'src/app/shared/services/error-handler/global-error-handler.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { UploadService } from 'src/app/shared/services/upload/upload.service';


@Component({
  selector: 'app-sign-payslip',
  templateUrl: './sign-payslip.component.html',
  styleUrls: ['./sign-payslip.component.scss'],
  standalone: false,
})
export class SignPayslipComponent  implements AfterViewInit {

  file: any;
  fileUrl: string;
  commonText: any;
  paymentsCommonText: any;
  instance: any;
  isSigned = false;
  loading = false;
  
  constructor(
    private modalController: ModalController,
  ) { }

  async close() {
    await this.modalController.dismiss();
  }

  async ngAfterViewInit() {
    this.instance = await NutrientViewer.load({
      document: this.file,
      container: '#psPdfContainer',
      useCDN: true,
      // licenseKey: ADD_LICENSE_KEY_HERE, // Optional license key.

      toolbarItems: [ { type: "signature" } ],
      annotationToolbarItems: (annotation, { defaultAnnotationToolbarItems }) => {
        return [{ type: 'delete', }, { type: 'stroke-color' }];
      },
    });
  }
}
