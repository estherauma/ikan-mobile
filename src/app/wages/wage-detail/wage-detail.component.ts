import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { AppEventNames, PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { FileOpener } from '@capawesome-team/capacitor-file-opener';
import { ModalController } from '@ionic/angular';
import { ViewImageComponent } from 'src/app/mydocuments/view-image/view-image.component';
import { Capacitor } from '@capacitor/core';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';
import { StorageKeys, UserRole } from 'src/app/shared/types/api-types';
import { ContractDataService } from 'src/app/contracts/data/contract-data.service';
import { WagesDataService } from '../data/wages-data.service';
import { SyncService } from 'src/app/shared/services/sync/sync.service';


export type ReceivedCorrectAmountValue = 'yes' | 'no' | 'unsure' | '';

@Component({
  selector: 'app-wage-detail',
  templateUrl: './wage-detail.component.html',
  styleUrls: ['./wage-detail.component.scss'],
  standalone: false,
})
export class WageDetailComponent  implements OnInit {

  commonText: any;
  paymentsPageData: any;
  paymentsCommonText: any;
  wageDetails: any;
  currentLanguage = 'en-us';
  currentUser: any;
  isWorker = false;
  isVesselOwner = false;
  hasInternet = false;
  payslipPdfUrl: string;
  showSpinner = true;
  crewReceivedCorrectAmountValue: ReceivedCorrectAmountValue = '';
  beneficiaryReceivedCorrectAmountValue: ReceivedCorrectAmountValue = '';
  swiper: any;
  showActionQuestion = false;
  whyTheDiscrepancyValues: string[] = [];
  whyTheDiscrepancyOptions = [];
  contractData: any;
  issuePendingCrewReceivedIncorrectAmountMessage = '';
  issuePendingBeneficiaryReceivedIncorrectAmountMessage = '';
  showCrewIssuePendingMessage = false;
  showBeneficiaryIssuePendingMessage = false;

  @ViewChild('pdfViewer') pdfViewer!: PdfJsViewerComponent;
  @ViewChild('wageTrackingSwiper', { static: false }) swiperRef: ElementRef | undefined;

  constructor(
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
    public sharedMethods: SharedmethodsService,
    public analyticsService: AnalyticsService,
    public modalController: ModalController,
    public cdr: ChangeDetectorRef,
    public router: Router,
    public contractDataService: ContractDataService,
    public wageDataService: WagesDataService,
    public syncService: SyncService,
  ) {
    this.activatedRoute.queryParams.subscribe(async(params) => {
      if (params?.wageDetails) {
        this.wageDetails = JSON.parse(params.wageDetails);
      }
    });
  }

  async ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.paymentsPageData = this.contentService.getContentByPropertyName('payments-common-text');
    this.paymentsCommonText = this.sharedMethods.convertAdditionalTextToObj(this.paymentsPageData?.additionalText);
    this.currentLanguage = this.contentService?.currentLanguage;
    this.currentUser = await this.sharedMethods.getUserData();
    this.isWorker = this.currentUser?.role === UserRole.worker;
    this.isVesselOwner = this.currentUser?.role === UserRole.vesselOwner;
    this.hasInternet = await this.sharedMethods.checkInternetConnectionStatus();
    if (this.wageDetails?.payslip && this.wageDetails.payslip.endsWith('.pdf')) {
      const converted = Capacitor.convertFileSrc(this.wageDetails.payslip);
      this.payslipPdfUrl = converted ?? null;
    }
    this.swiper = this.swiperRef?.nativeElement?.swiper;
    this.whyTheDiscrepancyOptions = this.getWhyTheDiscrepancyOptions();
    this.contractData = await this.getContractData();
    this.prefillValues();
    this.getIssuePendingMessages();

    const analyticsEventParams = await this.sharedMethods.getAnalyticsEventParams();
    await this.analyticsService.trackEvent(PageEventNames.viewWageDetails, analyticsEventParams);
  }

  async ionViewWillLeave() {
    await this.updateWageDetails();
  }

  prefillValues() {
    this.crewReceivedCorrectAmountValue = this.wageDetails?.crewReceivedRightAmount ?? '';
    this.beneficiaryReceivedCorrectAmountValue = this.wageDetails?.beneficiaryReceivedRightAmount ?? '';
    this.whyTheDiscrepancyValues = this.wageDetails?.whyTheDiscrepancy?.length ? this.wageDetails?.whyTheDiscrepancy : [];
  }

  getIssuePendingMessages() {
    if (this.crewReceivedCorrectAmountValue && this.crewReceivedCorrectAmountValue !== 'yes') {
      const crewIncorrectMessage = this.paymentsCommonText?.issuePendingCrewReceivedIncorrectAmountMessage || '';
      const crewValueLabel = this.paymentsCommonText?.[this.crewReceivedCorrectAmountValue] || this.crewReceivedCorrectAmountValue;
      const crewReceivedDate = this.wageDetails?.crewReceivedRightAmountDate
        ? this.sharedMethods.formatLocalDate(this.wageDetails.crewReceivedRightAmountDate, this.currentLanguage)
        : this.sharedMethods.formatLocalDate(this.wageDetails?.updatedAt, this.currentLanguage);

      const crewMessage = crewIncorrectMessage
        .replace('{{value}}', `<span class="issue-value">${crewValueLabel.toUpperCase()}</span>`)
        .replace('{{receivedDate}}', `<span class="received-date">${crewReceivedDate}</span>`);
      this.issuePendingCrewReceivedIncorrectAmountMessage = crewMessage;
      this.showCrewIssuePendingMessage = crewMessage ? true : false;
    }
    if (this.beneficiaryReceivedCorrectAmountValue && this.beneficiaryReceivedCorrectAmountValue !== 'yes') {
      const beneficiaryIncorrectMessage = this.paymentsCommonText?.issuePendingBeneficiaryReceivedIncorrectAmountMessage || '';
      const beneficiaryValueLabel = this.paymentsCommonText?.[this.beneficiaryReceivedCorrectAmountValue] || this.beneficiaryReceivedCorrectAmountValue;
      const beneficiaryReceivedDate = this.wageDetails?.beneficiaryReceivedRightAmountDate
        ? this.sharedMethods.formatLocalDate(this.wageDetails.beneficiaryReceivedRightAmountDate, this.currentLanguage)
        : this.sharedMethods.formatLocalDate(this.wageDetails?.updatedAt, this.currentLanguage);

      const beneficiaryMessage = beneficiaryIncorrectMessage
        .replace('{{value}}', `<span class="issue-value">${beneficiaryValueLabel.toUpperCase()}</span>`)
        .replace('{{receivedDate}}', `<span class="received-date">${beneficiaryReceivedDate}</span>`);
      this.issuePendingBeneficiaryReceivedIncorrectAmountMessage = beneficiaryMessage;
      this.showBeneficiaryIssuePendingMessage = beneficiaryMessage ? true : false;
    }
    this.cdr.detectChanges();
  }

  onPdfLoaded(event: any) {
    this.showSpinner = false;
    this.cdr.detectChanges();
  }

  onPdfError(error: any) {
    console.error('PDF failed to load.', error);
    this.showSpinner = false;
    this.payslipPdfUrl = '';
    this.cdr.detectChanges();
  }

  async viewPdf(file) {
    if (this.sharedMethods.currentPlatform === 'web') {
      window.open(file, '_blank');
    } else {
      await FileOpener.openFile({ path: file, mimeType: 'application/pdf' })
        .catch((e) => {
          console.error('Error opening file', e);
          this.sharedMethods.showToast(this.commonText?.errorOpeningFile);
        });
    }
  }

  async viewImage(file) {
    const imageFile = {
      fileUrl: file,
      // fileName: file
    };
    const modal = await this.modalController.create({
      cssClass: 'ikan-modal wage-image-modal',
      component: ViewImageComponent,
      componentProps: {
        imageFile,
        customImageViewClass: 'wage-image-view-wrapper',
      },
    });
    await modal.present();
  }

  onSlideChange(e) {}

  changeCrewReceivedCorrectAmountValue(e) {
    this.crewReceivedCorrectAmountValue = e.detail.value;
  }

  changeBeneficiaryReceivedCorrectAmountValue(e) {
    this.beneficiaryReceivedCorrectAmountValue = e.detail.value;
  }

  async onSubmit() {
    await this.sharedMethods.showWaitLoader(this.commonText?.submittingYourData);
    await this.updateWageDetails();
    const queryParams = {
      contractData: this.contractData ? JSON.stringify(this.contractData) : undefined,
    };
    await this.sharedMethods.dismissLoader();
    this.router.navigate(['wages/wage-tracking-help'], { replaceUrl: true, queryParams });
  }

  async updateWageDetails() {
    const updatedWageDetails = { ...this.wageDetails};
    const now = this.sharedMethods.getCurrentDateTime('date');
    let hasUpdates = false;
    
    if (this.crewReceivedCorrectAmountValue !== this.wageDetails.crewReceivedRightAmount) {
      updatedWageDetails.crewReceivedRightAmount = this.crewReceivedCorrectAmountValue;
      updatedWageDetails.crewReceivedRightAmountDate = now;
      hasUpdates = true;
    }
    if (this.beneficiaryReceivedCorrectAmountValue !== this.wageDetails.beneficiaryReceivedRightAmount) {
      updatedWageDetails.beneficiaryReceivedRightAmount = this.beneficiaryReceivedCorrectAmountValue;
      updatedWageDetails.beneficiaryReceivedRightAmountDate = now;
      hasUpdates = true;
    }
    if (!this.arraysEqual(this.whyTheDiscrepancyValues, this.wageDetails.whyTheDiscrepancy)) {
      const json_value = this.whyTheDiscrepancyValues.length ? JSON.stringify(this.whyTheDiscrepancyValues) : null;
      updatedWageDetails.whyTheDiscrepancy = json_value;
      hasUpdates = true;
    }

    if (hasUpdates) {
      if (updatedWageDetails?.beneficiaryRelationship && updatedWageDetails.beneficiaryRelationship !== 'self' ) {
        if (
          (updatedWageDetails.crewReceivedRightAmount && updatedWageDetails.crewReceivedRightAmount !== 'yes') &&
          (updatedWageDetails.beneficiaryReceivedRightAmount && updatedWageDetails.beneficiaryReceivedRightAmount !== 'yes')
        ) {
          updatedWageDetails.status = 'issue_pending';
        } else if (
          (updatedWageDetails.crewReceivedRightAmount && updatedWageDetails.crewReceivedRightAmount === 'yes') &&
          (updatedWageDetails.beneficiaryReceivedRightAmount && updatedWageDetails.beneficiaryReceivedRightAmount === 'yes')
        ) {
          updatedWageDetails.status = 'received';
        }
      } else {
        if (updatedWageDetails.crewReceivedRightAmount && updatedWageDetails.crewReceivedRightAmount !== 'yes') {
          updatedWageDetails.status = 'issue_pending';
        } else if (updatedWageDetails.crewReceivedRightAmount && updatedWageDetails.crewReceivedRightAmount === 'yes') {
          updatedWageDetails.status = 'received';
        }
      }
      
      updatedWageDetails.updatedAt = new Date().toISOString();
      updatedWageDetails.updatedBy = this.currentUser?.id;
      await this.wageDataService.update(updatedWageDetails, this.wageDetails.id);
      await this.syncService.syncWages();

      this.wageDetails = { ...updatedWageDetails };
      this.getIssuePendingMessages();
      this.cdr.detectChanges();

      const analyticsEventParams = await this.sharedMethods.getAnalyticsEventParams();
      const params = {
        ...analyticsEventParams,
        wageId: this.wageDetails.onlineRef || undefined,
        status: this.wageDetails.status,
      };
      await this.analyticsService.trackEvent(AppEventNames.updatedWageDetails, params);
    }
  }

  arraysEqual(a, b) {
    if (a?.length !== b?.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, i) => val === sortedB[i]);
  }

  goToPreviousSlide() {
    const swiper = this.swiperRef?.nativeElement?.swiper;
    if (!swiper) { return; }
    swiper.slidePrev();
  }

  goToNextSlide() {
    const swiper = this.swiperRef?.nativeElement?.swiper;
    if (!swiper) { return; }
    swiper.slideNext();
  }

  getWhyTheDiscrepancyOptions(){
    return [
      {
        value: 'toRepayMoneyOwedToCaptainOrEmployer',
        label: this.paymentsCommonText?.toRepayMoneyOwedToCaptainOrEmployer,
        selected: false
      },
      {
        value: 'toRepayMoneyOwedToManningAgent',
        label: this.paymentsCommonText?.toRepayMoneyOwedToManningAgent,
        selected: false
      },
      {
        value: 'toPayForUnionMembership',
        label: this.paymentsCommonText?.toPayForUnionMembership,
        selected: false
      },
      {
        value: 'amNotSure',
        label: this.paymentsCommonText?.amNotSure,
        selected: false
      },
    ];
  }

  changeWhyTheDiscrepancyValue(e) {
    const value = e.detail.value;
    const index = this.whyTheDiscrepancyValues.indexOf(value);
    if (index > -1) {
      this.whyTheDiscrepancyValues.splice(index, 1);
    } else {
      this.whyTheDiscrepancyValues.push(value);
    }
  }

  isWhyTheDiscrepancyOptionSelected(value: string) {
    return this.whyTheDiscrepancyValues.indexOf(value) > -1;
  }

  async goToDiscrepancySection() {
    this.showActionQuestion = true;
    this.cdr.detectChanges();
    
    const analyticsEventParams = await this.sharedMethods.getAnalyticsEventParams();
    await this.analyticsService.trackEvent(AppEventNames.viewWageDiscrepancySection, analyticsEventParams);
  }

  goToWageTrackingHelp() {
    const queryParams = {
      contractData: this.contractData ? JSON.stringify(this.contractData) : undefined,
    };
    this.router.navigate(['wages/wage-tracking-help'], { replaceUrl: true, queryParams });
  }

  // TODO: Refactor when worker has multiple contracts
  async getContractData() {
    if (!this.isWorker) {
      return null;
    }

    const userContracts = await this.sharedMethods.readDataFromStorage(StorageKeys.currentUserOnlineContractsAppRefs);
    if (userContracts?.length) {
      const contract = this.contractDataService.contracts.find((c) => c.appRef === userContracts[0]);
      if (contract && contract?.id) {
        const contractData = {};
        // TODO: check if we are displaying parties or clause 6 to display employer details
        // const partyAClause = await this.contractDataService.retrieveClauseByFieldByContractId(
        //   'kind',
        //   'contract-clauses-parties-requirement-vessel',
        //   contract.id
        // );
        // if (partyAClause) {
        //   const partyAClauseData = JSON.parse(partyAClause.content);
        //   contractData['partyA'] = partyAClause;
        // }
        
        const article6Clause = await this.contractDataService.retrieveClauseByFieldByContractId(
          'kind',
          'contract-clauses-labor-protection-and-benefits',
          contract.id
        );
        if (article6Clause) {
          const article6ClauseData = JSON.parse(article6Clause.content);
          const details = {
            ...article6Clause,
            contractId: contract.id,
            contractOnlineRef: contract.onlineRef,
            // partyB: '',
          };
          contractData['detailsClause'] = article6Clause;
        }

        const wagesClause = await this.contractDataService.retrieveClauseByFieldByContractId(
          'kind',
          'contract-clauses-wage-benefits',
          contract.id
        );
        if (wagesClause) {
          const wagesClauseData = JSON.parse(wagesClause.content);
          if (wagesClauseData?.monthlyWage) {
            contractData['contractAmount'] = wagesClauseData.monthlyWage;
          }
        }

        if (Object.keys(contractData).length > 0) {
          return contractData;
        }
      }
    }
    return null;
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'action_required':
        return this.isVesselOwner ? this.paymentsCommonText?.pending : this.paymentsCommonText?.actionRequired;
      case 'issue_pending':
        return this.isVesselOwner ? this.paymentsCommonText?.pending : this.paymentsCommonText?.issuePending;
      case 'received':
        return this.isVesselOwner ? this.paymentsCommonText?.confirmed : this.paymentsCommonText?.received;
      default:
        return status;
    }
  }

}
