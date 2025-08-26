import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-titleblock',
    templateUrl: './titleblock.component.html',
    styleUrls: ['./titleblock.component.scss'],
    standalone: false
})
export class TitleblockComponent implements OnInit {

  @Input() variant: 'default' | 'completed' | 'pending' = 'default';
  @Input() title = 'Passporttbh';

  constructor() { }

  ngOnInit() {}

}
