import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  CurrentFeedbackService,
  AlertService,
  DialogService,
  DomUtilsService,
} from '../_services';

import { ROUTES } from '../config/router';

import { PopupModalComponent } from '../components/dialog/implementations/popup-modal/popup-modal.component';

import { BaseFile } from '../_models';

import { MediaFileType } from '../_models/base-file';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit, OnDestroy  {

  public files: BaseFile[] = [];
  public online = true;

  private onlineChangedSubscription: Subscription;

  constructor(
    private currentRoute: ActivatedRoute,
    private router: Router,
    private currentFeedbackService: CurrentFeedbackService,
    private alertService: AlertService,
    private dialogService: DialogService,
    private domService: DomUtilsService,
  ) { }

  ngOnInit() {
    this.domService.preloadImagesForOffline();
    this.currentFeedbackService.get()
      .subscribe(
        feedback => {
          if (!feedback.files.length) {
            this.router.navigate([`/${ROUTES.recordType}`]);
          }
          this.files = feedback.files;
        }
      );
    this.onlineChangedSubscription = this.domService.onOnlineStateChange()
      .subscribe(online => {
        this.online = online;
      });
    this.online = this.domService.isOnline();
  }

  ngOnDestroy(): void {
    this.onlineChangedSubscription.unsubscribe();
  }

  onFileRemove(file): void {
    this.openClosePreviewDialog(file);
  }

  onAddFile(): void {
    this.router.navigate(
      [`/${ROUTES.recordType}`],
      { queryParams: { back: `/${ROUTES.fileList}` } }
    );
  }

  onConfirmSelection(): void {
    this.router.navigate([`/${ROUTES.upload}`]);
  }

  openClosePreviewDialog(file: BaseFile) {
    const fileName = this.getFilePrefixByType(file.fileType);
    const title = `You are about to delete your ${fileName}`;
    const description = `Would you like to continue?`;
    const buttons = [
      { title: 'Yes', danger: false },
      { title: 'No', danger: false },
    ];

    this.dialogService
      .open(PopupModalComponent, {
        title,
        description,
        buttons,
      })
      .afterClosed()
      .subscribe((result) => {
        switch (result) {
          case 'Yes':
            this.removeFile(file);
            break;
          case 'No':
          default:
            break;
        }
      });
  }

  getFilePrefixByType(fileType: MediaFileType) {
    switch (fileType) {
      case MediaFileType.image:
        return 'photo';
      case MediaFileType.video:
        return 'video';
      case MediaFileType.audio:
        return 'audio';
        default:
      return 'file';
    }
  }

  removeFile(file) {
    this.files = this.files.filter((item) => item.id !== file.id);
    this.currentFeedbackService.get()
      .subscribe(
        feedback => {
          feedback.files = feedback.files.filter((item) => item.id !== file.id);
          this.currentFeedbackService.save().subscribe(() => {});
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

    this.router.navigate([`/${ROUTES.recordType}`]);
  }
}
