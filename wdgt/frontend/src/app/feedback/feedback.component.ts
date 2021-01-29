
import {switchMap, mergeMap} from 'rxjs/operators';
import {
  Component,
  OnInit,
} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { of ,  forkJoin } from 'rxjs';



import { ROUTES } from '../config/router';
import { Feedback } from '../_models';
import {
  AlertService,
  CurrentFeedbackService,
  FeedbackService,
  AuthenticationService,
  WidgetService,
} from '../_services';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css', '../fancy.css'],
})
export class FeedbackComponent implements OnInit {
  public loading = false;
  public cantSendFeedback = false;
  public feedback: Feedback;
  public fancyVin = '';

  public fileCaption: string;
  getStarted = false;

  constructor(
    private currentRoute: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private currentFeedbackService: CurrentFeedbackService,
    private feedbackService: FeedbackService,
    private authenticationService: AuthenticationService,
    private widgetService: WidgetService,
  ) { }

  ngOnInit() {
    this.loading = true;
    const updateRequest = false;
    this.currentRoute.queryParams.pipe(
      mergeMap(params => {
        return this.authenticationService.loggedIn().pipe(
          switchMap(loggedIn => {
            if (!loggedIn) {
              this.router.navigate([`/${ROUTES.root}`]);
              return of(null);
            } else {
              return this.currentFeedbackService.get();
            }
          }));
      }))
      .subscribe(
        feedback => {
          if (feedback) {
            this.currentFeedbackService.feedback = feedback;
            this.feedback = feedback;
            if (feedback.vin && feedback.vin.length > 3) {
              this.fancyVin = (feedback.vin.substr(0, 3) + '-' + feedback.vin.substr(3, feedback.vin.length - 3)).toUpperCase();
            }
            this.currentFeedbackService.save().subscribe(() => {});

            this.setMenuCaptions();
          }
          this.loading = false;
        },
        error => {
          this.loading = false;
          this.alertService.error(error);
        }
      );
  }

  onFileClick() {
    if (this.feedback.isEditable) {
      this.feedback.fileDone = false;
      this.currentFeedbackService.save().pipe(
        mergeMap(() => this.currentFeedbackService.isNeedReRecordFile()))
        .subscribe(
          (needReRecordFile: boolean) => {
            if (needReRecordFile) {
              this.currentFeedbackService.clearAllFiles()
                .subscribe(() => {
                  this.router.navigate(
                    [`/${ROUTES.recordType}`],
                    { queryParams: { back: `/${ROUTES.summary}` } }
                  );
                });
            } else {
              this.router.navigate(
                [`/${ROUTES.fileList}`],
                { queryParams: { back: `/${ROUTES.summary}` } }
              );
            }
          },
          error => {
            this.alertService.error(error);
          }
        );
    }
  }

  sendFeedback() {
    if (this.cantSendFeedback) { return; }
    forkJoin([
      this.feedbackService.create(this.feedback),
      this.currentFeedbackService.get()
    ])
      .subscribe(
        ([feedback, currentFeedback]) => {
          this.navigateAfterSend(currentFeedback);
        },
        error => {
          console.debug(error);
          this.router.navigate([`/${ROUTES.final}`]);
        }
      );
  }

  navigateAfterSend(currentFeedback) {
    if (
      currentFeedback &&
      currentFeedback.company &&
      currentFeedback.company.name
      ) {
      if (currentFeedback.company.name !== 'BMW') {
        this.currentFeedbackService.remove();
        this.widgetService.close().subscribe(()=>{});
        return;
      }
    }
    this.router.navigate([`/${ROUTES.final}`]);
  }

  /**
   * TODO: Change when api will send what exactly should be changed
   */
  setMenuCaptions() {
    this.currentFeedbackService.isNeedReRecordFile()
      .subscribe(
        needFileCaption => {
          if (needFileCaption) {
            this.getStarted = true;
            this.cantSendFeedback = true;
            this.fileCaption = 'Please Re-Record your Video';
          }
        },
        error => {
          this.alertService.error(error);
        }
      );
  }

  gotoChat() {
    if (this.feedback.isEditable) {
      this.feedback.chatDone = false;
      this.currentFeedbackService.save()
        .subscribe(() => {
          this.router.navigate(
            [`/${ROUTES.chat}`],
            { queryParams: { back: `/${ROUTES.summary}` } }
          );
        });
    }
  }
}
