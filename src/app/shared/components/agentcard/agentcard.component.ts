import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-agentcard',
    templateUrl: './agentcard.component.html',
    styleUrls: ['./agentcard.component.scss'],
    standalone: false
})
export class AgentcardComponent implements OnInit {
  @Input() agent;
  constructor() { }

  ngOnInit() {}

}
