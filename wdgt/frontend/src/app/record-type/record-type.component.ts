import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as utils from '../_core/utils';

import {
  CurrentFeedbackService,
  AlertService,
  FileFactory,
  DomUtilsService,
  WidgetService,
} from '../_services';

import { ROUTES } from '../config/router';

import { BaseFile } from '../_models/index';

@Component({
  selector: 'app-record-type',
  templateUrl: './record-type.component.html',
  styleUrls: ['./record-type.component.scss']
})
export class RecordTypeComponent implements OnInit {
  public canBack = true;
  public title = 'Record.';
  public description = 'Select your channel';

  constructor(
    private currentRoute: ActivatedRoute,
    private router: Router,
    private currentFeedbackService: CurrentFeedbackService,
    private alertService: AlertService,
    private fileFactory: FileFactory,
    private domService: DomUtilsService,
    private widgetService: WidgetService,
  ) { }

  ngOnInit() {
    this.domService.preloadImagesForOffline();
    this.currentFeedbackService.get()
      .subscribe(
        feedback => {
          this.initHeader(feedback);
        },
        error => {
          this.alertService.error(error);
        }
      );
  }

  onFileChange(event): void {
    const { files } = event.target;
    if (!files || files.length <= 0) { return; }

    const promises: Promise<BaseFile>[] = [];
    for (let i = 0; i < files.length; i++) {
      promises.push(this.fileFactory.getBlobFile(files[i]));
    }


    if (promises.length) {
      Promise.all(promises)
        .then(newFiles => this.addFiles(newFiles))
        .catch(err => console.log(err));
    }
  }

  addFiles(files: BaseFile[]): void {
    this.currentFeedbackService.addFiles(files)
      .subscribe(
        () => {
          this.router.navigate([`/${ROUTES.fileList}`]);
        },
        error => {
          this.alertService.error(error);
        }
      );
  }

  captureVoice() {
    this.router.navigate([`/${ROUTES.audioRecord}`]);
  }

  startText() {
    this.currentFeedbackService.get()
      .pipe(
        switchMap((feedback) => {
          if (!feedback.updateRequest) {
            feedback.files = [];
            feedback.fileDone = true;
            return this.currentFeedbackService.save();
          }
          return of();
        })
      )
      .subscribe(
        () => {
          this.router.navigate([`/${ROUTES.chat}`]);
        },
        error => {
          this.alertService.error(error);
        }
      );
  }

  back() {
    const backUrl = this.currentRoute.snapshot.paramMap.get('back');
    if (backUrl) {
      return this.router.navigate([backUrl]);
    }

    this.currentFeedbackService.get()
      .subscribe(
        (feedback) => {
          if (feedback.updateRequest) {
            this.router.navigate([`/${ROUTES.summary}`]);
          } else {
            this.widgetService.close()
              .subscribe(() => null);
          }
        },
        (error) => {
          this.alertService.error(error);
        }
      );
  }

  initHeader(feedback) {
    const title = utils.get(feedback, 'company.texts.library.title');
    const description = utils.get(feedback, 'company.texts.library.description');
    if (title) {
      this.title = title;
    }

    if (description) {
      this.description = description;
    }
  }
}
