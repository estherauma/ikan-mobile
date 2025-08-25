import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: false
})
export class HomePage implements OnInit {
  notifications: any;
  pageTitle: string = 'Notifications';
  moreText: string = 'More';
  deleteText: string = 'Delete';
  enPageTitle: string = 'Notifications';
  mandarinPageTitle: string = '通知';
  enMoreText: string = 'More';
  mandarinMoreText: string = '更多';
  enDeleteText: string = 'Delete';
  mandarinDeleteText: string = '刪除';
  enNotifications = [
    {
      title: 'New',
      content: [
        {
          title: 'Payments: Vessel 1',
          daysAgo: '1 day ago',
          text: 'Vessel 1 has 4 payment discrepancies between fisher and the vessel owner',
          hasAttachment: false,
          attachmentType: 'pdf',
          pdfInfo: 'More info. Functionality here is click panel to view.',
          pdfTitle: 'Attachment.pdf',
          icon: '/assets/icon/training.svg',
          read: true,
          status: 'status',
        },
        {
          title: 'Training: Vessel 6',
          daysAgo: '1 day ago',
          text: '5 workers on vessel 6 have not completed their training within one week of boarding the vessel',
          hasAttachment: true,
          attachmentType: 'audio',
          icon: '/assets/icon/payments.svg',
          read: false,
          status: 'status',
        },
      ],
    },
    {
      title: 'This week',
      content: [
        {
          title: 'Contract terms - Vessel 45',
          daysAgo: '1 day ago',
          text: 'Workers are reporting sleeping conditions onboard are not what was agreed in their contract',
          hasAttachment: true,
          attachmentType: 'pdf',
          pdfInfo: 'More info. Functionality here is click panel to view.',
          pdfTitle: 'Attachment.pdf',
          icon: '/assets/icon/contract.svg',
          read: false,
          status: 'status',
        },
        {
          title: 'Overall vessel performance - June 2023',
          daysAgo: '1 day ago',
          text: '85% of vessels are completing payments on-time and as agreed in the contract',
          hasAttachment: true,
          attachmentType: 'audio',
          icon: '/assets/icon/contract.svg',
          read: false,
          status: 'status',
        },
      ],
    },
    {
      title: 'This month',
      content: [
        {
          title: 'Title goes here',
          daysAgo: '25 day ago',
          text: 'Accompanying message or information goes here. Lorem ipsum dolor sit amet, soi',
          hasAttachment: true,
          attachmentType: 'pdf',
          pdfInfo: 'More info. Functionality here is click panel to view.',
          pdfTitle: 'Attachment.pdf',
          icon: '/assets/icon/payments.svg',
          read: true,
          status: 'status',
        },
      ],
    }
  ];
  maNotifications = [
    {
      title: '新的',
      content: [
        {
          title: '付款：船隻1',
          daysAgo: '1天前',
          text: '船隻1在費舍爾與船東之間有4個付款',
          hasAttachment: false,
          attachmentType: 'pdf',
          pdfInfo: '更多信息。功能是單擊面板要查看。',
          pdfTitle: '依戀.pdf',
          icon: '/assets/icon/training.svg',
          read: true,
          status: '地位',
        },
        {
          title: '培訓：船6',
          daysAgo: '1天前',
          text: '船隻6上的5名工人在登機後一周內尚未完成培訓',
          hasAttachment: true,
          attachmentType: 'audio',
          icon: '/assets/icon/payments.svg',
          read: false,
          status: '地位',
        },
      ],
    },
    {
      title: '本星期',
      content: [
        {
          title: '合同條款 - 船隻45',
          daysAgo: '1天前',
          text: '工人正在報告船上的睡眠條件並不是其合同中達成的商定',
          hasAttachment: true,
          attachmentType: 'pdf',
          pdfInfo: '更多信息。功能是單擊面板要查看。',
          pdfTitle: '依戀.pdf',
          icon: '/assets/icon/contract.svg',
          read: false,
          status: '地位',
        },
        {
          title: '整體船隻性能 -  2023年6月',
          daysAgo: '1天前',
          text: '85％的船隻按時完成付款，並按照合同中的同意',
          hasAttachment: true,
          attachmentType: 'audio',
          icon: '/assets/icon/contract.svg',
          read: false,
          status: '地位',
        },
      ],
    },
    {
      title: '這個月',
      content: [
        {
          title: '標題進入這裡',
          daysAgo: '25天前',
          text: '隨附的消息或信息在這裡。 lorem ipsum dolor坐在阿瑪特，soi',
          hasAttachment: true,
          attachmentType: 'pdf',
          pdfInfo: '更多信息。功能是單擊面板要查看。',
          pdfTitle: '依戀.pdf',
          icon: '/assets/icon/payments.svg',
          read: true,
          status: '地位',
        },
      ],
    }
  ];
  constructor(
    public contentService: ContentService,
  ) {}

  ngOnInit() {
    if (this.contentService.currentLanguage === 'qm-zh') {
      this.notifications = this.maNotifications;
      this.pageTitle = this.mandarinPageTitle;
      this.moreText = this.mandarinMoreText;
      this.deleteText = this.mandarinDeleteText;
    } else {
      this.notifications = this.enNotifications;
      this.pageTitle = this.enPageTitle;
      this.moreText = this.enMoreText;
      this.deleteText = this.enDeleteText;
    }
  }
}
