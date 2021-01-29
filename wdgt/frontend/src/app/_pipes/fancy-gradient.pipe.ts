import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import * as qixColor from 'color';

@Pipe({
  name: 'fancyGradient'
})
export class FancyGradientPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(color: string, args?: any): any {
    const gradient =  this.initColor(color);
    return this.sanitizer.bypassSecurityTrustStyle(gradient);
  }


  initColor(color: string) {
    const { color: originalColors } = qixColor(color).rgb();
    const { color: lightenColors } = qixColor(color).lighten(0.5).rgb();

    const [
      originalRed,
      originalBlue,
      originalGreen,
    ] = originalColors;

    const [
      lightenRed,
      lightenBlue,
      lightenGreen,
    ] = lightenColors;

    const gradient = 'linear-gradient(to top, ' +
      `rgba(${originalRed}, ${originalBlue}, ${originalGreen}, 0.8), ` +
      `rgba(${lightenRed.toFixed()}, ${lightenBlue.toFixed()}, ${lightenGreen.toFixed()}, 1))`;

    return gradient;
  }

}
