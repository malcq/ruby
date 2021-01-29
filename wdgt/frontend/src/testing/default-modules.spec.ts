import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatListModule,
  MatButtonModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatMenuModule,
  MatChipsModule,
  MatInputModule,
} from '@angular/material';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {
  SwiperModule,
  SWIPER_CONFIG,
} from 'ngx-swiper-wrapper';

import { WindowRef } from '../app/_core/window-ref';

import { FocusDirective } from '../app/_directives/focus.directive';
import { AutosizeDirective } from '../app/_directives/auto-size.directive';
import { HostDirective } from '../app/_directives/host.directive';

import { RichTextToHtmlPipe } from '../app/_pipes/rich-text-to-html.pipe';
import { FancyUrlPipe } from '../app/_pipes/fancy-url.pipe';
import { FancyTimePipe } from '../app/_pipes/fancy-time.pipe';
import { SanitizePipe } from '../app/_pipes/sanitizers/sanitize-background-image.pipe';
import { SanitizeUrlPipe } from '../app/_pipes/sanitizers/sanitize-url.pipe';


import {
  DummyComponent,
  MockNavBarComponent,
  MockFancyHeaderComponent,
  MockDurationInfoComponent,
  MockAudioPlayerComponent,
  MockRecordButtonComponent,
  MockScreenOverlayComponent,
  MockSeekbarComponent,
  MockFilesPreviewComponent,
  MockFilePreviewComponent,
  MockFancyButtonComponent,
  MockChatViewComponent,
  MockChatItemComponent,
  MockChatInputComponent,
  MockFancyMarkerComponent,
  MockFilePreviewModalComponent,
  MockMenuItemComponent,
  MockWelcomeSliderContentComponent,
  MockWelcomeSliderContentFirstComponent,
  MockWelcomeSliderPageComponent,
  MockFeedbackTypeCardComponent,
  MockMenuItemProductComponent,
  MockMenuItemFileComponent,
  MockMenuItemCategoriesComponent,
  MockMenuItemSimpleComponent,
  MockWelcomeSliderComponent,
  MockFileTypeIconComponent,
  MockWhereVinComponent,
  MockAddBoxImageComponent,
  MockBackwardImageComponent,
  MockForwardImageComponent,
  MockLibraryImageComponent,
  MockPauseButtonImageComponent,
  MockPhotoImageComponent,
  MockTextImageComponent,
  MockVideoImageComponent,
  MockVoiceImageComponent,
  MockPlayButtonImageComponent,
  localStorageServiceServiceMock,
} from './index.spec';

export function defaultModules(modules: any) {
  if (!modules.declarations) {
    modules.declarations = [];
  }
  if (!modules.imports) {
    modules.imports = [];
  }
  if (!modules.providers) {
    modules.providers = [];
  }
  modules.declarations = modules.declarations.concat([
    FocusDirective,
    AutosizeDirective,
    HostDirective,
    RichTextToHtmlPipe,
    FancyUrlPipe,
    FancyTimePipe,
    SanitizePipe,
    SanitizeUrlPipe,
    DummyComponent,
    MockNavBarComponent,
    MockFancyHeaderComponent,
    MockDurationInfoComponent,
    MockAudioPlayerComponent,
    MockRecordButtonComponent,
    MockScreenOverlayComponent,
    MockSeekbarComponent,
    MockFilesPreviewComponent,
    MockFilePreviewComponent,
    MockFancyButtonComponent,
    MockChatViewComponent,
    MockChatItemComponent,
    MockChatInputComponent,
    MockFancyMarkerComponent,
    MockFilePreviewModalComponent,
    MockMenuItemComponent,
    MockWelcomeSliderContentComponent,
    MockWelcomeSliderContentFirstComponent,
    MockWelcomeSliderPageComponent,
    MockFeedbackTypeCardComponent,
    MockMenuItemProductComponent,
    MockMenuItemFileComponent,
    MockMenuItemCategoriesComponent,
    MockMenuItemSimpleComponent,
    MockWelcomeSliderComponent,
    MockFileTypeIconComponent,
    MockWhereVinComponent,
    MockAddBoxImageComponent,
    MockBackwardImageComponent,
    MockForwardImageComponent,
    MockLibraryImageComponent,
    MockPauseButtonImageComponent,
    MockPhotoImageComponent,
    MockTextImageComponent,
    MockVideoImageComponent,
    MockVoiceImageComponent,
    MockPlayButtonImageComponent,
  ]);
  modules.imports = modules.imports.concat([
    BrowserModule,
    FormsModule,
    NoopAnimationsModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    SwiperModule,
  ]);
  modules.providers = modules.providers.concat([
    localStorageServiceServiceMock,
    {
      provide: WindowRef,
      useValue: {
        nativeWindow: {
          innerWidth: 0,
          innerHeight: 0,
          navigator: {
            mediaDevices: {
              getUserMedia: (options) => Promise.resolve({stop: () => {}})
            }
          }
        }
      }
    },
  ]);
  return modules;
}
