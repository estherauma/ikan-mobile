import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-files',
  templateUrl: './files.page.html',
  styleUrls: ['./files.page.scss'],
})
export class FilesPage implements OnInit {
  select = false;
  display: 'list' | 'icon' = 'list';
  files = new Array(20).fill({
    name:'FileName.jpg',
    date: 'xx/xx/xxx',
    size:'412kb'
  });
  constructor() { }

  ngOnInit() {
  }
  searchResult(data){}

  onSelect(){
    this.select = true;
  }
  onClick(){}
  onCancel(){
    this.select = false;
  }

}
