import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-buttonoutline',
  templateUrl: './buttonoutline.component.html',
  styleUrls: ['./buttonoutline.component.scss'],
})
export class ButtonoutlineComponent implements OnInit {
  @Input() onClick;
  @Input() title;
  @Input() disabled = false;
  @Input() type;
  constructor() { }

  ngOnInit() {}

}
