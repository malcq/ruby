import { Injectable } from '@angular/core';
import { WidgetService } from './widget.service';

@Injectable()
export class InitializeService {
  constructor(
    private widgetService: WidgetService,
  ) { }

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.widgetService.getConfig()
        .subscribe(
          (config) => {
            console.log(config)
            if (!config.hashcode) {
              reject(new Error('INITIAL ERROR: hashcode not provided'));
            }
            resolve();
          },
          (error) => {
            reject(new Error(`INITIAL ERROR: ${error.message}`));
          }
        );
    })
  }
}
