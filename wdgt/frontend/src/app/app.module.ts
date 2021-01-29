import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { WindowRef } from './_core/window-ref';
import { AppRoutingModule } from './app-routing.module';
import { AnswerInterceptor } from './_core/answer.interceptor';
import { CoreModule } from './_core/core.module';

import {
  MatButtonModule,
  MatProgressSpinnerModule,
  MatIconModule,
} from '@angular/material';

import {
  AlertService,
  DialogService,
  AuthenticationService,
  UserService,
  ProductModelService,
  FeedbackCategoryService,
  FileService,
  TagService,
  CurrentFeedbackService,
  FeedbackService,
  SocketChatService,
  MessageFactory,
  FileFactory,
  GeolocationService,
  OcrService,
  FileStorageService,
  AudioPlayerService,
  CompanyService,
  ParentService,
  LocalStorageService,
  WidgetService,
} from './_services';
import { InitializeService } from './_services/initialize.service';

import { environment } from '../environments/environment';

// Page components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RecordTypeComponent } from './record-type/record-type.component';
import { AudioRecordComponent } from './audio-record/audio-record.component';
import { FileListComponent } from './file-list/file-list.component';
import { UploadComponent } from './upload/upload.component';
import { ChatComponent } from './chat/chat.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FinalMessageComponent } from './final-message/final-message.component';

// Partial components
import { AlertComponent } from './components/alert/alert.component';
import { FancyButtonComponent } from './components/fancy-button/fancy-button.component';
import { FancyHeaderComponent } from './components/fancy-header/fancy-header.component';
import { FancyMarkerComponent } from './components/fancy-marker/fancy-marker.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { MenuItemProductComponent } from './components/menu-item-product/menu-item-product.component';
import { MenuItemFileComponent } from './components/menu-item-file/menu-item-file.component';
import { MenuItemSimpleComponent } from './components/menu-item-simple/menu-item-simple.component';
import { CameraControlComponent } from './components/camera-control/camera-control.component';
import { FilesPreviewComponent } from './components/files-preview/files-preview.component';
import { FilePreviewComponent } from './components/file-preview/file-preview.component';
import { ChatViewComponent } from './components/chat/chat-view/chat-view.component';
import { ChatItemComponent } from './components/chat/messages/chat-item/chat-item.component';
import { ChatInputComponent } from './components/chat/inputs/chat-input/chat-input.component';
import { MenuItemCategoriesComponent } from './components/menu-item-categories/menu-item-categories.component';
import { ChatInputActionsComponent } from './components/chat/inputs/chat-input-actions/chat-input-actions.component';
import { ChatInputLoginComponent } from './components/chat/inputs/chat-input-login/chat-input-login.component';
import { ChatInputTextComponent } from './components/chat/inputs/chat-input-text/chat-input-text.component';
import { ChatInputTextNumbersComponent } from './components/chat/inputs/chat-input-text-numbers/chat-input-text-numbers.component';
import { ChatItemLinkComponent } from './components/chat/messages/chat-item-link/chat-item-link.component';
import { ChatItemTextComponent } from './components/chat/messages/chat-item-text/chat-item-text.component';
import { ChatItemSearchSuggestComponent } from './components/chat/messages/chat-item-search-suggest/chat-item-search-suggest.component';
import { FilePreviewModalComponent } from './components/file-preview-modal/file-preview-modal.component';

import { TestComponent } from './components/dialog/implementations/test/test.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { PopupModalComponent } from './components/dialog/implementations/popup-modal/popup-modal.component';
import { ChatInputExtraInfoComponent } from './components/chat/inputs/chat-input-extra-info/chat-input-extra-info.component';
import { ChatInputSelectorComponent } from './components/chat/inputs/chat-input-selector/chat-input-selector.component';
import { ChatInputSearchSuggestComponent } from './components/chat/inputs/chat-input-search-suggest/chat-input-search-suggest.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FeedbackTypeCardComponent } from './components/feedback-type-card/feedback-type-card.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { DurationInfoComponent } from './components/duration-info/duration-info.component';

// Image components
import { VideoImageComponent } from './components/images/video/video-image.component';
import { PhotoImageComponent } from './components/images/photo/photo-image.component';
import { LibraryImageComponent } from './components/images/library/library-image.component';
import { TextImageComponent } from './components/images/text/text-image.component';
import { VoiceImageComponent } from './components/images/voice/voice-image.component';
import { PlayButtonImageComponent } from './components/images/play-button/play-button-image.component';
import { BackwardImageComponent } from './components/images/backward/backward-image.component';
import { ForwardImageComponent } from './components/images/forward/forward-image.component';
import { AddBoxImageComponent } from './components/images/add-box/add-box-image.component';
import { PauseButtonImageComponent } from './components/images/pause-button/pause-button-image.component';

