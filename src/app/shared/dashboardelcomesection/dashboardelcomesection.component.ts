import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dashboardelcomesection',
  templateUrl: './dashboardelcomesection.component.html',
  styleUrls: ['./dashboardelcomesection.component.scss'],
})
export class DashboardelcomesectionComponent implements OnInit {

  @Input() name: string;
  @Input() message: string;
  @Input() link: string;
  @Input() message1: string;

  @Output() onProfileClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {}

  onIconClick() {
    this.onProfileClick.emit();
  }

}
