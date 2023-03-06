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
          hasAttachment: false,
          attachmentType: 'pdf',
          pdfInfo: 'More info. Functionality here is click panel to view.',
          pdfTitle: 'Attachment.pdf',
          icon: '/assets/icon/training.svg',
          read: true,
        },
        {
          title: 'Title goes here',
          daysAgo: '1 day ago',
          text: 'Accompanying message or information goes here. Lorem ipsum dolor sit amet, soi',
          hasAttachment: true,
          attachmentType: 'audio',
          icon: '/assets/icon/payments.svg',
          read: false,
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
          pdfInfo: 'More info. Functionality here is click panel to view.',
          pdfTitle: 'Attachment.pdf',
          icon: '/assets/icon/contract.svg',
          read: false,
        },
        {
          title: 'Title goes here',
          daysAgo: '1 day ago',
          text: 'Accompanying message or information goes here. Lorem ipsum dolor sit amet, soi',
          hasAttachment: true,
          attachmentType: 'audio',
          icon: '/assets/icon/contract.svg',
          read: false,
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
          pdfInfo: 'More info. Functionality here is click panel to view.',
          pdfTitle: 'Attachment.pdf',
          icon: '/assets/icon/payments.svg',
          read: true,
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
          pdfInfo: 'More info. Functionality here is click panel to view.',
          pdfTitle: 'Attachment.pdf',
          icon: '/assets/icon/boat_medium.svg',
          read: true,
        },
      ],
    },
  ];
  constructor() {}

  ngOnInit() {}
}
