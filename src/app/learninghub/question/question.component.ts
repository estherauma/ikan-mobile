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
  isYesNoValue: boolean = false;
  selectedValue = '';
  inputValue = '';
  hasFollowupQtn: boolean = false;
  followupQtnData: any;
  followUpSelectedValue = '';
  followUpInputValue = '';

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

    this.getFollowupQtn();
  }

  selectOption(value: string) {
    this.selectedValue = value;
    this.questionData.value = value;
    this.getFollowupQtn();
  }

  handleInputChange(e) {
    this.inputValue = e.detail.value;
    this.questionData.value = this.inputValue;
    this.getFollowupQtn();
  }
  
  handleSelectChange(e) {
    this.selectedValue = e.detail.value;
    this.questionData.value = this.selectedValue;
    this.getFollowupQtn();
  }

  getFollowupQtn() {
    if (this.questionData?.options) {
      // use value
      const selectedOption = this.questionData.options.find((opt) => opt.option === this.questionData.value);
      if (selectedOption?.followUpQuestion) {
        this.hasFollowupQtn = true;
        this.followupQtnData = selectedOption.followUpQuestion;
        if(this.followupQtnData?.key === 'See the Get Help section to find a workers union you can consult with') {
          this.followupQtnData.questionType = 'helperText';
        }
      } else {
        this.hasFollowupQtn = false;
        this.followupQtnData = null;
      }
    }
  }

  handleFollowUpInputChange(e) {
    this.followUpInputValue = e.detail.value;
    this.followupQtnData.value = this.followUpInputValue;
  }
  
  handleFollowUpSelectChange(e) {
    this.followUpSelectedValue = e.detail.value;
    this.followupQtnData.value = this.followUpSelectedValue;
  }

  submitAnswer() {}
}
