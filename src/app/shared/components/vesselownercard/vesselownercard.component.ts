import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from '../../services/content/content.service';

@Component({
  selector: 'app-vesselownercard',
  templateUrl: './vesselownercard.component.html',
  styleUrls: ['./vesselownercard.component.scss'],
})
export class VesselownercardComponent implements OnInit {
  commonText;
  vesselStatus: string;

  @Input() vessel;
  @Input() isNoBorderShadow = false;
  @Input() background: 'transparent' | string = '';
  
  constructor(
    public router: Router,
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService.commonText;
     this.vesselStatus = this.contentService.getStatusTranslation('vessels-createsteptwo', this.vessel.status);
  }

  viewDetails(vessel) {
    this.router.navigate(['vessels/view', vessel]);
  }
}
