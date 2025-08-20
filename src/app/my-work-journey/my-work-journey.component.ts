import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-work-journey',
  templateUrl: './my-work-journey.component.html',
  styleUrls: ['./my-work-journey.component.scss'],
})
export class MyWorkJourneyComponent  implements OnInit {

  journeyItems = [
    {
      key: 'my-documents',
      title: 'Upload your documents',
      description: 'Manage your documents and essentials',
      icon: 'assets/images/icons/my-documents.svg',
      route: '/app-my-documents',
      isCompleted: true,
      isActive: false
    },
    {
      key: 'my-documents',
      title: 'Upload your documents',
      description: 'Manage your documents and essentials',
      icon: 'assets/images/icons/my-documents.svg',
      route: '/app-my-documents',
      isCompleted: true,
      isActive: false
    },
    {
      key: 'learning-hub',
      title: 'Visit the learning hub',
      description: 'Read through helpful articles in the following sections, and answer questions to complete.',
      icon: 'assets/images/icons/learning-hub.svg',
      route: '/app-tutorials',
      isCompleted: false,
      isActive: true
    },
    {
      key: 'my-documents',
      title: 'Upload your documents',
      description: 'Manage your documents and essentials',
      icon: 'assets/images/icons/my-documents.svg',
      route: '/app-my-documents',
      isCompleted: false,
      isActive: false
    },
    {
      key: 'my-work-journey',
      title: 'My work journey',
      description: 'Track your work journey and progress',
      icon: 'assets/images/icons/my-work-journey.svg',
      route: '/app-my-work-journey',
      isCompleted: false,
      isActive: false
    }
  ];

  constructor() { }

  ngOnInit() {}

  onClick(route: string) {
    // Logic to navigate to the route
    console.log(`Navigating to ${route}`);
  }
}
