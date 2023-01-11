import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-invite-code-input',
  templateUrl: './invite-code-input.component.html',
  styleUrls: ['./invite-code-input.component.scss'],
})
export class InviteCodeInputComponent implements OnInit {

  @Output() inputValue: EventEmitter<any> = new EventEmitter();

  inputOne = '';
  inputTwo = '';
  inputThree = '';
  inputFour = '';

  constructor() { }

  ngOnInit() { }


  onDigitInput(event) {
    this.inputValue.emit({
      value: `${this.inputOne}${this.inputTwo}${this.inputThree}${this.inputFour}`,
    });
  }

}
