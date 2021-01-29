import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { Subscription, Subject } from 'rxjs';
import {
  throttleTime,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  debounce
} from 'rxjs/operators';

import {
  messageComponentResolver,
} from '../../../../_models/message';
import { ChatCategory } from '../../../../_models';
import { TagService } from '../../../../_services';

import { ChatInputBaseComponent } from '../../chat-view/chat-input-base.component';

interface Data {
  fakeBotTypingAnimation: boolean;
  defaultValue: string;
}

@Component({
  selector: 'app-chat-input-search-suggest',
  templateUrl: './chat-input-search-suggest.component.html',
  styleUrls: [
    './chat-input-search-suggest.component.css',
    '../../../../fancy.css',
    '../../../../menus.css',
  ]
})
export class ChatInputSearchSuggestComponent implements OnInit, AfterViewInit, OnDestroy, ChatInputBaseComponent {

  @Input() data: Data = {
    fakeBotTypingAnimation: false,
    defaultValue: ''
  };

  @Input() context: any;

  public tags: ChatCategory[];
  public searchTags = new Subject<string>();
  public initialized = false;
  public chosedTag = null;


  public search = '';
  public focus = new EventEmitter<boolean>();


  @ViewChild('searchInput') searchViewRef: ElementRef;

  constructor(
    private tagService: TagService,
    private selfRef: ElementRef,
  ) { }

  ngOnInit() {
    this.search = this.data.defaultValue;
    this.onSearchChange();
  }

  ngAfterViewInit() {
    this.focus.emit(true);
  }

  ngOnDestroy() {
    if (this.context) {
      setTimeout(() => this.context.suggestionHide(), 0);
    }
  }

  onSendPress() {
    if (!this.tags || !this.tags.length) { return; }
    const tag = this.getTagByName();
    this.context.addTag(this.search, tag);
  }

  onTagMousedown(ev) {
    ev.preventDefault();
  }

  onReplacePress(tag: ChatCategory) {
    this.search = `${tag.title} `;
    this.chosedTag = tag;
    this.updateTags();
  }

  updateTags() {
    this.tagService.findTagsByWordPart(this.search, 5)
      .subscribe(tags => {
        if (!this.initialized) {
          this.context.suggestionShow(this.selfRef.nativeElement);
          this.initialized = true;
        }

        this.tags = tags;
      });
  }

  getTagByName() {
    const queryTag = this.search.toLowerCase().trim();
    const actualTag = this.tags.find((tag) => {
      const arrayTag = tag.title.toLowerCase().trim();
      if (queryTag === arrayTag) {
        return true;
      }
      return false;
    });
    if (actualTag) {
      return actualTag;
    }
    const { title: chosedTagTitle } = this.chosedTag;
    if (chosedTagTitle && chosedTagTitle.toLowerCase().trim() === queryTag) {
      return this.chosedTag;
    }

    return {categories: 'unknown', title: queryTag};
  }

  onSearchChange() {
    if (!this.search.trim().length) { return; }
    this.updateTags();
  }
}

messageComponentResolver.addComponent(
  'app-chat-input-search-suggest',
  ChatInputSearchSuggestComponent
);
