import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { File } from '@capawesome/capacitor-file-picker';
import { ModalController } from '@ionic/angular';
import { UploadService } from 'src/app/services/upload/upload.service';
import { DemandLetter } from '../home/home.page';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  pageTitle = 'View Demand Letter';
  demandLetter: DemandLetter;
  ifReviewDemandLetter = false;
  cooperationAgreementFile: File | null = null;

  workOrders = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public router: Router,
    public chooser: UploadService
  ) { }

  ngOnInit() {
    const demandLetter = JSON.parse(this.activatedRoute.snapshot.paramMap.get('demandLetter'));
    this.pageTitle = demandLetter.name;
    this.demandLetter = demandLetter;

    if(demandLetter.workOrders){
      this.workOrders = demandLetter.workOrders;
    }
  }

  async addWorkOrder() {
    this.router.navigate(['workorders/select', { demandLetter: JSON.stringify(this.demandLetter) }]);
  }

  onReviewDemandLetter() {
    this.ifReviewDemandLetter = true;
  }

  onSendDemandLetter() {
    this.router.navigate(['demandletters/send', this.demandLetter]);
  }

  async uploadCopAgreement() {
    const chosencooperationAgreement = await this.chooser.choseFile();
    this.cooperationAgreementFile = chosencooperationAgreement;
  }

  showReviewButton() {
    return !this.ifReviewDemandLetter && this.workOrders.length && this.cooperationAgreementFile;
  }

}
