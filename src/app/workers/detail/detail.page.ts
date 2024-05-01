import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WorkersDataService } from '../data/workers-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioService } from 'src/app/shared/services/audio/audio.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage extends BaseformPage implements OnInit {
  iconBase = 'assets/icon';
  navItems = [
    {
      name: this.commonText?.info,
      url: 'workers/info',
      id: 'workers-info',
      activeIcon:`${this.iconBase}/profile_info_blue.svg` ,
      inActiveIcon:`${this.iconBase}/profile_info_white.svg`
    },
    {
      name: this.commonText?.payment,
      url: 'workers/payment',
      id: 'workers-payment',
      activeIcon:`${this.iconBase}/single_payment_blue.svg` ,
      inActiveIcon: `${this.iconBase}/single_payment_white.svg`
    },
    {
      name: this.commonText?.placement,
      url: 'workers/placement',
      id: 'workers-placement',
      activeIcon:`${this.iconBase}/placements_blue.svg` ,
      inActiveIcon:`${this.iconBase}/placements_white.svg`
    },
    {
      name: this.commonText?.documents,
      url: 'workers/documents',
      id: 'workers-documents',
      activeIcon:`${this.iconBase}/documents_blue.svg` ,
      inActiveIcon:`${this.iconBase}/documents_white.svg`
    },
    {
      name: this.commonText?.training,
      url: 'workers/training',
      id: 'workers-training',
      activeIcon:`${this.iconBase}/training_blue.svg` ,
      inActiveIcon:`${this.iconBase}/training_white.svg`
    }
  ];
  activeNavItem = this.navItems[0];
  isResendInviteBtn = this.activeNavItem.id === 'workers-info';
  // TODO: after saving & fetching audioRecordings from the db
  // map through audioRecordings to generate file from filepath
  audioRecordings: any = [];
  workerId: string;
  workerInfo: any;
  workerStatus: string;
  nameInputs: any;

  wo = {
    name: 'Work order 2',
    internalRef: 'IJSWERWXDWER',
    dateOpened: '2022-10-15',
    status: 'Close',
    appRef: 'XXX-XXX-XXX',
  };

  constructor(
    public contentService: ContentService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public workersDataService: WorkersDataService,
    public sanitizer: DomSanitizer,
    public audioService: AudioService,
    public sharedMethods: SharedmethodsService,
  ) {
    super(contentService);
    const pageData = this.contentService.getContentByPropertyName('createplacementinfo');
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      const validators = this.sharedMethods.getFormValidators(entry);
      this.group[entry.key] = new FormControl('', validators);
    });
    this.pageFormGroup = new FormGroup(this.group);

    // get name inputs, for editing form
    const nameInputsData = this.contentService.getContentByPropertyName('createworkerprofile');
    this.nameInputs = nameInputsData?.formQuestions;
  }

  async ngOnInit() {
    this.commonText = this.contentService?.commonText;
    await this.getWorkerInfo();
    this.workerStatus = this.sharedMethods.generateWorkerStatus(this.commonText, this.workerInfo?.isActive, this.workerInfo?.isVerified);
  }

  async getWorkerInfo() {
    this.activatedRoute.queryParams.subscribe(async(queryParams: Params) => {
      if (queryParams && Object.keys(queryParams).length > 0) {
        // TODO: querying workerInfo from db vs from params
        if (queryParams?.previousUrl) {
          this.workerId = queryParams?.workerId;
          const worker = await this.workersDataService.retrieveOne(Number(this.workerId));
          this.workerInfo = worker;
          const file = await this.audioService.retrieveFile(queryParams?.filepath);

          this.audioRecordings.unshift({
            ...queryParams,
            file: this.sanitizer.bypassSecurityTrustResourceUrl(file),
          });
        } else {

          this.workerInfo = queryParams;
        }
      }
    });
  }

  onClickedMenu(menuItem) {
    this.activeNavItem = menuItem;
    if (menuItem.id === 1) {
      this.isResendInviteBtn = true;
    } else {
      this.isResendInviteBtn = false;
    }
  }

  onSubmit(data) {}

  onEdit(workerInfo) {
    const data = JSON.stringify({...workerInfo, isEditing: true});
    const questions = JSON.stringify(this.nameInputs);
    this.router.navigate(['/workers/createdetail', {data, questions}]);
  }

  onRecord() {
    this.router.navigate(
      [
        '/workers/recordnote',
        {
          previousUrl: this.router.url.split('?')[0],
          workerId: this.workerInfo?.id
        } 
      ],
      { replaceUrl: true }
    );
  }

  onDelete(fileToDelete) {
    const newAudioRecordings = this.audioRecordings.filter((el) => el.uniqueName !== fileToDelete);
    this.audioRecordings = newAudioRecordings;
  }
}