// Pipes
import { BlobUriPipe } from './_pipes/blob-url.pipe';
import { SanitizePipe } from './_pipes/sanitizers/sanitize-background-image.pipe';
import { SanitizeUrlPipe } from './_pipes/sanitizers/sanitize-url.pipe';
import { FancyGradientPipe } from './_pipes/fancy-gradient.pipe';
import { FancyUrlPipe } from './_pipes/fancy-url.pipe';
import { RichTextToHtmlPipe } from './_pipes/rich-text-to-html.pipe';
import { FancyTimePipe } from './_pipes/fancy-time.pipe';


// Directives
import { AutosizeDirective } from './_directives/auto-size.directive';
import { FocusDirective } from './_directives/focus.directive';
import { HostDirective } from './_directives/host.directive';
import { UppercaseInputDirective } from './_directives/uppercase-input.directive';
import { RecordButtonComponent } from './components/record-button/record-button.component';
import { ScreenOverlayComponent } from './components/screen-overlay/screen-overlay.component';
import { FileTypeIconComponent } from './components/file-type-icon/file-type-icon.component';
import { SeekbarComponent } from './components/seekbar/seekbar.component';
import { ContactTypeSelectComponent } from './contact-type-select/contact-type-select.component';


const hostUrl = environment.serverUrl.replace(/^https?:\/\//, '');

// function initializeApp(initService: InitializeService): () => Promise<void> {
//   return () => initService.init();
// }

@NgModule({
  declarations: [
    AppComponent,
    LogoutComponent,
    ChatComponent,
    FeedbackComponent,
    FinalMessageComponent,
    AlertComponent,
    FancyButtonComponent,
    FancyHeaderComponent,
    FancyMarkerComponent,
    MenuItemComponent,
    MenuItemProductComponent,
    MenuItemFileComponent,
    MenuItemSimpleComponent,
    CameraControlComponent,
    FilesPreviewComponent,
    FilePreviewComponent,
    BlobUriPipe,
    SanitizePipe,
    SanitizeUrlPipe,
    ChatViewComponent,
    ChatItemComponent,
    ChatInputComponent,
    FancyGradientPipe,
    MenuItemCategoriesComponent,
    FilePreviewModalComponent,
    ChatInputActionsComponent,
    ChatInputLoginComponent,
    ChatInputTextComponent,
    ChatInputTextNumbersComponent,
    ChatItemLinkComponent,
    ChatItemTextComponent,
    ChatItemSearchSuggestComponent,
    TestComponent,
    DialogComponent,
    FancyUrlPipe,
    AutosizeDirective,
    HostDirective,
    FocusDirective,
    UppercaseInputDirective,
    PopupModalComponent,
    ChatInputExtraInfoComponent,
    ChatInputSelectorComponent,
    ChatInputSearchSuggestComponent,
    NavBarComponent,
    FeedbackTypeCardComponent,
    RichTextToHtmlPipe,
    FancyTimePipe,
    RecordTypeComponent,
    FileListComponent,
    UploadComponent,
    AudioRecordComponent,
    RecordButtonComponent,
    ScreenOverlayComponent,
    FileTypeIconComponent,
    AudioPlayerComponent,
    DurationInfoComponent,
    VideoImageComponent,
    PhotoImageComponent,
    LibraryImageComponent,
    TextImageComponent,
    VoiceImageComponent,
    PlayButtonImageComponent,
    BackwardImageComponent,
    ForwardImageComponent,
    AddBoxImageComponent,
    PauseButtonImageComponent,
    SeekbarComponent,
    ContactTypeSelectComponent,
    LoginComponent,
  ],
  entryComponents: [
    PopupModalComponent,
    ChatViewComponent,
    ChatItemComponent,
    ChatInputComponent,
    ChatInputActionsComponent,
    ChatInputLoginComponent,
    ChatInputTextComponent,
    ChatInputTextNumbersComponent,
    ChatItemLinkComponent,
    ChatItemTextComponent,
    ChatItemSearchSuggestComponent,
    ChatInputExtraInfoComponent,
    ChatInputSelectorComponent,
    ChatInputSearchSuggestComponent,
    TestComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  providers: [
    // InitializeService,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeApp,
    //   deps: [
    //     InitializeService,
    //   ],
    //   multi: true,
    // },
    AlertService,
    DialogService,
    AuthenticationService,
    UserService,
    ProductModelService,
    FeedbackCategoryService,
    FileService,
    TagService,
    CurrentFeedbackService,
    MessageFactory,
    FileFactory,
    GeolocationService,
    OcrService,
    FileStorageService,
    AudioPlayerService,
    CompanyService,
    FeedbackService,
    SocketChatService,
    ParentService,
    LocalStorageService,
    WidgetService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AnswerInterceptor,
      multi: true,
    },
    WindowRef,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
