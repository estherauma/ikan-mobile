import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {

  @Input()
  filterDataSet: any[] = [];

  @Input()
  options: any[] = [];

  @Input()
  filterProperty = '';

  @Output()
  filterResult: EventEmitter<any> = new EventEmitter<any>();

  @Input() type: 'deep-blue-filter' | 'light-blue-filter' | 'deep-blue-90' | '' = '';
  @Input() customCss='';

  constructor() { }

  ngOnInit() {
    if (this.type === 'deep-blue-filter') {
      this.customCss = 'deep-blue';
    } else if (this.type === 'light-blue-filter') {
      this.customCss = 'light-blue';
    } else if(this.type === 'deep-blue-90'){
      this.customCss = 'deep_blue_90';
    }else {
      this.customCss = 'default';
    }
  }

  onChange(eventData) {
    const selectedValue = eventData.detail.value.trim();
    const filtered = this.filterDataSet.filter(data => {
      const currentProperty = this.filterProperty ? this.filterProperty : 'name';
      return data[currentProperty].toString().toLowerCase() === selectedValue.toLowerCase();
    });

    this.filterResult.emit(filtered);
  }
}
