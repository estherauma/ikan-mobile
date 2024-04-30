import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContentService } from '../../services/content/content.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  commonText: any;

  @Input() filterDataSet: any[] = [];
  @Input() options: any[] = [];
  @Input() filterProperty = '';
  @Input() type: 'deep-blue-filter' | 'light-blue-filter' | 'deep-blue-90' | '' = '';
  @Input() customCss='';
  @Input() filterLabel = '';

  @Output() filterResult: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.commonText =this.contentService?.commonText;
    if (this.type === 'deep-blue-filter') {
      this.customCss = 'deep-blue';
    } else if (this.type === 'light-blue-filter') {
      this.customCss = 'light-blue';
    } else if (this.type === 'deep-blue-90') {
      this.customCss = 'deep_blue_90';
    } else {
      this.customCss = 'default';
    }
  }

  onChange(eventData) {
    const selectedValues = eventData.detail.value;
    if (!selectedValues?.length) {
      this.filterResult.emit(this.filterDataSet);
      return;
    }

    const filtered = this.filterDataSet.filter(data => {
      const currentProperty = this.filterProperty ? this.filterProperty : 'name';
      return selectedValues.includes(data[currentProperty]);
    });

    this.filterResult.emit(filtered);
  }
}
