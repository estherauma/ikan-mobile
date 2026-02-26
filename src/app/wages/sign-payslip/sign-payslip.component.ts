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
    private uploadService: UploadService,
    private globalErrorHandler: GlobalErrorHandlerService,
    private sharedMethods: SharedmethodsService,
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

    // Listen for signature events
    this.instance.addEventListener('annotations.change', async() => {
      this.isSigned = await this.checkIfFileIsSigned();
    });
  }

  async checkIfFileIsSigned(): Promise<boolean> {
    let hasSignature = false;
    // the getAnnotations method works for a specified page index (0 based).
    // So we need to loop through all pages to check for signature annotations.
    for (let pageIndex = 0; pageIndex < this.instance.totalPageCount; pageIndex++) {
      const annotations = await this.instance.getAnnotations(pageIndex);
      if (annotations.some((annotation) => annotation.isSignature)) {
        hasSignature = true;
        break;
      }
    }
    return hasSignature;
  }
}
