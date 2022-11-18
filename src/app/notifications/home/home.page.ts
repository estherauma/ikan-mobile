import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  notifications = [
    {
      title: 'New',
      content: [
        {
          title: 'Title goes here',
          daysAgo: '1 day ago',
          text: 'Accompanying message or information goes here. Lorem ipsum dolor sit amet, soi',
          hasAttachment: true,
          attachmentType: 'pdf',
        },
        {
          title: 'Title goes here',
          daysAgo: '1 day ago',
          text: 'Accompanying message or information goes here. Lorem ipsum dolor sit amet, soi',
          hasAttachment: true,
          attachmentType: 'audio',
        },
      ],
    },
    {
      title: 'This week',
      content: [
        {
          title: 'Title goes here',
          daysAgo: '1 day ago',
          text: 'Accompanying message or information goes here. Lorem ipsum dolor sit amet, soi',
          hasAttachment: true,
          attachmentType: 'pdf',
        },
        {
          title: 'Title goes here',
          daysAgo: '1 day ago',
          text: 'Accompanying message or information goes here. Lorem ipsum dolor sit amet, soi',
          hasAttachment: true,
          attachmentType: 'audio',
        },
      ],
    },
    {
      title: 'This month',
      content: [
        {
          title: 'Title goes here',
          daysAgo: '1 day ago',
          text: 'Accompanying message or information goes here. Lorem ipsum dolor sit amet, soi',
          hasAttachment: true,
          attachmentType: 'pdf',
        },
      ],
    },
    {
      title: 'Older',
      content: [
        {
          title: 'Title goes here',
          daysAgo: '1 day ago',
          text: 'Accompanying message or information goes here. Lorem ipsum dolor sit amet, soi',
          hasAttachment: true,
          attachmentType: 'pdf',
        },
      ],
    },
  ];
  constructor() {}

  ngOnInit() {}
}
