import { Component, Input, OnInit } from '@angular/core';
import { ContentService } from '../../services/content/content.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() pageTitle: string;
  @Input() isBackButton = false;
  @Input() isMenuButton = true;
  @Input() backBtnText = '';
  @Input() isLightBlueBg = false;

  backText = '';

  constructor(
    public contentService: ContentService
  ) { }

  ngOnInit() {
    this.backText = this.contentService.commonText?.back;
  }

}
