import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { StatusType } from 'src/app/shared/components/pageprofilecontainer/pageprofilecontainer.component';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WorkersDataService } from '../data/workers-data.service';
import { DomSanitizer } from '@angular/platform-browser';

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
      id: 1,
      activeIcon:`${this.iconBase}/profile_info_blue.svg` ,
      inActiveIcon:`${this.iconBase}/profile_info_white.svg`
    },
    {
      name: this.commonText?.payment,
      url: 'workers/payment',
      id: 2,
      activeIcon:`${this.iconBase}/single_payment_blue.svg` ,
      inActiveIcon: `${this.iconBase}/single_payment_white.svg`
    },
    {
      name: this.commonText?.placement,
      url: 'workers/placement',
      id: 3,
      activeIcon:`${this.iconBase}/placements_blue.svg` ,
      inActiveIcon:`${this.iconBase}/placements_white.svg`
    },
    {
      name: this.commonText?.documents,
      url: 'workers/documents',
      id: 4, activeIcon:`${this.iconBase}/documents_blue.svg` ,
      inActiveIcon:`${this.iconBase}/documents_white.svg`
    },
    {
      name: this.commonText?.training,
      url: 'workers/training',
      id: 5,
      activeIcon:`${this.iconBase}/training_blue.svg` ,
      inActiveIcon:`${this.iconBase}/training_white.svg`
    }
  ];
  activeNavItem = this.navItems[0];
  isResendInviteBtn = this.activeNavItem.id === 1;
  audioRecordings: any = [];
  workerId: string;
  workerInfo: any;

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
  ) {
    super(contentService);
    const pageData = this.contentService.getContentByPropertyName('createplacementinfo');
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  async ngOnInit() {
    this.commonText = this.contentService?.commonText;
    await this.getWorkerInfo();
  }

  async getWorkerInfo() {
    this.activatedRoute.queryParams.subscribe(async(queryParams: Params) => {
      console.log('his.activatedRoute.params....qqqqqq....',queryParams)
      if (queryParams && Object.keys(queryParams).length > 0) {
        // TODO: querying workerInfo from db vs from params
        if (queryParams?.previousUrl) {

          this.workerId = queryParams?.workerId;
          const worker = await this.workersDataService.retrieveOne(Number(this.workerId));
          this.workerInfo = worker;
          console.log('rrrrrr....workerInfo', this.workerInfo)

          this.audioRecordings.unshift({
            ...queryParams,
            file: this.sanitizer.bypassSecurityTrustResourceUrl(queryParams.file)
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

  onEdit() {
    this.router.navigate(['/workers/createdetail']);
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
