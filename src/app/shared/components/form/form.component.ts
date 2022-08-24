import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  // ToDo: See after prismic integration if we can change this type to something more meaningful
  @Input() formQuestions: any;
  @Input() tunaFormGroup: FormGroup;


  @Output() formValues = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {}

  onSubmit(event) {

  }
}
