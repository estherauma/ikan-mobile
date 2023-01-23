import { Component, Output, EventEmitter, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-genericmodal',
  templateUrl: './genericmodal.component.html',
  styleUrls: ['./genericmodal.component.scss'],
})
export class GenericmodalComponent implements OnInit {
  @Input() title;
  @Input() textContent;
  @Input() isConfirm = false;

  @Output() onConfirm = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {}

  onOk() {
    this.onConfirm.emit();
  }

}
