import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  imageUrl = '';
  closeText = '';
  backUrl = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    public contentService: ContentService,
    public router: Router
  ) { }

  ngOnInit() {
    this.closeText = this.contentService.commonText?.close;

    this.activatedRoute.queryParams.subscribe(params => {
      this.imageUrl = params?.docLink;
      this.backUrl = params?.backUrl;
    });
  }

  onClose() {
    this.router.navigate([this.backUrl]);
  }
}
