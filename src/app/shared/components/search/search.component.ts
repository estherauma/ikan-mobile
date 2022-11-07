import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  constructor() { }

  @Input()
  searchDataSet: any[] = []

  @Input()
  searchProperty: string = ""

  @Output()
  searchResult: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {}

  onSearchTextChanged(data){
    const value = data.detail.value.trim();
    
    const filtered = this.searchDataSet.filter(data => {
      const currentProperty = this.searchProperty ? this.searchProperty : "name";
      return data[currentProperty].toString().toLowerCase() === value.toString().toLowerCase()
    });

    this.searchResult.emit(filtered)
  }
}
