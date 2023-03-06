import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-questiontitlecard',
  templateUrl: './questiontitlecard.component.html',
  styleUrls: ['./questiontitlecard.component.scss'],
})
export class QuestiontitlecardComponent implements OnInit {
  @Input() type: 'question' | 'success' | 'warning' | 'error' | string = 'question';
  @Input() iconName;
  @Input() customCss;
  constructor() { }

  ngOnInit() {
    if (this.type === 'error') {
      this.iconName = 'close-outline';
      this.customCss = 'error';

    } else if (this.type === 'success') {
      this.iconName = 'checkmark-outline';
      this.customCss = 'success';

    } else if (this.type === 'warning') {
      this.iconName = 'alert-outline';
      this.customCss = 'warning';

    } else {
      this.iconName = 'help-outline';
      this.customCss = 'question';
    }
  }

}
