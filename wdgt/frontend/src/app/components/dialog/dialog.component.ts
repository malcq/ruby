import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ComponentFactoryResolver,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';

import { DialogService } from '../../_services/index';
import { HostDirective } from '../../_directives/host.directive';

import { DialogBaseComponent } from './dialog-base.component';

@Component({
  moduleId: module.id,
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent implements OnInit {

  @ViewChild(HostDirective) dialogHost: HostDirective;
  @Output() openAlert = new EventEmitter();
  @Output() closeAlert = new EventEmitter();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.dialogService.onOpen()
      .subscribe(({component, options, events}) => {
        const viewContainerRef = this.dialogHost.viewContainerRef;
        viewContainerRef.clear();
        this.openAlert.emit();
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        const componentRef = viewContainerRef.createComponent(componentFactory);
        (<DialogBaseComponent>componentRef.instance).options = options;
        (<DialogBaseComponent>componentRef.instance).context = {
          close: (result) => {
              events.close.next(result);
          }
        };
        events.close.asObservable()
          .subscribe(result => {
            this.close(result, events.onClose);
          });
    });
  }

  close(result: any, onClose: Subject<any>) {
    this.closeAlert.emit();
    const viewContainerRef = this.dialogHost.viewContainerRef;
    viewContainerRef.clear();
    onClose.next(result);
  }
}
