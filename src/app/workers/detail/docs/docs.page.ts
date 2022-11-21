import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.page.html',
  styleUrls: ['./docs.page.scss'],
})
export class DocsPage implements OnInit {
  documentation = [
    {
      label: 'Passport',
      checked: true,
      showReminderButton: false
    },
    {
      label: 'Visa',
      checked: false,
      showReminderButton: true
    },
    {
      label: 'Employment agreement signed',
      checked: false,
      showReminderButton: true
    },
  ];
  constructor() { }

  ngOnInit() {
  }

}
