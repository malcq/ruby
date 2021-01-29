import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

import { ChatBaseComponent } from '../../chat-view/chat-base.component';

@Component({
  selector: 'app-chat-item-link',
  templateUrl: './chat-item-link.component.html',
  styleUrls: ['./chat-item-link.component.css']
})
export class ChatItemLinkComponent implements OnInit, ChatBaseComponent {
  @Input() data: any = {link: {}};

  constructor() { }

  ngOnInit() {
  }

}
