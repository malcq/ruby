import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-file-type-icon',
  templateUrl: './file-type-icon.component.html',
  styleUrls: ['./file-type-icon.component.scss']
})
export class FileTypeIconComponent implements OnInit {

  title = '';
  iconName: string = null;
  inversed = false;

  @Input()
  set type(type: string) {
    const {
      icon,
      title,
      inversed = false
    } = this.getSettingsByType(type);
    this.title = title;
    this.iconName = icon;
    this.inversed = inversed;
  }

  @Output() click = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onTypeClick() {
    this.click.emit();
  }

  getSettingsByType(type: string) {
    const availableOptions = [
      'video', 'photo', 'library',
      'voice', 'text'
    ];

    let inversed = false;

    if (!availableOptions.includes(type)) {
      return {
        icon: 'fallback',
        title: '',
      };
    }

    if (type === 'video') {
      inversed = true;
    }

    return {
      inversed,
      icon: type,
      title: type,
    };
  }

}
