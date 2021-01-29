import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ComponentFactoryResolver,
  ChangeDetectorRef,
} from '@angular/core';

import { ChatBaseComponent } from '../../chat-view/chat-base.component';
import { HostDirective } from '../../../../_directives/host.directive';

import { Message, MessageComponentInfo } from '../../../../_models/message';

@Component({
  selector: 'app-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.css']
})
export class ChatItemComponent implements OnInit {
  /**
   * Message to show
   */
  @Input() message: Message;

  @ViewChild(HostDirective) chatHost: HostDirective;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    const viewContainerRef = this.chatHost.viewContainerRef;
    viewContainerRef.clear();

    if (this.message) {
      const chatItem = this.message.getItemComponent();
      if (chatItem) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(chatItem.component);

        const componentRef = viewContainerRef.createComponent(componentFactory);
        (<ChatBaseComponent>componentRef.instance).data = chatItem.data;
      }
    }
  }
}
