import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContentService } from '../../services/content/content.service';

export type GroupedOption = {
  groupLabel: string;
  groupOptions: any[];
  filterProperty: string;
};
export type SelectValue = {
  value: string;
  filterProperty: string;
};


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  commonText: any;
  noData: boolean = false;

  @Input() filterDataSet: any[] = [];
  @Input() options: any[] = [];
  @Input() filterProperty: string = '';
  @Input() type: 'deep-blue-filter' | 'light-blue-filter' | 'deep-blue-90' | '' = '';
  @Input() customCss='';
  @Input() filterLabel = '';
  @Input() groupedOptions: Array<GroupedOption> = [];
  @Input() page: string = '';

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
    const selectedValues: SelectValue[] = eventData.detail.value;
    if (!selectedValues?.length) {
      this.noData = false;
      this.filterResult.emit(this.filterDataSet);
      return;
    }

    const filtered = this.filterDataSet.filter(dataItem => {
      return selectedValues.every(selectResult => {
        if (this.page === 'V0-workers' && selectResult.filterProperty === 'isActive') {
          const comparator = !dataItem?.isVerified ? 'pending' : dataItem?.isActive? 'active' :'inactive';
          return comparator === selectResult.value;
        };
        return dataItem[selectResult.filterProperty] === selectResult.value.toString();
      });
    });

    this.noData = !filtered.length? true: false;

    this.filterResult.emit(filtered);
  }
}
