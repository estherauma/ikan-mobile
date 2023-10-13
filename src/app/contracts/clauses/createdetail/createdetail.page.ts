import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-createdetail',
  templateUrl: './createdetail.page.html',
  styleUrls: ['./createdetail.page.scss'],
})
export class CreatedetailPage extends BaseformPage implements OnInit {
  clauseMapping = {
    'Parties to this contract': ''
  }
  objectTolookup: string;

  constructor(
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
  ) { 
    super(contentService)
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      console.log(params);
      
    });
  }

  pageSetup(){

  }

}
