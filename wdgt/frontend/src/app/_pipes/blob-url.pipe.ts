import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'blobUrl'
})
export class BlobUriPipe implements PipeTransform {

  transform(file: any, args?: any): any {
    return URL.createObjectURL(file);
  }

}
