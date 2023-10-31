import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { ContractDataService } from '../../data/contract-data.service';

@Component({
  selector: 'app-createdetail',
  templateUrl: './createdetail.page.html',
  styleUrls: ['./createdetail.page.scss'],
})
export class CreatedetailPage extends BaseformPage implements OnInit {
  clauseMapping = {
    'Parties to this contract - Party A': 'contract-clauses-parties-requirement-vessel',
    'Parties to this contract - Party B': 'contract-clauses-parties-requirement-fishers',
    'Article 1 Period of validity': 'contract-clauses-contract-validity',
    'Article 2 Wage benefits and means of payment': 'contract-clauses-wage-benefits',
    'Article 5 Working hours rest and leave': 'contract-clauses-working-hours-rest-and-leave',
    'Article 6 Labor protection and benefits': 'contract-clauses-labor-protection-and-benefits',
    'Attachments': 'contract-clauses-attachments',
  }
  objectTolookup: string;
  contractId: any;

  constructor(
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
    public sharedMethods: SharedmethodsService,
    private contractDataServ: ContractDataService,
    public router: Router
  ) { 
    super(contentService)
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      // we use this to search the content by the key to load the form we need.
      this.objectTolookup = params['clause-type']; 
      // remove whitespace from beginning and end of string
      this.objectTolookup = this.objectTolookup.trim();
      this.contractId = params['contractId'];
      // TODO: Add a check to see if the contract clause exists
      // We should be able to fetch it and display it for the user to edit
      this.pageSetup();
    });
  }

  pageSetup(){
    const pageData = this.contentService.getContentByPropertyName(this.clauseMapping[this.objectTolookup]);
    if (!pageData) {
      this.sharedMethods.showToast(this.commonText?.somethingWentWrong)
      return;
    }
    this.pageTitle = pageData?.pageTitle;
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', []);
      // add change listener to payment frequency
      if (entry.key === 'paymentFrequency') {
        this.group[entry.key].valueChanges.subscribe((value) => {
          this.paymentFrequencyChanged(value);
        });
      }

      // add change listener to payment method
      if (entry.key === 'paymentMethod') {
        this.group[entry.key].valueChanges.subscribe((value) => {
          this.paymentMethodChanged(value);
        });
      }

      // add change listener to attachment page account
      if (entry.key === 'isCrewMemberAccount') {
        this.group[entry.key].valueChanges.subscribe((value) => {
          this.isCrewMemberAccountChanged(value);
        });
      }
    });
    this.pageFormGroup = new FormGroup(this.group);
    this.submitButtonText = this.pageText?.submitButtonText;
  }

  async onSubmit(formData) {
    const userData = await this.sharedMethods.getUserData();
    const now = this.sharedMethods.getCurrentDateTime();
    // We need this information before we append meta data
    formData.content = JSON.stringify(formData);
    formData.app_ref = this.sharedMethods.generateAppRef();
    formData.created_by = userData.id;
    formData.updated_by = userData.id;
    formData.created_at = formData.updated_at = now;
    formData.kind = this.clauseMapping[this.objectTolookup];
    formData.name = this.pageTitle;
    this.contractDataServ.saveContractClause(this.contractId, formData)
    .then((result) => {
     this.sharedMethods.showToast(this.pageText?.contractClauseSaved)
     this.router.navigate(['/contracts/view']);
    })
  }

  paymentFrequencyChanged(value) {
    switch (value.trim()) {
      case 'Every month': {
        this.formQuestions.forEach((entry) => {
          if (entry.key === 'paymentFrequencyDetails')  {
            entry.displayquestion = false;
            return;
          }
        })
        break;
      }
      case 'Other': {
        // show the paymentFrequencyDetails form control
        this.formQuestions.forEach((entry) => {
          if (entry.key === 'paymentFrequencyDetails')  {
            entry.displayquestion = true;
            return;
          }
        })
        break;
      }
      default: {
        break;
      }
    }
  }

  paymentMethodChanged(value) {
    switch (value.trim()) {
      case 'Partly cash & partly bank transfer': {
        // show the cashAmount and bankTransferAmount form controls
        this.formQuestions.forEach((entry) => {
          if (entry.key === 'bankTransferAmount' || entry.key === 'cashAmount')  {
            entry.displayquestion = true;
            // can't return here because I need it to go through all of them to find both
          }
        })
        break;
      }
      default: {
        this.formQuestions.forEach((entry) => {
          if (entry.key === 'bankTransferAmount' || entry.key === 'cashAmount')  {
            entry.displayquestion = false;
            // can't return here because I need it to go through all of them to find both
          }
        })
        break;
      }
    }
  }

  isCrewMemberAccountChanged(value) {
    console.log(this.formQuestions)
    switch (value.trim()) {
      case 'Yes': {
        this.formQuestions.forEach((entry) => {
          console.log(entry.key)
          if (entry.key === 'relativePhoneNumber' || entry.key === 'relativeWhatspp' || entry.key === 'relativeFb' || entry.key === 'relativeOthers')  {
            entry.displayquestion = true;
          }
        });
        break;
      }
      default: {
        this.formQuestions.forEach((entry) => {
          if (entry.key === 'relativePhoneNumber' || entry.key === 'relativeWhatspp' || entry.key === 'relativeFb' || entry.key === 'others')  {
            entry.displayquestion = false;
          }
        });
        break
      }
    }
  }
}
