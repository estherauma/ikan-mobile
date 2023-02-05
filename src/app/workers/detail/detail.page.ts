import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { StatusType } from 'src/app/shared/components/pageprofilecontainer/pageprofilecontainer.component';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage extends BaseformPage implements OnInit {
  iconBase = 'assets/icon';
  navItems = [
    {
      name: 'Info',
      url: 'workers/info',
      id: 1,
      activeIcon:`${this.iconBase}/profile_info_blue.svg` ,
      inActiveIcon:`${this.iconBase}/profile_info_white.svg`
    },
    {
      name: 'Payment',
      url: 'workers/payment',
      id: 2,
      activeIcon:`${this.iconBase}/single_payment_blue.svg` ,
      inActiveIcon: `${this.iconBase}/single_payment_white.svg`
    },
    {
      name: 'Placement',
      url: 'workers/placement',
      id: 3,
      activeIcon:`${this.iconBase}/placements_blue.svg` ,
      inActiveIcon:`${this.iconBase}/placements_white.svg`
    },
    {
      name: 'Documents',
      url: 'workers/documents',
      id: 4, activeIcon:`${this.iconBase}/documents_blue.svg` ,
      inActiveIcon:`${this.iconBase}/documents_white.svg`
    },
    {
      name: 'Training',
      url: 'workers/training',
      id: 5,
      activeIcon:`${this.iconBase}/training_blue.svg` ,
      inActiveIcon:`${this.iconBase}/training_white.svg`
    }
  ];
  activeNavItem = this.navItems[0];
  isResendInviteBtn = this.activeNavItem.id === 1;

  workerInfo = {
    email:'okumujustine01@gmail.com',
    phone:'+256781459239',
    building: 'Building Name',
    street: '123 Name of Road',
    town: 'Name of Town',
    county: 'County',
    zipCode: 'Zip Code',
    country: 'Country',
    name: 'Budi Surname',
    status: 'pending' as StatusType
  };

  submitButtonText = 'submit';
  wo = {
    name: 'Work order 2',
    internalRef: 'IJSWERWXDWER',
    dateOpened: '2022-10-15',
    status: 'Close',
    appRef: 'XXX-XXX-XXX',
  };

  saveText = '';
  editText = '';
  sendReminderText = '';
  constructor(
    public contentService: ContentService,
    public router: Router,
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

  ngOnInit() {
    this.editText = this.contentService.commonText?.edit;
    this.saveText = this.contentService.commonText?.save;
    this.sendReminderText = this.contentService.commonText?.sendreminder;
  }

  getParams() {}

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
    console.log('go to edit');
    this.router.navigate(['/workers/createdetail']);
  }

}
