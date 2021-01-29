import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fancyUrl'
})
export class FancyUrlPipe implements PipeTransform {

  transform(uri: string, args?: any): any {
    return this.getFancyUrl(uri);
  }

  getFancyUrl(uri: string) {
    const parser = document.createElement('a');
    parser.href = uri;
    return `${parser.hostname}`;
  }

}
