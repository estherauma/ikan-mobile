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

  constructor() { }

  ngOnInit() {
    console.log(this.options);
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
