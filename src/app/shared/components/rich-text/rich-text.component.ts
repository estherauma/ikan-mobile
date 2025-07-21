import { Component, Input, OnInit } from '@angular/core';
import { SharedmethodsService } from '../../services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-rich-text',
  templateUrl: './rich-text.component.html',
  styleUrls: ['./rich-text.component.scss'],
})
export class RichTextComponent  implements OnInit {

  @Input() textContent: any;

  constructor(
    public sharedMethods: SharedmethodsService,
  ) { }

  ngOnInit() {}

}
