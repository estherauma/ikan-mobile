import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  agent: any;


  constructor(
    public activatedRoute: ActivatedRoute,
    public sharedMethods: SharedmethodsService
  ) { }

  async ngOnInit() {
    await this.getParams();
  }

  getParams() {
    this.activatedRoute.params.subscribe((params) => {
      this.agent = params;
    });
  }

  uploadContract() {}
}
