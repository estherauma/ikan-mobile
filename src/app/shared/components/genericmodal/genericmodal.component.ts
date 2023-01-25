import { Component, Output, EventEmitter, Input, OnInit, TemplateRef } from '@angular/core';
import { ContentService } from '../../services/content/content.service';

@Component({
  selector: 'app-genericmodal',
  templateUrl: './genericmodal.component.html',
  styleUrls: ['./genericmodal.component.scss'],
})
export class GenericmodalComponent implements OnInit {
  @Input() title;
  @Input() textContent;
  @Input() isConfirm = false;
  @Input() isCancel = false;
  @Input() isOk = false;

  @Output() onConfirm = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();

  cancelText;
  okText;

  constructor(
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.cancelText = this.contentService.commonText?.cancel;
    this.okText = this.contentService.commonText?.ok;
  }

  onOk() {
    this.onConfirm.emit();
  }

  onCanceled() {
    this.onCancel.emit();
  }

}
