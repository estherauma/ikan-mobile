import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from '../../services/content/content.service';
import { SharedmethodsService } from '../../services/sharedmethods/sharedmethods.service';

@Component({
    selector: 'app-vesselownercard',
    templateUrl: './vesselownercard.component.html',
    styleUrls: ['./vesselownercard.component.scss'],
    standalone: false
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
    public sharedMethods: SharedmethodsService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService.commonText;
    this.vesselStatus = this.contentService.getFormOptionTranslation('vessels-createsteptwo', 'status', this.vessel.status);
  }

  viewDetails(vessel) {
    this.router.navigate(['vessels/view', {vessel: JSON.stringify(vessel)}]);
  }
}
