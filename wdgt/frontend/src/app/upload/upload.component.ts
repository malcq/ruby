import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

import {
  CurrentFeedbackService,
  AlertService,
  DialogService,
  FileService,
} from '../_services';

import {
  UploadedFile,
  MediaFileType,
} from '../_models/index';

import { ROUTES } from '../config/router';
import { environment } from '../../environments/environment';

import { PopupModalComponent } from '../components/dialog/implementations/popup-modal/popup-modal.component';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  public loading = false;
  public processingStarted = false;
  public progress = 0;
  public lastDurationTime = 0;
  public progressLength = 477.5220;

  constructor(
    private currentRoute: ActivatedRoute,
    private router: Router,
    private currentFeedbackService: CurrentFeedbackService,
    private alertService: AlertService,
    private dialogService: DialogService,
    private fileService: FileService,
  ) { }

  ngOnInit() {
    this.sendAllFiles();
  }

  setProgress(value: number): void {
    this.progress = Math.round(value);
    this.progressLength = 477.522 * (100 - this.progress) / 100;
  }

  sendAllFiles() {
    this.processingStarted = false;
    this.loading = true;
    let delaySec = 0;

    let feedback;
    this.currentFeedbackService.get()
      .subscribe(
        currentFeedback => {
          feedback = currentFeedback;
          const files = [...feedback.files];
          let fullSize = 0;
          files.forEach(file => {
            if (file.needSendToServer) {
              fullSize += file.size;
              if (file.getFileType() === MediaFileType.video || file.getFileType() === MediaFileType.audio) {
                delaySec = environment.afterUploadDelay;
              }
            }
          });
          const progressData = {
            fullUploadedFileSize: 0,
            fullSize
          };
          this.sendFiles(files, progressData, feedback.sessionId)
            .subscribe(
              uploadedFiles => {
                console.debug('uploadedFiles', this.lastDurationTime, uploadedFiles);
                feedback.files = uploadedFiles;
                feedback.fileDone = true;
                this.currentFeedbackService.save().subscribe(() => {});

                this.gotoForwardAfterDelay(delaySec);
              },
              error => {
                if (environment.dontCheckSendingVideo) {
                  console.debug(error);

                  this.gotoForwardAfterDelay(delaySec);
                } else {
                  console.log(error);
                  this.loading = false;
                  const buttons = [
                    { title: 'Ok', danger: false },
                  ];
                  const title = 'Upload error';
                  let description;
                  if (error.message.indexOf('Http failure response') !== -1) {
                    description = 'Disconnect at uploading';
                  } else {
                    description = error.message;
                  }

                  this.dialogService
                    .open(PopupModalComponent, {
                      title,
                      description,
                      buttons,
                    })
                    .afterClosed()
                    .subscribe((result) => {
                      switch (result) {
                        case 'Ok':
                          this.router.navigate([`/${ROUTES.fileList}`]);
                          break;
                      }
                    });
                }
              }
            );
        },
        error => {
          this.loading = false;
          this.alertService.error(error);
        }
      );
  }

  sendFiles(files, progressData, sessionId, res = []) {
    if (!files.length) {
      return of(res);
    }
    const file = files.shift();
    if (!file.needSendToServer) {
      res.push(file);
      return this.sendFiles(files, progressData, sessionId, res);
    }
    if (file.needSendToServer) {
      const fileSize = file.size;
      return this.fileService
        .upload(file, sessionId)
        .pipe(
          filter(
            answer => {
              if (typeof answer === 'number') {
                this.showUploadProgress(100 * (progressData.fullUploadedFileSize + answer * fileSize / 100) / progressData.fullSize);
                return false;
              } else {
                return true;
              }
            }
          ),
          mergeMap(
            uploadedFile => {
              if (uploadedFile && uploadedFile instanceof UploadedFile) {
                this.lastDurationTime = (<UploadedFile>uploadedFile).duration;
                res.push(uploadedFile);
              }
              progressData.fullUploadedFileSize += fileSize;
              this.showUploadProgress(100 * progressData.fullUploadedFileSize / progressData.fullSize);
              return this.sendFiles(files, progressData, sessionId, res);
            }
          )
        )
    }
  }

  showUploadProgress(progress) {
    if (!this.processingStarted) {
      let loadingProgress = progress * 0.8;
      if (loadingProgress >= 80) {
        loadingProgress = 80;
        this.processingStarted = true;
        this.showProcessingProgress();
      }
      this.setProgress(loadingProgress);
    }
  }

  showProcessingProgress(step = 0) {
    if (!this.loading) {
      return;
    }

    if (step <= 5) {
      this.setProgress(80 + step * 4);
    }

    setTimeout(() => {
      this.showProcessingProgress(step + 1);
    }, (this.fibonacci(step + 1)) * 500);
  }

  gotoForwardAfterDelay(timeSec) {
    if (timeSec > 0) {
      setTimeout(() => {
        this.gotoForward();
      }, timeSec * 1000);
    } else {
      this.gotoForward();
    }
  }

  back() { return; }

  gotoForward() {
    this.loading = false;
    const backUrl = this.currentRoute.snapshot.paramMap.get('back');
    if (backUrl) {
      return this.router.navigate([backUrl]);
    }

    this.currentFeedbackService.get()
      .subscribe(
        currentFeedback => {
          if (currentFeedback.updateRequest) {
            this.router.navigate([`/${ROUTES.summary}`]);
          } else {
            this.router.navigate([`/${ROUTES.chat}`]);
          }
        }
      );
  }

  fibonacci(num) {
    if (num <= 1) { return 1; }

    return this.fibonacci(num - 1) + this.fibonacci(num - 2);
  }
}
