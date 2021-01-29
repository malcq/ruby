import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeBackgroundImage'
})
export class SanitizePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(value: any, args?: any): any {
    const fullStyle = `url('${value}')`;
    const result = this.sanitizer.bypassSecurityTrustStyle(fullStyle);
    return result;
  }
}
