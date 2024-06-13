import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent  implements OnInit {
  questionData: any;
  commonText: any;
  isYesNoValue = false;
  selectedValue = '';

  constructor(
    public activatedRoute: ActivatedRoute,
    public contentService: ContentService,
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      if (params?.questionData) {
        this.questionData = JSON.parse(params?.questionData);
      }
    });
    this.commonText = this.contentService?.commonText;
    if (this.questionData?.questionType === 'radio' || this.questionData?.questionType === 'select') {
      // TODO: use value
      const values = this.questionData.options.map(obj => obj?.option?.toLowerCase());
      const containsYesNo = values.includes('yes') && values.includes('no');
      if (containsYesNo) {
        this.isYesNoValue = true;
        this.questionData.options.forEach((opt) => {
          if (opt?.option?.toLowerCase() === 'yes') {
            opt.icon = 'checkmark';
          } else if (opt.option?.toLowerCase() === 'no') {
            opt.icon = 'close';
          } else {
            opt.icon = 'alert';
          }
        });
      }
    }
  }

  selectOption(value: string) {
    this.selectedValue = value;
  }

  submitAnswer() {}
}
