import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Input() searchDataSet: any[] = [];
  @Input() searchProperty: string;
  @Output() searchResult: EventEmitter<any> = new EventEmitter<any>();
  @Output() clear: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  onSearchTextChanged(eventData) {
    const value = eventData.detail.value.trim();
    if (value.length === 0) {
      this.clear.emit();
    } else {
      const filtered = this.searchDataSet.filter(data => {
        const currentProperty = this.searchProperty ? this.searchProperty : 'name';
        return data[currentProperty].toString().toLowerCase().indexOf(value.toString().toLowerCase()) > -1;
      });

      this.searchResult.emit(filtered);
    }
  }

  onClear() {
    this.clear.emit();
  }
}
